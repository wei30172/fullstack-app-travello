"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/database/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"
import { ActionState, createValidatedAction } from "@/lib/actions/create-validated-action"
import Board from "@/lib/database/models/board.model"
import List from "@/lib/database/models/list.model"
import Card from "@/lib/database/models/card.model"
import { ICard } from "@/lib/database/models/types"
import { CopyListValidation } from "@/lib/validations/list"

type CopyListInput = z.infer<typeof CopyListValidation>
type CopyListReturn = ActionState<CopyListInput, { title: string }>

const copyListHandler = async (data: CopyListInput): Promise<CopyListReturn> => {
  const { session } = await getUserSession()
  if (!session) { return { error: "Unauthorized" } }

  const { id, boardId } = data

  let list

  try {
    await connectDB()

    const listToCopy = await List.findOne({ _id: id, boardId: boardId })
      .populate({
        path: 'cards',
        model: Card
      })
  
    if (!listToCopy) {
      return { error: "List not found" }
    }
  
    const lastList = await List.findOne({ boardId: boardId })
      .sort({ order: -1 }) // -1 表示降序
      .select({ order: 1 }) // 只選取 order 字段
  
    const newOrder = lastList ? lastList.order + 1 : 1
  
    // 建立新列表
    const newList = new List({
      title: `${listToCopy.title} - Copy`,
      boardId: listToCopy.boardId,
      order: newOrder
    })

    // 複製卡片
    if (listToCopy.cards && listToCopy.cards.length > 0) {
      const copiedCardsData = listToCopy.cards.map((card: ICard) => ({
        title: card.title,
        order: card.order,
        description: card.description,
        listId: newList._id
      }))
  
      const copiedCards = await Card.insertMany(copiedCardsData)

      // 更新新清單的 cards 欄位為新建立的卡片 ID
      newList.cards = copiedCards.map(card => card._id)
    }

    list = await newList.save()

    await Board.findByIdAndUpdate(
      boardId, // 查詢條件
      { $push: { lists: newList._id } // 更新內容
    })
  } catch (error) {
    return { error: "Failed to copy" }
  }

  revalidatePath(`/board/${boardId}`)
  return { data: { title: list.title } }
}

export const copyList = createValidatedAction(CopyListValidation, copyListHandler)