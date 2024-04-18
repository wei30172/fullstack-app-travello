"use client"

import { useState, useRef, ElementRef } from "react"
import { useParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { useEventListener, useOnClickOutside } from "usehooks-ts"
import { useAction } from "@/hooks/use-validated-action"
import { CardWithList } from '@/lib/database/models/types'
import { updateCard } from "@/lib/actions/card/update-card"

import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { FormTextarea } from "@/components/form/form-textarea"
import { FormSubmit } from "@/components/form/form-submit"
import { Button } from "@/components/ui/button"
import { Map } from "lucide-react"

interface DescriptionProps {
  data: CardWithList
}

export const Description = ({
  data
}: DescriptionProps) => {
  const { toast } = useToast()
  const params = useParams()
  const queryClient = useQueryClient()

  const [isEditing, setIsEditing] = useState(false)

  const formRef = useRef<ElementRef<"form">>(null)
  const textareaRef = useRef<ElementRef<"textarea">>(null)

  const enableEditing = () => {
    setIsEditing(true)
    setTimeout(() => {
      textareaRef.current?.focus()
    })
  }

  const disableEditing = () => {
    setIsEditing(false)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing()
    }
  }

  useEventListener("keydown", onKeyDown)
  useOnClickOutside(formRef, disableEditing)

  const { execute: executeUpdateCard, fieldErrors } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card", data._id],
      }),
      toast({
        status: "success",
        title: `Attraction "${data.title}" updated`
      }),
      disableEditing()
    },
    onError: (error) => {toast({ status: "error", description: error })}
  })

  const onSubmit = (formData: FormData) => {
    const description = formData.get("description") as string
    const boardId = params.boardId as string

    executeUpdateCard({ id: data._id, description, boardId })
  }

  return (
    <div className="flex items-start gap-x-4 w-full">
      <Map className="h-5 w-5 mt-0.5 text-gray-700" />
      <div className="w-full">
        <p className="font-semibold text-gray-700 mb-2">
          Description
        </p>
        {isEditing ? (
          <form
            action={onSubmit}
            ref={formRef}
            className="space-y-2"
          >
            <FormTextarea
              id="description"
              className="w-full mt-2"
              placeholder="Add a more detailed description"
              defaultValue={data.description || undefined}
              errors={fieldErrors}
              ref={textareaRef}
            />
            <div className="flex items-center gap-x-2">
              <FormSubmit>
                Save
              </FormSubmit>
              <Button
                type="button"
                onClick={disableEditing}
                size="sm"
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            onClick={enableEditing}
            role="button"
            className="min-h-[78px] text-sm font-medium py-3 px-3.5 rounded-md"
          >
            {data.description || "Add a more detailed description..."}
          </div>
        )}
      </div>
    </div>
  )
}

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="flex items-start gap-x-4 w-full">
      <Skeleton className="h-6 w-6 bg-gray-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-gray-200" />
        <Skeleton className="w-full h-[78px] bg-gray-200" />
      </div>
    </div>
  )
}