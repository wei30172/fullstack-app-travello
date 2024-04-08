import { Document } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  password?: string
  image?: string
  role: string
  provider: string
  createdAt: Date
  updatedAt: Date
}

export interface IBoard extends Document {
  userId: string
  title: string
  location: string
  startDate: Date
  endDate: Date
  imageUrl?: string
  lists?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ICard extends Document {
  title: string
  order: number
  description?: string
  listId: string
  createdAt: Date
  updatedAt: Date
}

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