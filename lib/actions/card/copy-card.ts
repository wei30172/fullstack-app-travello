"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"
import { ActionState, createValidatedAction } from "@/lib/create-validated-action"
import List from "@/lib/models/list.model"
import Card from "@/lib/models/card.model"
import { CopyCardValidation } from "@/lib/validations/card"

type CopyCardInput = z.infer<typeof CopyCardValidation>
type CopyCardReturn = ActionState<CopyCardInput, { title: string }>

const copyCardHandler = async (data: CopyCardInput): Promise<CopyCardReturn> => {
  const { session } = await getUserSession()
  if (!session) { return { error: "Unauthorized" } }

  const { id, boardId } = data

  let card

  try {
    connectDB()
    
    const cardToCopy = await Card.findById(id)
    if (!cardToCopy) { return { error: "Card not found" } }

    const lastCard = await Card.findOne({ listId: cardToCopy.listId })
      .sort({ order: -1 }) // -1 表示降序
      .select({ order: 1 }) // 只選取 order 字段

    const newOrder = lastCard ? lastCard.order + 1 : 1

     // 建立新卡片
    card = new Card({
      title: `${cardToCopy.title} - Copy`,
      description: cardToCopy.description,
      listId: cardToCopy.listId,
      order: newOrder
    })

    await card.save()

    await List.findByIdAndUpdate(
      card.listId, // 查詢條件
      { $push: { cards: card._id } // 更新內容
    })

  } catch (error) {
    return { error: "Failed to copy" }
  }

  revalidatePath(`/board/${boardId}`)
  return { data: { title: card.title } }
}

export const copyCard = createValidatedAction(CopyCardValidation, copyCardHandler)