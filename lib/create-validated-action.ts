import { z } from "zod"

// 錯誤類型，用於表單欄位的錯誤訊息
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

// Action 執行的狀態，包含可能的欄位錯誤、錯誤訊息和返回的數據
export type ActionState<TInput, TOutput> = {
  fieldErrors?: FieldErrors<TInput>
  error?: string | null
  data?: TOutput
}

// 創建經過驗證的 Action
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