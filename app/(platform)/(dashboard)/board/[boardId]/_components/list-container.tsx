"use client"

import { useEffect, useState } from "react"
import { DragDropContext, Droppable } from "@hello-pangea/dnd"
import { useAction } from "@/hooks/use-validated-action"
import { ListWithCards } from "@/lib/database/models/types"
import { updateListOrder } from "@/lib/actions/list/update-list-order"
import { updateCardOrder } from "@/lib/actions/card/update-card-order"

import { useToast } from "@/components/ui/use-toast"
import { ListForm } from "./list-form"
import { ListItem } from "./list-item"

interface ListContainerProps {
  data: ListWithCards[]
  boardId: string
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

export const ListContainer = ({
  data,
  boardId
}: ListContainerProps) => {
  const { toast } = useToast()
  const [orderedData, setOrderedData] = useState(data)

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast({
        status: "success",
        title: "List reordered"
      })
    },
    onError: (error) => {toast({ status: "error", description: error })}
  })

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast({
        status: "success",
        title: "Card reordered"
      })
    },
    onError: (error) => {toast({ status: "error", description: error })}
  })

  useEffect(() => {
    setOrderedData(data)
  }, [data])

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result

    if (!destination) return

    // 如果移動到相同位置
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    // 移動整個 list
    if (type === "list") {
      const lists = reorder(
        orderedData,
        source.index,
        destination.index,
      ).map((list, index) => ({ ...list, order: index })) as ListWithCards[]

      setOrderedData(lists)

      const listsForUpdate = lists.map(list => ({
        _id: list._id,
        order: list.order
      }))
      executeUpdateListOrder({ items: listsForUpdate, boardId })
    }

    // 移動單個 card
    if (type === "card") {
      let newOrderedData = [...orderedData]

      // 列表來源及目標列表
      const sourceList = newOrderedData.find(list => list._id === source.droppableId)
      const destList = newOrderedData.find(list => list._id === destination.droppableId)

      if (!sourceList || !destList) {
        return
      }

      // 確認 cards 是否存在於列表來源
      if (!sourceList.cards) {
        sourceList.cards = []
      }

      // 確認 cards 是否存在於目標列表
      if (!destList.cards) {
        destList.cards = []
      }

      // 卡片移動到同一 list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        )

        // 更新 card 順序
        reorderedCards.forEach((card, idx) => {
          card.order = idx
        })

        // 更新來源列表中的卡片
        sourceList.cards = reorderedCards

        setOrderedData(newOrderedData)

        const cardsForUpdate = reorderedCards.map(card => ({
          _id: card._id,
          order: card.order,
          listId: sourceList._id
        }))
        
        executeUpdateCardOrder({ items: cardsForUpdate, boardId })

      // 卡片移動到另一list
      } else {
        // 從來源列表中移除 card
        const [movedCard] = sourceList.cards.splice(source.index, 1)

        // 將新的 listId 分配給移動的card
        movedCard.listId = destination.droppableId

        // 將 card 新增至目標列表
        destList.cards.splice(destination.index, 0, movedCard)

        // 更新來源列表 card 順序
        sourceList.cards.forEach((card, idx) => {
          card.order = idx
        })

        // 更新目標列表 card 順序
        destList.cards.forEach((card, idx) => {
          card.order = idx
        })
        
        setOrderedData(newOrderedData)

        const updatedCards = [
          ...sourceList.cards.map(card => ({
            _id: card._id,
            order: card.order,
            listId: sourceList._id // 使用來源列表ID
          })),
          ...destList.cards.map(card => ({
            _id: card._id,
            order: card.order,
            listId: destList._id, // 使用目標列表ID
          })),
        ];
      
        executeUpdateCardOrder({ items: updatedCards, boardId })
      }
    }
  }
  
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol 
            {...provided.droppableProps}
            ref={provided.innerRef}  
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, index) => {
              return (
                <ListItem
                  key={list._id}
                  index={index}
                  listData={list}
                />
              )
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  )
}