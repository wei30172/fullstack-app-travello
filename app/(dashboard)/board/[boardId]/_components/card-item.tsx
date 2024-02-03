"use client"

import { ICard } from "@/lib/models/types"
import { Draggable } from "@hello-pangea/dnd"

interface CardItemProps {
  cardData: ICard
  index: number
}

export const CardItem = ({
  cardData,
  index,
}: CardItemProps) => {

  return (
    <Draggable draggableId={cardData._id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm"
        >
          {cardData.title}
        </div>
      )}
    </Draggable>
  )
}