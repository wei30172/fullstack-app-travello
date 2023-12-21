"use server"

import connectDB from "@/lib/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"

import Board from "@/lib/models/board.model"

export const getBoard = async (boardId: string) => {
  const { session } = await getUserSession()
  
  connectDB()

  let board = await Board.findOne({ _id: boardId, userId: session?.user?._id })

  return { data: { ...board._doc, _id: board._id.toString() } }
}