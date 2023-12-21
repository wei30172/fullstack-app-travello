"use server"

import mongoose from "mongoose"
import connectDB from "@/lib/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"

import Board from "@/lib/models/board.model"
import { IBoard } from "@/lib/models/types"


export const getBoard = async (boardId: string): Promise<IBoard | null> => {
  const { session } = await getUserSession()
  
  connectDB()

  if (!boardId || !mongoose.Types.ObjectId.isValid(boardId)) {
    console.error('Invalid boardId:', boardId)
    return null
  }

  const board = await Board.findOne({ _id: boardId, userId: session?.user?._id })

  // console.log({board})
  return { ...board._doc, _id: board._id.toString() }
}