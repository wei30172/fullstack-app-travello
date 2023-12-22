"use client"

import { useEffect, useState } from "react"
import { IList } from "@/lib/models/types"

import { useToast } from "@/components/ui/use-toast"
import { ListForm } from "./list-form"
import { ListItem } from "./list-item"

interface ListContainerProps {
  data: IList[]
  boardId: string
}

export const ListContainer = ({
  data,
  boardId
}: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data)

  useEffect(() => {
    setOrderedData(data)
  }, [data])

  return (
    <ol 
      className="flex gap-x-3 h-full"
    >
      {orderedData.map((list, index) => {
        return (
          <ListItem
            key={list._id}
            index={index}
            data={list}
          />
        )
      })}
      <ListForm />
      <div className="flex-shrink-0 w-1" />
    </ol>
  )
}