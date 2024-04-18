"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/database/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"
import { ActionState, createValidatedAction } from "@/lib/actions/create-validated-action"
import Card from "@/lib/database/models/card.model"
import List from "@/lib/database/models/list.model"
import { UpdateCardOrderValidation} from "@/lib/validations/card"

type UpdateCardOrderInput = z.infer<typeof UpdateCardOrderValidation>
type UpdateCardOrderReturn = ActionState<UpdateCardOrderInput, { id: string }>

const updateCardOrderHandler = async (data: UpdateCardOrderInput): Promise<UpdateCardOrderReturn> => {
  const { session } = await getUserSession()
  if (!session) { return { error: "Unauthorized" } }

  const { cards, boardId, } = data

  try {
    await connectDB()

    const updateOperations = cards.map(async (card) => {
      const currentCard = await Card.findById(card._id)
      if (!currentCard) throw new Error('Card not found')

      const sourceListId = currentCard.listId
      const destListId = card.listId

      if (sourceListId.toString() !== destListId.toString()) {
        // Remove card ID from source list
        await List.updateOne(
          { _id: sourceListId },
          { $pull: { cards: card._id } }
        );

        // Add card ID to destination list
        await List.updateOne(
          { _id: destListId },
          { $push: { cards: card._id } }
        );
      }

      // Update the card's order and listId
      return Card.updateOne(
        { _id: card._id },
        { $set: { order: card.order, listId: card.listId } }
      )
    })

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

export const updateCardOrder = createValidatedAction(UpdateCardOrderValidation, updateCardOrderHandler)