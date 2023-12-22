import { Document, Types } from "mongoose"

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
  userId: Types.ObjectId | string
  imageId?: string
  imageThumbUrl?: string
  imageFullUrl?: string
  imageUserName?: string
  imageLinkHTML?: string
  lists: Types.ObjectId[] | string[]
  createdAt: Date
  updatedAt: Date
}

export interface IList extends Document {
  title: string
  order: number
  boardId: Types.ObjectId | string
  cards: Types.ObjectId[] | string[]
  createdAt: Date
  updatedAt: Date
}

export interface ICard extends Document {
  title: string
  order: number
  description?: string
  listId: Types.ObjectId | string
  createdAt: Date
  updatedAt: Date
}