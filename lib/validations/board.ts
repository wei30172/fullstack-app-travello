import * as z from "zod"

export const CreateBoardValidation = z.object({
  title: z.string()
    .min(1, "Title is required")
    .min(3, "Title must be 3+ characters")
    .max(100, "Title must be less than 100 characters"),
  image: z.optional(z.string())
})

export const DeleteBoardValidation = z.object({
  id: z.string()
})

export const UpdateBoardValidation = z.object({
  title: z.string()
    .min(1, "Title is required")
    .min(3, "Title must be 3+ characters")
    .max(100, "Title must be less than 100 characters"),
  id: z.string()
})