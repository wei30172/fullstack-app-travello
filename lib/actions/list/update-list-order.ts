"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"
import { ActionState, createValidatedAction } from "@/lib/create-validated-action"
import List from "@/lib/models/list.model"
import { UpdateListOrderValidation } from "@/lib/validations/list"

type UpdateListOrderInput = z.infer<typeof UpdateListOrderValidation>
type UpdateListOrderReturn = ActionState<UpdateListOrderInput, { id: string }>

const updateListOrderHandler = async (data: UpdateListOrderInput): Promise<UpdateListOrderReturn> => {
  const { session } = await getUserSession()
  if (!session) { return { error: "Unauthorized" } }

  const { items, boardId } = data

  try {
    connectDB()

    const updateOperations = items.map(list => 
      List.updateOne(
        { _id: list._id }, // 查詢條件
        { $set: { order: list.order } } // 更新内容
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

export const updateListOrder = createValidatedAction(UpdateListOrderValidation, updateListOrderHandler)