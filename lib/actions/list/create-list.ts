"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/database/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"
import { ActionState, createValidatedAction } from "@/lib/actions/create-validated-action"
import Board from "@/lib/database/models/board.model"
import List from "@/lib/database/models/list.model"
import { IList } from "@/lib/database/models/types"
import { CreateListValidation } from "@/lib/validations/list"
import { createCardHandler } from "@/lib/actions/card/create-card"
import { deleteCardHandler } from "@/lib/actions/card/delete-card"

type CreateListInput = z.infer<typeof CreateListValidation>
type CreateListReturn = ActionState<CreateListInput, { title: string }>

export const createListHandler = async (data: CreateListInput): Promise<CreateListReturn> => {
  const { session } = await getUserSession()
  if (!session) { return { error: "Unauthorized" } }

  const { title, boardId, cardTitles } = data

  let list: IList

  try {
    await connectDB()

    const board = await Board.findById(boardId)

    if (!board) {
      return { error: "Trip not found" }
    }

    const lastList = await List.findOne({ boardId })
      .sort({ order: -1 }) // Descending order
      .select({ order: 1 }) // Select the order field
    
    const newOrder = lastList ? lastList.order + 1 : 0

    list = new List({ title, order: newOrder, boardId })
    // console.log({list})

    await list.save()

    await Board.findByIdAndUpdate(
      boardId,
      { $push: { lists: list._id }
    })

    if (cardTitles && cardTitles?.length > 0) {
      const cardPromises = cardTitles.map(title => createCardHandler({
        title,
        boardId,
        listId: list._id.toString()
      }))

      // Executes multiple promises in parallel,
      // returning a single promise that resolves after all of the input promises have either resolved or rejected,
      // with an array of objects describing the outcome of each promise.
      const cardResults = await Promise.allSettled(cardPromises)
      const failedCards = cardResults.filter(result => result.status === 'rejected')
      
      if (failedCards.length > 0) {
        const succeededCards = cardResults.filter(result => result.status === 'fulfilled') as PromiseFulfilledResult<any>[]
        const deletePromises = succeededCards.map(card => deleteCardHandler({
          id: card.value.data._id,
          boardId
        }))

        await Promise.allSettled(deletePromises)
        throw new Error('Failed to fully create list and cards')
      }
    }

  } catch (error) {
    return { error: "Failed to create" }
  }
  
  revalidatePath(`/board/${boardId}`)
  return { data: { title: list.title } }
}

export const createList = createValidatedAction(CreateListValidation, createListHandler)