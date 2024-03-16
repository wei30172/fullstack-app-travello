"use server"

import { z } from "zod"
import bcrypt from "bcrypt"

import connectDB from "@/lib/mongodb"
import { ActionState, createValidatedAction } from "@/lib/create-validated-action"
import User from "@/lib/models/user.model"
import { SignUpValidation } from "@/lib/validations/auth"

type SignUpWithCredentialsInput = z.infer<typeof SignUpValidation>
type SignUpWithCredentialsReturn = ActionState<SignUpWithCredentialsInput, {email: string}>

const signUpWithCredentialsHandler = async (data: SignUpWithCredentialsInput): Promise<SignUpWithCredentialsReturn> => {
  const { name, email, password } = data
  
  let user

  try {
    await connectDB()

    const existingUser = await User.findOne({ email })
    if (existingUser) return { error: "User already exists" }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    user = new User({ name, email, password: hashedPassword })
    // console.log({user})
    await user.save()
  } catch (error) {
    return { error: "Sign up failed" }
  }

  return {data: {email: user.email}}
}

export const signUpWithCredentials = createValidatedAction(SignUpValidation, signUpWithCredentialsHandler)