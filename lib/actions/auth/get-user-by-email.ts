"use server"

import connectDB from "@/lib/mongodb"
import User from "@/lib/models/user.model"
import { IUser } from "@/lib/models/types"

type GetUserByEmailInput = {email: string}
type GetUserByEmailReturn = IUser

export const getUserByEmail = async (data: GetUserByEmailInput): Promise<GetUserByEmailReturn> => {
  const { email } =  data
  
  await connectDB()

  const user = await User.findOne({email}).select("-password")

  // console.log({user})
  return { ...user._doc, _id: user._id.toString() }
}