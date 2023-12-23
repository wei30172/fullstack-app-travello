"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"
import { ActionState, createValidatedAction } from "@/lib/create-validated-action"
import List from "@/lib/models/list.model"
import Card from "@/lib/models/card.model"
import { ICard } from "@/lib/models/types"
import { CreateCardValidation } from "@/lib/validations/card"

type CreateCardInput = z.infer<typeof CreateCardValidation>
type CreateCardReturn = ActionState<CreateCardInput, ICard>

const createCardHandler = async (data: CreateCardInput): Promise<CreateCardReturn> => {
  const { session } = await getUserSession()
  if (!session) { return { error: "Unauthorized" } }

  const { title, boardId, listId } = data

  let card

  try {
    connectDB()

    const list = await List.findById(listId)
    
    if (!list) {
      return { error: "List not found" }
    }

    // 取得最後一個 Card 的順序
    const lastCard = await Card.findOne({ listId })
      .sort({ order: -1 }) // -1 表示降序
      .select({ order: 1 }) // 只選取 order 字段

    const newOrder = lastCard ? lastCard.order + 1 : 1

    card = new Card({ title, listId, order: newOrder })
    // console.log({card})

    await card.save()

    await List.findByIdAndUpdate(
      listId, // 查詢條件
      { $push: { cards: card._id } // 更新內容
    })

  } catch (error) {
    return { error: "Failed to create" }
  }
  
  const cardObject = card.toObject()
  cardObject._id = cardObject._id.toString()
  cardObject.listId = cardObject.listId.toString()

  revalidatePath(`/board/${boardId}`)
  return { data: cardObject }
}

export const createCard = createValidatedAction(CreateCardValidation, createCardHandler)