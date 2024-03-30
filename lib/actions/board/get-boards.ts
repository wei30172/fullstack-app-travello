"use server"

import { getUserSession } from "@/lib/actions/auth/get-user-session"
import connectDB from "@/lib/database/mongodb"

import Board from "@/lib/database/models/board.model"
import { IBoard } from "@/lib/database/models/types"

export const getBoards = async (): Promise<IBoard[]> => {
  const { session } = await getUserSession()

  await connectDB()

  let boards = await Board.find({ userId: session?.user?._id })
    .sort({ createdAt: -1 })

  boards = boards.map(board => {
    const boardObject = board.toObject()
    boardObject._id = boardObject._id.toString()

    return boardObject
  })

  // console.log({boards})
  return boards
}