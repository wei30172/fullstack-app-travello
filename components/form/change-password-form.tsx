"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useFormStatus } from 'react-dom'
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { useAction } from "@/hooks/use-validated-action"
import { ChangePasswordValidation } from "@/lib/validations/auth"
import { changeUserPassword } from "@/lib/actions/auth/change-user-password"

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

export const ChangePasswordForm = () => {
  const router = useRouter()
  const { pending } = useFormStatus()
  const { toast } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const { execute } = useAction(changeUserPassword, {
    onSuccess: () => {
      toast({
        status: "success",
        title: `Password Changed Successfully`,
        description: "Please sign in again with the new password."
      })
      setIsLoggingOut(true)
      setTimeout(() => {
        signOut({
          redirect: true,
          callbackUrl: `${window.location.origin}/signin`
        })
      }, 5000)
    },
    onError: (error) => {toast({ status: "error", description: error })}
  })

  const form = useForm<z.infer<typeof ChangePasswordValidation>>({
    resolver: zodResolver(ChangePasswordValidation),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  })

  async function onSubmit(values: z.infer<typeof ChangePasswordValidation>) {
    // console.log(values)
    execute(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="your old password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="your new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm your new password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          className="w-full mt-6"
          type="submit"
          disabled={pending || isLoggingOut}
        >
          {pending ? "Submitting..." : "Change"}
        </Button>
        <Button
          onClick={() => router.back()}
          className="w-full mt-2"
          disabled={pending || isLoggingOut}
          variant="outline"
        >
          Cancel
        </Button>
      </form>
    </Form>
  )
}