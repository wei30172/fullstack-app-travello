"use client"

import { useAction } from "@/hooks/use-validated-action"
import { deleteBoard } from "@/lib/actions/board/delete-board"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import { MoreHorizontal, X } from "lucide-react"

interface BoardOptionsProps {
  id: string
}

export const BoardOptions = ({ id }: BoardOptionsProps) => {
  const { toast } = useToast()
  
  const { execute, isLoading } = useAction(deleteBoard, {
    onError: (error) => {
      toast({
        status: "error",
        title: error
      })
    }
  })

  const onDelete = () => {
    execute({ id })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="transparent">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="px-0 pt-3 pb-3" 
        side="bottom" 
        align="start"
      >
        <div className="text-sm font-medium text-center text-teal-900 pb-4">
          Manage Trip
        </div>
        <PopoverClose asChild>
          <Button 
            className="h-auto w-auto p-2 absolute top-2 right-2 text-teal-900"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          variant="ghost"
          onClick={onDelete}
          disabled={isLoading}
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
        >
          Delete this trip
        </Button>
      </PopoverContent>
    </Popover>
  )
}