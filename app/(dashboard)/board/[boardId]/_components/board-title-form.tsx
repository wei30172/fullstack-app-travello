"use client"

import { useState, useRef, ElementRef  } from "react"
import { IBoard } from "@/lib/models/types"
import { useAction } from "@/hooks/use-validated-action"
import { updateBoard } from "@/lib/actions/board/update-board"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { FormInput } from "@/components/form/form-input"

interface BoardTitleFormProps {
  boardData: IBoard
}

export const BoardTitleForm = ({ boardData }: BoardTitleFormProps) => {
  const { toast } = useToast()

  const { execute } = useAction(updateBoard, {
    onSuccess: (data) => {
      toast({
        status: "success",
        title: `Trip "${data.title}" updated`
      })
      setTitle(data.title)
      disableEditing()
    },
    onError: (error) => {
      toast({
        status: "error",
        title: error
      })
    }
  })

  const formRef = useRef<ElementRef<"form">>(null)
  const inputRef = useRef<ElementRef<"input">>(null)

  const [title, setTitle] = useState(boardData.title)
  const [isEditing, setIsEditing] = useState(false)

  const enableEditing = () => {
    setIsEditing(true)
    setTimeout(() => {
     inputRef.current?.focus()
     inputRef.current?.select() 
    })
  }

  const disableEditing = () => {
    setIsEditing(false)
  }

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string
    
    if (title === boardData.title) {
      return disableEditing()
    }

    execute({
      title,
      id: boardData._id
    })
  }

  const onBlur = () => {
    formRef.current?.requestSubmit()
  }

  if (isEditing) {
    return (
      <form action={onSubmit} ref={formRef} className="flex items-center gap-x-2">
        <FormInput
          ref={inputRef}
          id="title"
          onBlur={onBlur}
          defaultValue={title}
          className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
        />
      </form>
    )
  }
  
  return (
    <Button
      onClick={enableEditing}
      variant="transparent"
      className="font-bold text-lg h-auto w-auto p-1 px-2"
    >
      {title}
    </Button>
  )
}
