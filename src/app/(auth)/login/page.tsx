import Image from "next/image"
import TopBar from "@/components/home/top-bar"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import LoginForm from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
            <div className="relative hidden flex-1 lg:block">
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="Shopping cart with phone"
                width={600}
                height={600}
                className="rounded-lg bg-[#F5F6F6]"
                priority
              />
            </div>
            <div className="w-full lg:w-[400px]">
              <LoginForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
