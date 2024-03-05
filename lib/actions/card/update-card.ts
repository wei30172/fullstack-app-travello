"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"
import { ActionState, createValidatedAction } from "@/lib/create-validated-action"
import Card from "@/lib/models/card.model"
import { ICard } from "@/lib/models/types"
import { UpdateCardValidation } from "@/lib/validations/card"

type UpdateCardInput = z.infer<typeof UpdateCardValidation>
type UpdateCardReturn = ActionState<UpdateCardInput, ICard>

const updateCardHandler = async (data: UpdateCardInput): Promise<UpdateCardReturn> => {
  const { session } = await getUserSession()
  if (!session) { return { error: "Unauthorized" } }

  const { id, boardId, ...updateData } = data
  
  let card

  try {
    connectDB()

    card = await Card.findByIdAndUpdate(
      { _id: id }, // 查詢條件
      updateData, // 更新內容
      { new: true } // 返回更新後的文檔
    )

  } catch (error) {
    return { error: "Failed to update" }
  }

  const cardObject = card.toObject()
  cardObject._id = cardObject._id.toString()
  cardObject.listId = cardObject.listId.toString()

  revalidatePath(`/board/${boardId}`)
  return { data: cardObject }
}

export const updateCard = createValidatedAction(UpdateCardValidation, updateCardHandler)