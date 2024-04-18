"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/database/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"
import { ActionState, createValidatedAction } from "@/lib/actions/create-validated-action"
import List from "@/lib/database/models/list.model"
import { UpdateListOrderValidation } from "@/lib/validations/list"

type UpdateListOrderInput = z.infer<typeof UpdateListOrderValidation>
type UpdateListOrderReturn = ActionState<UpdateListOrderInput, { id: string }>

const updateListOrderHandler = async (data: UpdateListOrderInput): Promise<UpdateListOrderReturn> => {
  const { session } = await getUserSession()
  if (!session) { return { error: "Unauthorized" } }

  const { lists, boardId } = data

  try {
    await connectDB()

    const updateOperations = lists.map(list => 
      List.updateOne(
        { _id: list._id },
        { $set: { order: list.order } }
      )
    )
  
    // Executes multiple promises in parallel,
    // returning a single promise that resolves when all of the input promises have resolved,
    // or rejects if any input promise rejects.
    await Promise.all(updateOperations)
  
  } catch (error) {
    return { error: "Failed to reorder" }
  }

  revalidatePath(`/board/${boardId}`)
  return { data: { id: boardId } }
}

export const updateListOrder = createValidatedAction(UpdateListOrderValidation, updateListOrderHandler)