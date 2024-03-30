"use server"

import { z } from "zod"

import connectDB from "@/lib/database/mongodb"
import { ActionState, createValidatedAction } from "@/lib/actions/create-validated-action"
import User from "@/lib/database/models/user.model"
import { UpdateUserValidation } from "@/lib/validations/auth"
import { getUserSession } from "@/lib/actions/auth/get-user-session"

type UpdateUserProfileInput = z.infer<typeof UpdateUserValidation>
type UpdateUserProfileReturn = ActionState<UpdateUserProfileInput, {name: string}>

const updateUserProfileHandler = async (data: UpdateUserProfileInput): Promise<UpdateUserProfileReturn> => {
  const { session } = await getUserSession()
  if (!session) { return { error: "Unauthorized" } }

  const { name } = data

  let user

  try {
    await connectDB()
    
    user = await User.findByIdAndUpdate(
      session?.user?._id,
      { name },
      { new: true }
    ).select("-password")

    if (!user) {return { error: "User not found" }}
  } catch (error) {
    return { error: "Failed to update" }
  }

  return {data: {name: user.name}}
}

export const updateUserProfile = createValidatedAction(UpdateUserValidation, updateUserProfileHandler)