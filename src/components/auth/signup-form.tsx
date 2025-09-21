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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff, CheckCircle } from "lucide-react"

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
  const [showPassword, setShowPassword] = useState(false)
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
        router.push('/auth/login?message=registration-success');
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
        <h1 className="text-2xl font-bold">Buat Akun Baru</h1>
        <p className="text-sm text-muted-foreground">
          Daftarkan diri Anda untuk mulai berbelanja
        </p>
      </div>
      
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      {isSuccess ? (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            <p className="font-medium">Registrasi Berhasil!</p>
            <p className="text-sm">Akun Anda telah dibuat. Anda akan dialihkan ke halaman login dalam beberapa detik.</p>
          </AlertDescription>
        </Alert>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="Nama lengkap" 
                      {...field} 
                      disabled={isLoading}
                      className="h-11"
                    />
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
                    <Input 
                      placeholder="Email atau Nomor Telepon" 
                      {...field} 
                      disabled={isLoading}
                      className="h-11"
                    />
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
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Password" 
                        {...field} 
                        disabled={isLoading}
                        className="h-11 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-11 w-10"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Sembunyikan" : "Tampilkan"} password
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full h-11 bg-primary text-white" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Membuat Akun...
                </>
              ) : (
                "Buat Akun"
              )}
            </Button>
          </form>
        </Form>
      )}
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Atau</span>
        </div>
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        Sudah memiliki akun?{" "}
        <Link 
          href="/auth/login" 
          className="text-primary hover:underline font-medium"
        >
          Masuk di sini
        </Link>
      </div>
    </div>
  )
}