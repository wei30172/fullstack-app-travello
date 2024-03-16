"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"
import { ActionState, createValidatedAction } from "@/lib/create-validated-action"
import Card from "@/lib/models/card.model"
import List from "@/lib/models/list.model"
import { UpdateCardOrderValidation} from "@/lib/validations/card"

type UpdateCardOrderInput = z.infer<typeof UpdateCardOrderValidation>
type UpdateCardOrderReturn = ActionState<UpdateCardOrderInput, { id: string }>

const updateCardOrderHandler = async (data: UpdateCardOrderInput): Promise<UpdateCardOrderReturn> => {
  const { session } = await getUserSession()
  if (!session) { return { error: "Unauthorized" } }

  const { items, boardId, } = data

  try {
    await connectDB()

    const updateOperations = items.map(async (card) => {
      const currentCard = await Card.findById(card._id)
      if (!currentCard) throw new Error('Card not found')

      const sourceListId = currentCard.listId
      const targetListId = card.listId

      if (sourceListId.toString() !== targetListId.toString()) {
        // 從原始列表中移除卡片ID
        await List.updateOne(
          { _id: sourceListId },
          { $pull: { cards: card._id } }
        );

        // 將卡片ID新增到新列表
        await List.updateOne(
          { _id: targetListId },
          { $push: { cards: card._id } }
        );
      }

      // 更新卡片的 order 和 listId
      return Card.updateOne(
        { _id: card._id },
        { $set: { order: card.order, listId: card.listId } }
      )
    })

    // 等待所有操作完成
    await Promise.all(updateOperations)

  } catch (error) {
    return { error: "Failed to reorder" }
  }

  revalidatePath(`/board/${boardId}`)
  return { data: { id: boardId } }
}

export const updateCardOrder = createValidatedAction(UpdateCardOrderValidation, updateCardOrderHandler)