"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/mongodb"
import { ActionState, createValidatedAction } from "@/lib/create-validated-action"
import User from "@/lib/models/user.model"
import { UpdateUserValidation } from "@/lib/validations/auth"
import { getUserSession } from "@/lib/actions/auth/get-user-session"

type UpdateUserProfileInput = z.infer<typeof UpdateUserValidation>
type UpdateUserProfileReturn = ActionState<UpdateUserProfileInput, {name: string}>

const updateUserProfileHandler = async (data: UpdateUserProfileInput): Promise<UpdateUserProfileReturn> => {
  const { session } = await getUserSession()
  if (!session) {
    return { error: "Unauthorized" }
  }

  const { name } = data

  let user
  connectDB()

  try {
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