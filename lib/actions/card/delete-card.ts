"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"
import { ActionState, createValidatedAction } from "@/lib/create-validated-action"
import Card from "@/lib/models/card.model"
import List from "@/lib/models/list.model"
import { DeleteCardValidation } from "@/lib/validations/card"

type DeleteCardInput = z.infer<typeof DeleteCardValidation>
type DeleteCardReturn = ActionState<DeleteCardInput, { title: string }>

const deleteCardHandler = async (data: DeleteCardInput): Promise<DeleteCardReturn> => {
  const { session } = await getUserSession()
  if (!session) { return { error: "Unauthorized" } }

  const { id, boardId } = data

  let card

  try {
    connectDB()
    
    card = await Card.findById(id)
    
    if (!card) {
      return { error: "Card not found" }
    }
  
    // 刪除Card本身
    await Card.findByIdAndDelete(id)

    // 更新List數據，移除該Card的引用
    await List.findByIdAndUpdate(card.listId, {
      $pull: { cards: id }
    })

  } catch (error) {
    return { error: "Failed to delete" }
  }

  revalidatePath(`/board/${boardId}`)
  return { data: { title: card.title } }
}

export const deleteCard = createValidatedAction(DeleteCardValidation, deleteCardHandler)