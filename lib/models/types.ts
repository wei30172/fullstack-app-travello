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
  title: string
  userId: string
  imageId?: string
  imageThumbUrl?: string
  imageFullUrl?: string
  imageUserName?: string
  imageLinkHTML?: string
  lists: string[]
  createdAt: Date
  updatedAt: Date
}

export interface IList extends Document {
  title: string
  order: number
  boardId: string
  cards: string[]
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