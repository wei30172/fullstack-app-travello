import { Document } from "mongoose"

import { ICard } from "@/lib/models/types"

export interface ListWithCards extends Document {
  title: string
  order: number
  boardId: string
  cards: ICard[]
  createdAt: Date
  updatedAt: Date
}

export interface CardWithList extends Document {
  title: string
  order: number
  description?: string
  listId: string
  createdAt: Date
  updatedAt: Date
  list: { title: string }
}