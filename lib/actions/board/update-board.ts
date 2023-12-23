"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"
import { ActionState, createValidatedAction } from "@/lib/create-validated-action"
import Board from "@/lib/models/board.model"
import { UpdateBoardValidation } from "@/lib/validations/board"

type UpdateBoardInput = z.infer<typeof UpdateBoardValidation>
type UpdateBoardReturn = ActionState<UpdateBoardInput, { title: string }>

const updateBoardhandler = async (data: UpdateBoardInput): Promise<UpdateBoardReturn> => {
  const { session } = await getUserSession()
  if (!session) { return { error: "Unauthorized" } }

  const { title, id } = data

  let board

  try {
    connectDB()

    board = await Board.findByIdAndUpdate(
      id, // 查詢條件
      { title }, // 更新內容  
      { new: true } // 返回更新後的文檔
    )
    // console.log({id, board})

  } catch (error) {
    return { error: "Failed to update" }
  }

  revalidatePath(`/board/${id}`)
  return { data: { title: board.title } }
}

export const updateBoard = createValidatedAction(UpdateBoardValidation, updateBoardhandler)