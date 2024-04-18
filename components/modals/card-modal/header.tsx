"use client"

import { ElementRef, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { CardWithList } from '@/lib/database/models/types'
import { updateCard } from "@/lib/actions/card/update-card"
import { useAction } from "@/hooks/use-validated-action"

import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { FormInput } from "@/components/form/form-input"
import { MapPin } from "lucide-react"

interface HeaderProps {
  data: CardWithList
}

export const Header = ({
  data,
}: HeaderProps) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const params = useParams()

  const { execute: executeUpdateCard } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card", data._id]
      })
      toast({
        status: "success",
        title: `Renamed to "${data.title}"`
      })
      setTitle(data.title)
    },
    onError: (error) => {toast({ status: "error", description: error })}
  })

  const inputRef = useRef<ElementRef<"input">>(null)

  const [title, setTitle] = useState(data?.title)

  const onBlur = () => {
    inputRef.current?.form?.requestSubmit()
  }

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string
    const boardId = params.boardId as string
    
    if (title === data.title) {
      return
    }

    executeUpdateCard({ title, boardId, id: data._id })
  }

  return (
    <div className="flex items-start gap-x-4 mb-6 w-full">
      <MapPin className="h-5 w-5 mt-2 text-gray-700" />
      <div className="w-full">
        <form action={onSubmit}>
          <FormInput
            ref={inputRef}
            onBlur={onBlur}
            id="title"
            defaultValue={title}
            className="font-semibold text-xl px-1 text-gray-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
          />
        </form>
        <p className="text-sm text-muted-foreground">
          in itinerary <span className="underline">{data.list.title}</span>
        </p>
      </div>
    </div>
  )
}

Header.Skeleton = function HeaderSkeleton() {
  return (
    <div className="flex items-start gap-x-4 mb-6">
      <Skeleton className="h-6 w-6 mt-2 bg-gray-200" />
      <div>
        <Skeleton className="w-24 h-6 mb-1 bg-gray-200" />
        <Skeleton className="w-12 h-4 bg-gray-200" />
      </div>
    </div>
  )
}