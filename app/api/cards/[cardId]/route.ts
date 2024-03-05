import { NextResponse } from 'next/server'

import connectDB from '@/lib/mongodb'
import Card from '@/lib/models/card.model'
import List from '@/lib/models/list.model'
import Board from '@/lib/models/board.model'
import { CardWithList } from '@/types'

export async function GET(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  try {
    await connectDB()

    const card = await Card.findById(params.cardId).populate({
      path: 'listId',
      model: List,
      select: 'title boardId',
      populate: {
        path: 'boardId',
        model: Board,
        select: 'userId'
      }
    })

    const cardObject: CardWithList = {
      ...card.toObject(),
      _id: card._id.toString(),
      listId: card.listId._id.toString(),
      list: {
        title: card.listId.title
      }
    }

    // console.log({cardObject})

    return NextResponse.json(cardObject)
  } catch (error) {
    console.error(error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}