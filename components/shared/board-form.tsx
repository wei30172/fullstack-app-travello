"use client"

import { useForm } from "react-hook-form"
import { useFormStatus } from 'react-dom'
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import DatePicker from "react-datepicker"

import { useAction } from "@/hooks/use-validated-action"
import { IBoard } from "@/lib/database/models/types"
import { CreateBoardValidation } from "@/lib/validations/board"
import { createBoard } from "@/lib/actions/board/create-board"
import { updateBoard } from "@/lib/actions/board/update-board"

import "react-datepicker/dist/react-datepicker.css"
import { Goal, FileImage, MapPin, CalendarDays } from "lucide-react"
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

  async function onSubmit(values: z.infer<typeof CreateBoardValidation>) {
    // console.log({values})
    if (type === 'Create') {
      executeCreateBoard({
        title: values.title,
        location: values.location,
        startDate: values.startDate,
        endDate: values.endDate,
        imageUrl: values.imageUrl
      })
    }

    if (type === 'Update') {
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
                  dateFormat="MM/dd/yyyy"
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
                  dateFormat="MM/dd/yyyy"
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
      </form>
    </Form>
  )
}