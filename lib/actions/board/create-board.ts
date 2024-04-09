"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/database/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"
import {
  ActionState,
  createValidatedAction
} from "@/lib/actions/create-validated-action"
import { calculateDays, formatDateTime } from "@/lib/utils"

import Board from "@/lib/database/models/board.model"
import { CreateBoardValidation } from "@/lib/validations/board"
import { createListHandler } from "@/lib/actions/list/create-list"


type CreateBoardInput = z.infer<typeof CreateBoardValidation>
type CreateBoardReturn = ActionState<CreateBoardInput, { _id: string }>

export const createBoardhandler = async (data: CreateBoardInput): Promise<CreateBoardReturn> => {
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

    const days = calculateDays(data.startDate, data.endDate)
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(data.startDate.getTime() + i * (1000 * 60 * 60 * 24))
      const { dateOnly } = formatDateTime(currentDate)

      const listData = {
        title: `Day ${i + 1}: ${dateOnly}`,
        boardId: board._id.toString()
      }

      const listResult = await createListHandler(listData)
      if (listResult.error) {
        throw new Error(listResult.error)
      }
    }
  } catch (error) {
    return { error: "Failed to create" }
  }

  revalidatePath(`/board/${board._id.toString()}`)
  return { data: { _id: board._id.toString() } }
}

export const createBoard = createValidatedAction(CreateBoardValidation, createBoardhandler)
