"use server"
import { NextResponse } from "next/server"

import { getUserSession } from "@/lib/actions/auth/get-user-session"
import connectDB from "@/lib/mongodb"
import Board from "@/lib/models/board.model"

export const getBoards = async () => {
  const { session } = await getUserSession()

  connectDB()

  let boards = await Board.find({ userId: session?.user?._id }).sort({ createdAt: -1 })

  boards = boards.map(board => {
    return {
      ...board._doc,
      _id: board._id.toString()
    }
  })

  return { data: boards }
}