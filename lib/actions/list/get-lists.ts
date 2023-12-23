"use server"

import connectDB from "@/lib/mongodb"

import List from "@/lib/models/list.model"
import { IList } from "@/lib/models/types"

export const getLists = async (boardId: string): Promise<IList[]> => {
  connectDB()

  let lists = await List.find({ boardId: boardId })
    // .populate({
    //   path: 'cards',
    //   model: Card,
    //   options: { sort: { order: 'asc' } } // 按 'order' 升序排列 cards
    // })
    .sort({ order: 'asc' }) // 按 'order' 升序排列 lists

  lists = lists.map(list => {
    const listObject = list.toObject()
    listObject._id = listObject._id.toString()
    listObject.boardId = listObject.boardId.toString()

    return listObject
  })

  // console.log({lists})
  return lists
}