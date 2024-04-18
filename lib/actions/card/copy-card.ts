"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/database/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"
import { ActionState, createValidatedAction } from "@/lib/actions/create-validated-action"
import List from "@/lib/database/models/list.model"
import Card from "@/lib/database/models/card.model"
import { CopyCardValidation } from "@/lib/validations/card"

type CopyCardInput = z.infer<typeof CopyCardValidation>
type CopyCardReturn = ActionState<CopyCardInput, { title: string }>

const copyCardHandler = async (data: CopyCardInput): Promise<CopyCardReturn> => {
  const { session } = await getUserSession()
  if (!session) { return { error: "Unauthorized" } }

  const { id, boardId } = data

  let card

  try {
    await connectDB()
    
    const cardToCopy = await Card.findById(id)
    if (!cardToCopy) { return { error: "Card not found" } }
    
    const lastCard = await Card.findOne({ listId: cardToCopy.listId })
      .sort({ order: -1 }) // Descending order
      .select({ order: 1 }) // Select the order field

    const newOrder = lastCard ? lastCard.order + 1 : 1

    card = new Card({
      title: `${cardToCopy.title} - Copy`,
      description: cardToCopy.description,
      listId: cardToCopy.listId,
      order: newOrder
    })

    await card.save()

    await List.findByIdAndUpdate(
      card.listId,
      { $push: { cards: card._id }
    })

  } catch (error) {
    return { error: "Failed to copy" }
  }

  revalidatePath(`/board/${boardId}`)
  return { data: { title: card.title } }
}

export const copyCard = createValidatedAction(CopyCardValidation, copyCardHandler)