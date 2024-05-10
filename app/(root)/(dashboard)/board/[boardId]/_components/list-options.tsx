"use client"

import { ElementRef, useRef } from "react"
import { useAction } from "@/hooks/use-validated-action"
import { ListWithCards } from "@/lib/database/models/types"
import { copyList } from "@/lib/actions/list/copy-list"
import { deleteList } from "@/lib/actions/list/delete-list"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { FormSubmit } from "@/components/form-items/form-submit"
import { MoreHorizontal, X, Plus, Copy, Trash2 } from "lucide-react"

interface ListOptionsProps {
  listData: ListWithCards
  onAddCard: () => void
}

export const ListOptions = ({
  listData,
  onAddCard,
}: ListOptionsProps) => {
  const { toast } = useToast()

  const closeRef = useRef<ElementRef<"button">>(null)

  const { execute: executeDelete } = useAction(deleteList, {
    onSuccess: (data) => {
      toast({
        status: "success",
        title: `Itinerary "${data.title}" deleted`,
      })
      closeRef.current?.click()
    },
    onError: (error) => {toast({ status: "error", description: error })}
  })

  const { execute: executeCopy } = useAction(copyList, {
    onSuccess: (data) => {
      toast({
        status: "success",
        title: `Itinerary "${data.title}" added`,
      })
      closeRef.current?.click()
    },
    onError: (error) => {toast({ status: "error", description: error })}
  })

  const onDelete = (formData: FormData) => {
    const id = formData.get("id") as string
    const boardId = formData.get("boardId") as string

    executeDelete({ id, boardId })
  }

  const onCopy = (formData: FormData) => {
    const id = formData.get("id") as string
    const boardId = formData.get("boardId") as string

    executeCopy({ id, boardId })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-teal-900 pb-4">
          Itinerary actions
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button className="h-auto w-auto p-2 absolute top-2 right-2 text-teal-900" variant="ghost">
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          onClick={onAddCard}
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          variant="ghost"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add attractions...
        </Button>
        <form action={onCopy}>
          <input hidden name="id" id="id" defaultValue={listData._id} />
          <input hidden name="boardId" id="boardId" defaultValue={listData.boardId.toString()} />
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Itinerary...
          </FormSubmit>
        </form>
        <Separator />
        <form
          action={onDelete}
        >
          <input hidden name="id" id="id" defaultValue={listData._id} />
          <input hidden name="boardId" id="boardId" defaultValue={listData.boardId.toString()} />
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete this Itinerary
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  )
}