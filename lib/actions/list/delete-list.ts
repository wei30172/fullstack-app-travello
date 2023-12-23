"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"
import { ActionState, createValidatedAction } from "@/lib/create-validated-action"
import Card from "@/lib/models/card.model"
import List from "@/lib/models/list.model"
import Board from "@/lib/models/board.model"
import { DeleteListValidation } from "@/lib/validations/list"

type DeleteListInput = z.infer<typeof DeleteListValidation>
type DeleteListReturn = ActionState<DeleteListInput, { title: string }>

const deleteListHandler = async (data: DeleteListInput): Promise<DeleteListReturn> => {
  const { session } = await getUserSession()
  if (!session) { return { error: "Unauthorized" } }

  const { id, boardId } = data

  let list

  try {
    connectDB()

    list = await List.findById(id)
    
    if (!list) {
      return { error: "List not found" }
    }

    // 刪除與該List相關的所有Card
    await Card.deleteMany({ listId: id })

    // 刪除List本身
    await List.findByIdAndDelete(id)

    // 更新Board數據，移除該List的引用
    await Board.findByIdAndUpdate(boardId, {
      $pull: { lists: id }
    })

  } catch (error) {
    return { error: "Failed to delete" }
  }
  
  
  revalidatePath(`/board/${boardId}`)
  return { data: { title: list.title } }
}

export const deleteList = createValidatedAction(DeleteListValidation, deleteListHandler)