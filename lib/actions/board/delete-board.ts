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

    // Find the IDs of all Lists belonging to this Board
    const lists = await List.find({ boardId }).select('_id')

    // Extract all List IDs from results
    const listIds = lists.map(list => list._id)
    
    // Delete all related Cards using these List IDs
    await Card.deleteMany({ listId: { $in: listIds } })

    // Delete all Lists related to this Board
    await List.deleteMany({ boardId })

    // Delete the Board itself
    await Board.findByIdAndDelete(boardId)

  } catch (error) {
    return { error: "Failed to delete" }
  }

  revalidatePath("/boards")
  redirect("/boards")
}

export const deleteBoard = createValidatedAction(DeleteBoardValidation, deleteBoardhandler)