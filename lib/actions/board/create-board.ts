"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"
import {
  ActionState,
  createValidatedAction
} from "@/lib/create-validated-action"

import Board from "@/lib/models/board.model"
import { IBoard } from "@/lib/models/types"
import { CreateBoardValidation } from "@/lib/validations/board"

type CreateBoardInput = z.infer<typeof CreateBoardValidation>
type CreateBoardReturn = ActionState<CreateBoardInput, IBoard>

const createBoardhandler = async (data: CreateBoardInput): Promise<CreateBoardReturn> => {
  const { session } = await getUserSession()
  if (!session) { return { error: "Unauthorized" } }

  const { title } = data
  // const { title, image } = data
  // const [
  //   imageId,
  //   imageThumbUrl,
  //   imageFullUrl,
  //   imageLinkHTML,
  //   imageUserName
  // ] = image.split("|")
  // if (!imageId || !imageThumbUrl || !imageFullUrl || !imageUserName || !imageLinkHTML) {
  //   return { error: "Missing fields. Failed to create board" }
  // }

  let board

  try {
    connectDB()

    board = new Board({
      title,
      userId: session?.user?._id
      // imageId,
      // imageThumbUrl,
      // imageFullUrl,
      // imageUserName,
      // imageLinkHTML
    })
    
    // console.log({board})
    await board.save()
    
  } catch (error) {
    return { error: "Failed to create" }
  }

  revalidatePath(`/board/${board._id.toString()}`)
  return { data: { ...board._doc, _id: board._id.toString() } }
}

export const createBoard = createValidatedAction(CreateBoardValidation, createBoardhandler)