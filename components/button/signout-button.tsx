"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export const SignOutButton = () => {
  const signout = () => {
    signOut({
      redirect: true,
      callbackUrl: `${window.location.origin}`
    })
  }

  return (
    <Button onClick={signout} variant="destructive">
      Sign Out
    </Button>
  )
}