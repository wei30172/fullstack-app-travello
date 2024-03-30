"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import connectDB from "@/lib/database/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"
import {
  ActionState,
  createValidatedAction
} from "@/lib/actions/create-validated-action"

import Card from "@/lib/database/models/card.model"
import List from "@/lib/database/models/list.model"
import Board from "@/lib/database/models/board.model"
import { DeleteBoardValidation } from "@/lib/validations/board"

type DeleteBoardInput = z.infer<typeof DeleteBoardValidation>
type DeleteBoardReturn = ActionState<DeleteBoardInput, null>

const deleteBoardhandler = async (data: DeleteBoardInput): Promise<DeleteBoardReturn> => {
  const { session } = await getUserSession()
  if (!session) { return { error: "Unauthorized" } }

  const { boardId } = data

  try {
    await connectDB()

    // 查詢屬於該 Board 的所有 List 的 ID
    const lists = await List.find({ boardId }).select('_id')

    // 從查詢結果中提取所有 List ID
    const listIds = lists.map(list => list._id)
    
    // 使用這些 List ID 刪除所有相關的 Card
    await Card.deleteMany({ listId: { $in: listIds } })

    // 刪除與該Board相關的所有 List
    await List.deleteMany({ boardId })

    // 刪除Board本身
    await Board.findByIdAndDelete(boardId)

  } catch (error) {
    return { error: "Failed to delete" }
  }

  revalidatePath("/boards")
  redirect("/boards")
}

export const deleteBoard = createValidatedAction(DeleteBoardValidation, deleteBoardhandler)