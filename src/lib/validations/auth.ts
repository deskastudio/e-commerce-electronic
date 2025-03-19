import * as z from "zod"

export const loginSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, "Email or phone number is required")
    .refine((value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const phoneRegex = /^\+?[\d\s-]{8,}$/
      return emailRegex.test(value) || phoneRegex.test(value)
    }, "Please enter a valid email or phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  emailOrPhone: z
    .string()
    .min(1, "Email or phone number is required")
    .refine((value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const phoneRegex = /^\+?[\d\s-]{8,}$/
      return emailRegex.test(value) || phoneRegex.test(value)
    }, "Please enter a valid email or phone number"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
})

export type LoginValues = z.infer<typeof loginSchema>
export type SignUpValues = z.infer<typeof signUpSchema>

