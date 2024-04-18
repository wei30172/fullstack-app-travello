"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/database/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"
import { ActionState, createValidatedAction } from "@/lib/actions/create-validated-action"
import Board from "@/lib/database/models/board.model"
import List from "@/lib/database/models/list.model"
import Card from "@/lib/database/models/card.model"
import { ICard } from "@/lib/database/models/types"
import { CopyListValidation } from "@/lib/validations/list"

type CopyListInput = z.infer<typeof CopyListValidation>
type CopyListReturn = ActionState<CopyListInput, { title: string }>

const copyListHandler = async (data: CopyListInput): Promise<CopyListReturn> => {
  const { session } = await getUserSession()
  if (!session) { return { error: "Unauthorized" } }

  const { id, boardId } = data

  let list

  try {
    await connectDB()

    const listToCopy = await List.findOne({ _id: id, boardId })
      .populate({
        path: 'cards',
        model: Card
      })
  
    if (!listToCopy) {
      return { error: "List not found" }
    }
    
    const lastList = await List.findOne({ boardId })
      .sort({ order: -1 }) // Descending order
      .select({ order: 1 }) // Select the order field
  
    const newOrder = lastList ? lastList.order + 1 : 1
  
    const newList = new List({
      title: `${listToCopy.title} - Copy`,
      boardId: listToCopy.boardId,
      order: newOrder
    })

    // Copy card
    if (listToCopy.cards && listToCopy.cards.length > 0) {
      const copiedCardsData = listToCopy.cards.map((card: ICard) => ({
        title: card.title,
        order: card.order,
        description: card.description,
        listId: newList._id
      }))
  
      const copiedCards = await Card.insertMany(copiedCardsData)

      newList.cards = copiedCards.map(card => card._id)
    }

    list = await newList.save()

    await Board.findByIdAndUpdate(
      boardId,
      { $push: { lists: newList._id }
    })
  } catch (error) {
    return { error: "Failed to copy" }
  }

  revalidatePath(`/board/${boardId}`)
  return { data: { title: list.title } }
}

export const copyList = createValidatedAction(CopyListValidation, copyListHandler)