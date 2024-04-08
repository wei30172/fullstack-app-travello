"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/database/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"
import {
  ActionState,
  createValidatedAction
} from "@/lib/actions/create-validated-action"

import Board from "@/lib/database/models/board.model"
import { CreateBoardValidation } from "@/lib/validations/board"

type CreateBoardInput = z.infer<typeof CreateBoardValidation>
type CreateBoardReturn = ActionState<CreateBoardInput, { _id: string }>

const createBoardhandler = async (data: CreateBoardInput): Promise<CreateBoardReturn> => {
  const { session } = await getUserSession()
  if (!session) { return { error: "Unauthorized" } }

  let board

  try {
    await connectDB()

    board = new Board({
      ...data,
      userId: session?.user?._id
    })
    
    // console.log({board})
    await board.save()
    
  } catch (error) {
    return { error: "Failed to create" }
  }

  revalidatePath(`/board/${board._id.toString()}`)
  return { data: { _id: board._id.toString() } }
}

export const createBoard = createValidatedAction(CreateBoardValidation, createBoardhandler)