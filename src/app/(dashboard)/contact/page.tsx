import TopBar from "@/components/home/top-bar"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import ContactInfo from "@/components/contact/contact-info"
import ContactForm from "@/components/contact/contact-form"
import Link from "next/link"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <nav className="mb-8 flex space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Contact</span>
          </nav>
          <div className="grid gap-8 lg:grid-cols-2">
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

