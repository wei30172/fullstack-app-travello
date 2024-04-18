"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/database/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"
import { ActionState, createValidatedAction } from "@/lib/actions/create-validated-action"
import Board from "@/lib/database/models/board.model"
import { UpdateBoardValidation } from "@/lib/validations/board"

type UpdateBoardInput = z.infer<typeof UpdateBoardValidation>
type UpdateBoardReturn = ActionState<UpdateBoardInput, { title: string }>

const updateBoardhandler = async (data: UpdateBoardInput): Promise<UpdateBoardReturn> => {
  const { session } = await getUserSession()
  if (!session) { return { error: "Unauthorized" } }

  const { id, title, location, startDate, endDate, imageUrl } = data
  
  let board

  try {
    await connectDB()

    board = await Board.findByIdAndUpdate(
      id,
      { $set: { title, location, startDate, endDate, imageUrl } }, // Only update provided content
      { new: true, omitUndefined: true } // Return updated document, updating only the provided content
    )
    // console.log({id, board})

    if (!board) {
      return { error: "Board not found" }
    }

  } catch (error) {
    return { error: "Failed to update" }
  }

  revalidatePath(`/board/${id}`)
  return { data: { title: board.title } }
}

export const updateBoard = createValidatedAction(UpdateBoardValidation, updateBoardhandler)