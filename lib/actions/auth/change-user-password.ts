"use server"

import { z } from "zod"
import bcrypt from "bcrypt"

import connectDB from "@/lib/mongodb"
import { ActionState, createValidatedAction } from "@/lib/create-validated-action"
import User from "@/lib/models/user.model"
import { ChangePasswordValidation } from "@/lib/validations/auth"
import { getUserSession } from "@/lib/actions/auth/get-user-session"

type ChangeUserPasswordInput = z.infer<typeof ChangePasswordValidation>
type ChangeUserPasswordReturn = ActionState<ChangeUserPasswordInput, {name: string}>

const changeUserPasswordHandler = async (data: ChangeUserPasswordInput): Promise<ChangeUserPasswordReturn> => {
  const { session } = await getUserSession()
  if (!session) { return { error: "Unauthorized" } }
  
  if (session.user.provider !== "credentials") {
    return { error: `Signed in via ${session?.user?.provider}. Changes not allowed with this method.` }
  }

  const { oldPassword, newPassword } = data
  
  let user

  try {
    await connectDB()
    
    user = await User.findById(session?.user?._id)
    if (!user) return { error: "User not found" }

    const passwordIsValid = await bcrypt.compare(oldPassword, user.password)
    if (!passwordIsValid) return { error: "Invalid old password" }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    await User.findByIdAndUpdate(user._id, { password: hashedPassword })
  
  } catch (error) {
    return { error: "Password change failed" }
  }

  return {data: {name: user.name}}
}

export const changeUserPassword = createValidatedAction(ChangePasswordValidation, changeUserPasswordHandler)