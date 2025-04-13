// components/auth/signup-form.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

const signUpSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  emailOrPhone: z
    .string()
    .min(1, "Email atau nomor telepon harus diisi")
    .refine((value) => {
      // Validasi email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      // Validasi nomor telepon
      const phoneRegex = /^\+?[\d\s-]{8,}$/

      return emailRegex.test(value) || phoneRegex.test(value)
    }, "Masukkan email atau nomor telepon yang valid"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password harus mengandung minimal satu huruf besar, satu huruf kecil, dan satu angka",
    ),
})

type SignUpValues = z.infer<typeof signUpSchema>

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      emailOrPhone: "",
      password: "",
    },
  })

  async function onSubmit(data: SignUpValues) {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      // Determine if input is email or phone
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailOrPhone);
      
      // Prepare user data
      const userData = {
        name: data.name,
        password: data.password,
        role: "user", // Always set role to "user" for registration
        ...(isEmail 
          ? { email: data.emailOrPhone } 
          : { phone: data.emailOrPhone })
      };
      
      console.log("Registering user with data:", userData);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Registrasi gagal');
      }

      // Registration successful
      setIsSuccess(true);
      
      // Redirect to login after short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage(error instanceof Error ? error.message : "Terjadi kesalahan saat mendaftarkan akun");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Buat Akun</h1>
        <p className="text-sm text-muted-foreground">Masukkan data diri Anda di bawah ini</p>
      </div>
      
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {errorMessage}
        </div>
      )}
      
      {isSuccess ? (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
          <p className="font-medium">Registrasi Berhasil!</p>
          <p>Akun Anda telah dibuat. Anda akan dialihkan ke halaman login dalam beberapa detik.</p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Nama" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emailOrPhone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email atau Nomor Telepon" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary text-white" disabled={isLoading}>
              {isLoading ? "Membuat Akun..." : "Buat Akun"}
            </Button>
          </form>
        </Form>
      )}
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Atau lanjutkan dengan</span>
        </div>
      </div>
      
      {/* Google Signup Button (Commented out as requested) */}
      {/*
      <Button variant="outline" type="button" disabled={isLoading} className="w-full">
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Daftar dengan Google
      </Button>
      */}
      
      <div className="text-center text-sm text-muted-foreground">
        Sudah memiliki akun?{" "}
        <Button variant="link" className="text-primary hover:text-primary/80" asChild>
          <Link href="/login">Masuk</Link>
        </Button>
      </div>
    </div>
  )
}