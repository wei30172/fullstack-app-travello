"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/database/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"
import { ActionState, createValidatedAction } from "@/lib/actions/create-validated-action"
import Card from "@/lib/database/models/card.model"
import List from "@/lib/database/models/list.model"
import Board from "@/lib/database/models/board.model"
import { DeleteListValidation } from "@/lib/validations/list"

type DeleteListInput = z.infer<typeof DeleteListValidation>
type DeleteListReturn = ActionState<DeleteListInput, { title: string }>

const deleteListHandler = async (data: DeleteListInput): Promise<DeleteListReturn> => {
  const { session } = await getUserSession()
  if (!session) { return { error: "Unauthorized" } }

  const { id, boardId } = data

  let list

  try {
    await connectDB()

    list = await List.findById(id)
    
    if (!list) {
      return { error: "List not found" }
    }

    // Delete all Cards related to this List
    await Card.deleteMany({ listId: id })

    // Delete the List itself
    await List.findByIdAndDelete(id)

    // Remove the Board's reference to the List
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