"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import connectDB from "@/lib/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"
import {
  ActionState,
  createValidatedAction
} from "@/lib/create-validated-action"

import Board from "@/lib/models/board.model"
import { IBoard } from "@/lib/models/types"
import { DeleteBoardValidation } from "@/lib/validations/board"

type DeleteBoardInput = z.infer<typeof DeleteBoardValidation>
type DeleteBoardReturn = ActionState<DeleteBoardInput, IBoard>

const deleteBoardhandler = async (data: DeleteBoardInput): Promise<DeleteBoardReturn> => {
  const { session } = await getUserSession()
  if (!session) { return { error: "Unauthorized" } }

  const { id } = data

  let board

  try {
    connectDB()

    board = await Board.findByIdAndDelete(id)
    
  } catch (error) {
    return { error: "Failed to delete" }
  }

  revalidatePath("/boards")
  redirect("/boards")
}

export const deleteBoard = createValidatedAction(DeleteBoardValidation, deleteBoardhandler)