"use client"

import { useForm } from "react-hook-form"
import { useFormStatus } from 'react-dom'
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useSession } from "next-auth/react"
import { useAction } from "@/hooks/use-validated-action"
import { UpdateUserValidation } from "@/lib/validations/auth"
import { updateUserProfile } from "@/lib/actions/auth/update-user-profile"
import Link from "next/link"

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

export const UpdateForm = () => {
  const { data: session, update } = useSession()
  const { pending } = useFormStatus()
  const { toast } = useToast()

  const { execute: executeUpdateUser } = useAction(updateUserProfile, {
    onSuccess: (data) => {
      toast({
        status: "success",
        title: `Username "${data.name}" updated`
      })
    },
    onError: (error) => {toast({ status: "error", description: error })}
  })

  const form = useForm<z.infer<typeof UpdateUserValidation>>({
    resolver: zodResolver(UpdateUserValidation),
    defaultValues: {
      name: "",
    }
  })

  async function onSubmit(values: z.infer<typeof UpdateUserValidation>) {
    update({name: values.name})
    executeUpdateUser({name: values.name})
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="your username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          className="w-full mt-6"
          type="submit"
          disabled={pending}
        >
          {pending ? "Submitting..." : "Update"}
        </Button>
      </form>
      <div className="flex items-center justify-center mt-4 mb-8">
        <div className="border-b border-gray-400 w-full"></div>
      </div>
      {session?.user.provider === "credentials" && <>
        <p className="text-center text-sm text-gray-600 mt-2">
          <Link className="text-blue-600 hover:underline" href="/change-password">
            Change Password
          </Link>
        </p>
      </>}
    </Form>
  )
}