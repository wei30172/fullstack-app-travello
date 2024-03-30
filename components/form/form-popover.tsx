"use client"

import { ElementRef, useRef } from "react"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAction } from "@/hooks/use-validated-action"
import { createBoard } from "@/lib/actions/board/create-board"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import { FormInput } from "./form-input"
import { FormSubmit } from "./form-submit"

interface FormPopoverProps {
  children: React.ReactNode
  side?: "left" | "right" | "top" | "bottom"
  align?: "start" | "center" | "end"
  sideOffset?: number
}

export const FormPopover = ({
  children,
  side = "bottom",
  align,
  sideOffset = 0,
}: FormPopoverProps) => {
  const router = useRouter()
  const { toast } = useToast()
  const closeRef = useRef<ElementRef<"button">>(null)

  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      toast({
        status: "success",
        title: "Board created!",
      })
      closeRef.current?.click()
      router.push(`/board/${data._id}`)
    },
    onError: (error) => {toast({ status: "error", description: error })}
  })

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string
    execute({ title })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className="w-80 pt-3"
        side={side}
        sideOffset={sideOffset}
      >
        <div className="text-sm font-medium text-center text-teal-900 pb-4">
          Create board
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-teal-900"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <form action={onSubmit} className="space-y-4">
          <div className="space-y-4">
            <FormInput
              id="title"
              label="Board title"
              type="text"
              errors={fieldErrors}
            />
          </div>
          <FormSubmit className="w-full">
            Create
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  )
}
