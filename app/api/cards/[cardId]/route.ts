import { NextResponse } from 'next/server'

import connectDB from '@/lib/database/mongodb'
import { CardWithList } from '@/lib/database/models/types'
import Card from '@/lib/database/models/card.model'
import List from '@/lib/database/models/list.model'
import Board from '@/lib/database/models/board.model'

export async function GET(
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
  
    if (!card) {
      new NextResponse('Card not found', { status: 404 })
    }

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
    console.error('[ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}