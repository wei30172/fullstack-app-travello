"use server"

import mongoose from "mongoose"
import connectDB from "@/lib/database/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"

import Board from "@/lib/database/models/board.model"
import { IBoard } from "@/lib/database/models/types"


export const getBoard = async (boardId: string): Promise<IBoard | null> => {
  const { session } = await getUserSession()
  
  await connectDB()

  // console.log({boardId})
  if (!boardId || !mongoose.Types.ObjectId.isValid(boardId)) {
    console.error('Invalid boardId:', boardId)
    return null
  }

  const board = await Board.findOne({ _id: boardId, userId: session?.user?._id })

  if (!board) {
    console.log("Board not found")
    return null
  }

  const boardObject = board.toObject()
  boardObject._id = boardObject._id.toString()
  boardObject.userId = boardObject.userId._id.toString()

  if (boardObject.lists) {
    boardObject.lists = boardObject.lists.map((id: mongoose.Types.ObjectId) => id.toString())
  }
  
  // console.log({boardObject})
  return boardObject
}