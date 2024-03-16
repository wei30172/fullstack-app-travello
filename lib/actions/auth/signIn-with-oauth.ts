"use server"

import { Account, Profile } from "next-auth"

import connectDB from "@/lib/mongodb"
import User from "@/lib/models/user.model"

type SignInWithOauthInput = {account: Account, profile: Profile & { picture?: string }}
type SignInWithOauthReturn = boolean

export const signInWithOauth = async (data: SignInWithOauthInput): Promise<SignInWithOauthReturn> => {
  const { account, profile } = data
  // console.log({account, profile})

  let user
  await connectDB()

  user = await User.findOne({email: profile.email})

  if (user) return true

  const newUser = new User({
    name: profile.name,
    email: profile.email,
    image: profile.picture,
    provider: account.provider
  })

  // console.log(newUser)
  await newUser.save()
  return true
}