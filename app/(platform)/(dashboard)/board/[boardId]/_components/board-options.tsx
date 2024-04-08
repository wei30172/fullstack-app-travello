"use client"

import { useState } from "react"
import { IBoard } from "@/lib/database/models/types"
import { useAction } from "@/hooks/use-validated-action"
import { deleteBoard } from "@/lib/actions/board/delete-board"

import { MoreHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import { BoardForm } from "@/components/shared/board-form"
import { DeleteAlertDialog } from "@/components/shared/delete-alert-dialog"

interface BoardOptionsProps {
  boardData: IBoard
}

export const BoardOptions = ({ boardData }: BoardOptionsProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const { toast } = useToast()
  
  const { execute, isLoading: isLoadingDelete } = useAction(deleteBoard, {
    onError: (error) => {toast({ status: "error", description: error })}
  })

  const handleDeleteBoard = () => {
    execute({ boardId: boardData._id })
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          className="h-auto w-auto p-2"
          variant="transparent"
          aria-label="More options"
          onClick={() => setIsPopoverOpen(true)}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 pt-3" 
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
            aria-label="Close popover"
            onClick={() => setIsPopoverOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <BoardForm
          type="Update"
          onClose={() => setIsPopoverOpen(false)}
          boardData={boardData}
        />
        <DeleteAlertDialog
          title="Delete this trip"
          onConfirm={handleDeleteBoard}
          isLoading={isLoadingDelete}
        />
      </PopoverContent>
    </Popover>
  )
}