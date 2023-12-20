import * as z from "zod"
 
export const SignInValidation = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z.string()
    .min(1, "Password is required")
    .min(8, "Password must be 8+ characters"),
})

export const SignUpValidation = z
  .object({
    name: z.string()
      .min(1, "Username is required")
      .max(50, "Username must be less than 50 characters"),
    email: z.string()
      .min(1, "Email is required")
      .email("Invalid email"),
    password: z.string()
      .min(1, "Password is required")
      .min(8, "Password must be 8+ characters"),
    confirmPassword: z.string()
      .min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match",
  })

export const UpdateUserValidation = z
  .object({
    name: z.string()
      .min(1, "Username is required")
      .max(50, "Username must be less than 50 characters"),
  })

export const ChangePasswordValidation = z
  .object({
    oldPassword: z.string()
      .min(1, "Old password is required")
      .min(8, "Password must be 8+ characters"),
    newPassword: z.string()
      .min(1, "New password is required")
      .min(8, "Password must be 8+ characters"),
    confirmPassword: z.string()
      .min(1, "Password confirmation is required"),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    path: ["newPassword"],
    message: "New password must differ from old",
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match",
  })