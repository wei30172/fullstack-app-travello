"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/database/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"
import { ActionState, createValidatedAction } from "@/lib/actions/create-validated-action"
import Board from "@/lib/database/models/board.model"
import List from "@/lib/database/models/list.model"
import { CreateListValidation } from "@/lib/validations/list"

type CreateListInput = z.infer<typeof CreateListValidation>
type CreateListReturn = ActionState<CreateListInput, { title: string }>

const createListHandler = async (data: CreateListInput): Promise<CreateListReturn> => {
  const { session } = await getUserSession()
  if (!session) { return { error: "Unauthorized" } }

  const { title, boardId } = data

  let list

  try {
    await connectDB()

    const board = await Board.findById(boardId)

    if (!board) {
      return { error: "Board not found" }
    }

    // 取得最後一個 List 的順序
    const lastList = await List.findOne({ boardId: boardId })
      .sort({ order: -1 }) // -1 表示降序
      .select({ order: 1 }) // 只選取 order 字段
    
    const newOrder = lastList ? lastList.order + 1 : 0

    list = new List({ title, boardId: boardId, order: newOrder })
    // console.log({list})

    await list.save()

    await Board.findByIdAndUpdate(
      boardId, // 查詢條件
      { $push: { lists: list._id } // 更新內容
    })

  } catch (error) {
    return { error: "Failed to create" }
  }
  
  revalidatePath(`/board/${boardId}`)
  return { data: { title: list.title } }
}

export const createList = createValidatedAction(CreateListValidation, createListHandler)