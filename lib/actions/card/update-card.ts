"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/database/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"
import { ActionState, createValidatedAction } from "@/lib/actions/create-validated-action"
import Card from "@/lib/database/models/card.model"
import { ICard } from "@/lib/database/models/types"
import { UpdateCardValidation } from "@/lib/validations/card"

type UpdateCardInput = z.infer<typeof UpdateCardValidation>
type UpdateCardReturn = ActionState<UpdateCardInput, ICard>

const updateCardHandler = async (data: UpdateCardInput): Promise<UpdateCardReturn> => {
  const { session } = await getUserSession()
  if (!session) { return { error: "Unauthorized" } }

  const { id, boardId, ...updateData } = data
  
  let card

  try {
    await connectDB()

    card = await Card.findByIdAndUpdate(
      { _id: id },
      updateData,
      { new: true } // Return updated document
    )

  } catch (error) {
    return { error: "Failed to update" }
  }

  const cardObject = card.toObject()
  cardObject._id = cardObject._id.toString()
  cardObject.listId = cardObject.listId.toString()

  revalidatePath(`/board/${boardId}`)
  return { data: cardObject }
}

export const updateCard = createValidatedAction(UpdateCardValidation, updateCardHandler)