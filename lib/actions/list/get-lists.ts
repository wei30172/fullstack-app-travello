"use server"

import connectDB from "@/lib/mongodb"
import List from "@/lib/models/list.model"
import Card from "@/lib/models/list.model"
import { IList } from "@/lib/models/types"

export const getLists = async (boardId: string): Promise<IList[]> => {
  connectDB()

  const rawLists = await List.find({ boardId: boardId })
    .populate({
      path: 'cards',
      model: Card,
      options: { sort: { order: 'asc' } } // 按 'order' 升序排列 cards
    })
    .sort({ order: 'asc' }) // 按 'order' 升序排列 lists

  const lists: IList[] = rawLists.map((rawList) => {
    return {
      ...rawList._doc,
      _id: rawList._id.toString()
    }
  })

  // console.log({lists})
  return lists
}