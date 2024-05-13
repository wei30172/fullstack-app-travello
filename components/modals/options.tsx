"use client"

import { useParams } from "next/navigation"
import { CardWithList } from "@/lib/database/models/types"
import { copyCard } from "@/lib/actions/card/copy-card"
import { deleteCard } from "@/lib/actions/card/delete-card"
import { useAction } from "@/hooks/use-validated-action"
import { useCardModal } from "@/hooks/use-card-modal"

import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Copy, Trash2 } from "lucide-react"

interface ActionsProps {
  data: CardWithList
}

export const Options = ({
  data,
}: ActionsProps) => {
  const params = useParams()
  const cardModal = useCardModal()
  const { toast } = useToast()

  const { execute: executeCopyCard, isLoading: isLoadingCopy } = useAction(copyCard, {
    onSuccess: () => {
      toast({
        status: "success",
        title: `Attraction "${data.title}" copied`
      }),
      cardModal.onClose()
    },
    onError: (error) => {toast({ status: "error", description: error })}
  })

  const { execute: executeDeleteCard, isLoading: isLoadingDelete } = useAction(deleteCard, {
    onSuccess: (data) => {
      toast({
        status: "success",
        title: `Attraction "${data.title}" deleted`
      }),
      cardModal.onClose()
    },
    onError: (error) => {toast({ status: "error", description: error })}
  })

  const onCopy = () => {
    const boardId = params.boardId as string

    executeCopyCard({ id: data._id, boardId })
  }

  const onDelete = () => {
    const boardId = params.boardId as string

    executeDeleteCard({ id: data._id, boardId})
  }
  
  return (
    <div className="space-y-3 mt-2">
      <div className="mb-3" />
      <Button
        onClick={onCopy}
        disabled={isLoadingCopy}
        className="w-full justify-start"
        size="inline"
        variant="secondary"
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy
      </Button>
      <Button
        onClick={onDelete}
        disabled={isLoadingDelete}
        className="w-full justify-start"
        size="inline"
        variant="destructive"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  )
}

Options.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-3 mt-8">
      <Skeleton className="w-full h-8 bg-gray-200" />
      <Skeleton className="w-full h-8 bg-gray-200" />
    </div>
  )
}