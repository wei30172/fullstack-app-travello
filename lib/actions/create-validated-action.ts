import { z } from "zod"

// Error type, used for error messages in form fields
export type FieldErrors<T> = {
  [K in keyof T]?: string[]
}

// ex: FieldErrors<User>
// type User = {
//   name: string
//   email: string
// }
// =>
// {
//   name?: string[]
//   email?: string[]
// }

export type ActionState<TInput, TOutput> = {
  fieldErrors?: FieldErrors<TInput>
  error?: string | null
  data?: TOutput
}

export const createValidatedAction = <TInput, TOutput>(
  validation: z.Schema<TInput>,
  handler: (validatedData: TInput) => Promise<ActionState<TInput, TOutput>>
) => {
  return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {
    const validationResult = validation.safeParse(data)
    if (!validationResult.success) {
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors as FieldErrors<TInput>,
      }
    }

    return handler(validationResult.data)
  }
}