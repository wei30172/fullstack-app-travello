"use server"

import { Session } from "next-auth"
import { getServerSession } from "next-auth/next"
import { nextauthOptions } from "@/lib/nextauth-options"

export const getUserSession = async (): Promise<{ session: Session | null }> => {
  const session = await getServerSession(nextauthOptions)
  return ({ session })
}