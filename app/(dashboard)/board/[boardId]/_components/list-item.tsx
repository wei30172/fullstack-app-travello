"use client"

import { ElementRef, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { ICard } from "@/lib/models/types"
import { ListWithCards } from "@/types"

import { ListHeader } from "./list-header"

interface ListItemProps {
  listData: ListWithCards
  index: number
}

export const ListItem = ({
  listData,
  index,
}: ListItemProps) => {
  const textareaRef = useRef<ElementRef<"textarea">>(null)

  const [isEditing, setIsEditing] = useState(false)

  const disableEditing = () => {
    setIsEditing(false)
  }

  const enableEditing = () => {
    setIsEditing(true)
    setTimeout(() => {
      textareaRef.current?.focus()
    })
  }

  return (
    <li className="shrink-0 h-full w-[272px] select-none">
      <div className="w-full rounded-md bg-gray-100 shadow-md pb-2">
        <ListHeader 
          onAddCard={enableEditing}
          listData={listData}
        />
          <ol
            className={cn(
              "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
              listData.cards.length > 0 ? "mt-2" : "mt-0",
            )}
          >
          </ol>
      </div>
    </li>
  )
}