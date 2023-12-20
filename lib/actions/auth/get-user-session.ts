"use server"

import { getServerSession } from "next-auth/next"

import { nextauthOptions } from "@/lib/nextauth-options"

export const getUserSession = async () => {
  const session = await getServerSession(nextauthOptions)
  return ({ session })
}