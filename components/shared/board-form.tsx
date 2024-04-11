"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { useFormStatus } from "react-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import DatePicker from "react-datepicker"
import Markdown from "react-markdown"

import { useAction } from "@/hooks/use-validated-action"
import { IBoard } from "@/lib/database/models/types"
import { CreateBoardValidation } from "@/lib/validations/board"
import { createBoard } from "@/lib/actions/board/create-board"
import { updateBoard } from "@/lib/actions/board/update-board"

import "react-datepicker/dist/react-datepicker.css"
import { Goal, MapPin, CalendarDays, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

interface BoardFormProps {
  type: "Create" | "Update",
  onClose: () => void
  boardData?: IBoard
}

export const BoardForm = ({
  type,
  onClose,
  boardData
}: BoardFormProps) => {
  const router = useRouter()
  const { pending } = useFormStatus()
  const { toast } = useToast()

  const [ openAIResponse, setOpenAIResponse ] = useState<string>("")
  const [isStreaming, setIsStreaming] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const { execute: executeCreateBoard } = useAction(createBoard, {
    onSuccess: (data) => {
      toast({
        status: "success",
        title: "Trip created!",
      })
      form.reset()
      onClose()
      router.push(`/board/${data._id}`)
    },
    onError: (error) => {toast({ status: "error", description: error })}
  })

  const { execute: executeUpdateBoard } = useAction(updateBoard, {
    onSuccess: (data) => {
      toast({
        status: "success",
        title: `Trip "${data.title}" updated`
      })
      form.reset()
      onClose()
    },
    onError: (error) => {toast({ status: "error", description: error })}
  })

  const eventDefaultValues = {
    title: "",
    location: "",
    imageUrl: "",
    startDate: new Date(),
    endDate: new Date()
  }

  const initialValues = boardData && type === "Update" 
    ? { 
      ...boardData, 
      startDate: new Date(boardData.startDate), 
      endDate: new Date(boardData.endDate)
    }
    : eventDefaultValues

  const form = useForm<z.infer<typeof CreateBoardValidation>>({
    resolver: zodResolver(CreateBoardValidation),
    defaultValues: initialValues
  })

  async function askAI () {
    setIsStreaming(true)
    setOpenAIResponse("")

    const values = form.watch()
    if (!values.location || !values.startDate || !values.endDate) {
      toast({
        status: "warning",
        description: "Please provide location, start date, and end date."
      })
      return
    }

    try {
      abortControllerRef.current = new AbortController()
      
      const res: any = await fetch("/api/boards/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          location: values.location,
          startDate: values.startDate,
          endDate: values.endDate
        }),
        signal: abortControllerRef.current.signal
      })
      
      if (!res.ok || !res.body) {
        toast({
          status: "error",
          title: "Error sending message!",
          description: "The OpenAI API key is currently not available for use."
        })
        return
      }
  
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
  
      while (true) {
        const { value, done } = await reader?.read()
  
        const currentChunk = decoder.decode(value)
        setOpenAIResponse((prev) => prev + currentChunk)
  
        if(done) {
          break
        }
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        toast({
          status: "error",
          description: "Error sending message!"
        })
      }
    }

    // console.log({openAIResponse})
    abortControllerRef.current = null
    setIsStreaming(false)
  }

  const handleStop = () => {
    if (!abortControllerRef.current) {
      return
    }
    abortControllerRef.current.abort()
    abortControllerRef.current = null
  }

  async function onSubmit(values: z.infer<typeof CreateBoardValidation>) {
    // console.log({values})
    if (type === "Create") {
      executeCreateBoard({
        title: values.title,
        location: values.location,
        startDate: values.startDate,
        endDate: values.endDate,
        imageUrl: values.imageUrl
      })
    }

    if (type === "Update") {
      if (!boardData?._id) {
        router.back()
        return
      }
      onClose()
      executeUpdateBoard({
        title: values.title,
        location: values.location,
        startDate: values.startDate,
        endDate: values.endDate,
        imageUrl: values.imageUrl,
        id: boardData._id
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-2">
        {type === "Create" &&
          <div className="text-sm font-medium text-center text-teal-900 pb-2">
            Create Trip
          </div>
        }
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex items-center justify-center gap-1">
              <FormLabel>
                <Goal  className="h-4 w-4 m-1" />
              </FormLabel>
              <FormControl>
                <Input placeholder="Trip title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FileImage className="h-4 w-4 m-1" />
              </FormLabel>
              <FormControl className="h-36">
                <Input placeholder="todo: Image" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="flex items-center justify-center gap-1">
              <FormLabel>
                <MapPin className="h-4 w-4 m-1" />
              </FormLabel>
              <FormControl>
                <Input placeholder="Trip location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 w-full">
              <FormLabel className="flex items-center gap-1 text-sm w-3/5">
                <CalendarDays className="h-4 w-4 m-1" />
                <p className="text-muted-foreground whitespace-nowrap">Start Date</p>
              </FormLabel>
              <FormControl className="cursor-pointer text-sm flex">
                <DatePicker
                  selected={field.value} 
                  onChange={(date: Date) => field.onChange(date)} 
                  showTimeSelect
                  timeInputLabel="Time:"
                  dateFormat="MM/dd/yyyy h:mm aa"
                  wrapperClassName="datePicker"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 w-full">
              <FormLabel className="flex items-center gap-1 text-sm w-3/5">
                <CalendarDays className="h-4 w-4 m-1" />
                <p className="text-muted-foreground whitespace-nowrap">End Date</p>
              </FormLabel>
              <FormControl className="cursor-pointer text-sm">
                <DatePicker
                  selected={field.value} 
                  onChange={(date: Date) => field.onChange(date)} 
                  showTimeSelect
                  timeInputLabel="Time:"
                  dateFormat="MM/dd/yyyy h:mm aa"
                  wrapperClassName="datePicker"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full mt-4"
          type="submit"
          disabled={pending}
        >
          {pending ? "Submitting..." : type}
        </Button>
        {
          type === "Update" && isStreaming
          ?
            <Button
              className="w-full my-2"
              type="button"
              onClick={handleStop}
              variant="outline"
            >
              <Pause />
            </Button>
          : 
            <Button
              className="w-full my-2"
              type="button"
              onClick={askAI}
              disabled={pending}
              variant="outline"
            >
              {pending ? "Updatting..." : "Ask AI"}
            </Button>
        }
        {
          type === "Update" && openAIResponse !== "" ?
          <div className="border-t border-gray-300 pt-4" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            <h2 className="text-xl font-bold mb-2">Trip suggestions</h2>
            <Markdown>{openAIResponse}</Markdown>
          </div>
          :
          null
        }
      </form>
    </Form>
  )
}