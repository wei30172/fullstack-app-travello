"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"
import { ActionState, createValidatedAction } from "@/lib/create-validated-action"
import List from "@/lib/models/list.model"
import { UpdateListValidation } from "@/lib/validations/list"

type UpdateListInput = z.infer<typeof UpdateListValidation>
type UpdateListReturn = ActionState<UpdateListInput, { title: string }>

const updateListHandler = async (data: UpdateListInput): Promise<UpdateListReturn> => {
  const { session } = await getUserSession()
  if (!session) { return { error: "Unauthorized" } }

  const { title, id, boardId } = data

  let list

  try {
    await connectDB()

    list = await List.findOneAndUpdate(
      { _id: id, boardId: boardId }, // 查詢條件
      { title }, // 更新內容
      { new: true } // 返回更新後的文檔
    )

  } catch (error) {
    return { error: "Failed to update" }
  }
  
  revalidatePath(`/board/${boardId}`)
  return { data: { title: list.title } }
}

export const updateList = createValidatedAction(UpdateListValidation, updateListHandler)