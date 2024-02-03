"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"
import { ActionState, createValidatedAction } from "@/lib/create-validated-action"
import Card from "@/lib/models/card.model"
import { UpdateCardOrderValidation} from "@/lib/validations/card"

type UpdateCardOrderInput = z.infer<typeof UpdateCardOrderValidation>
type UpdateCardOrderReturn = ActionState<UpdateCardOrderInput, { id: string }>

const updateCardOrderHandler = async (data: UpdateCardOrderInput): Promise<UpdateCardOrderReturn> => {
  const { session } = await getUserSession()
  if (!session) { return { error: "Unauthorized" } }

  const { items, boardId, } = data

  try {
    connectDB()

    const updateOperations = items.map(card => 
      Card.updateOne(
        { _id: card._id }, // 查詢條件
        { $set: { order: card.order } } // 更新内容
      )
    )

    // 同時執行所有更新操作
    await Promise.all(updateOperations)

  } catch (error) {
    return { error: "Failed to reorder" }
  }

  revalidatePath(`/board/${boardId}`)
  return { data: { id: boardId } }
}

export const updateCardOrder = createValidatedAction(UpdateCardOrderValidation, updateCardOrderHandler)