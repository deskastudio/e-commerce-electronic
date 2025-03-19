import TopBar from "@/components/home/top-bar"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import AboutHero from "@/components/about/hero"
import Stats from "@/components/about/stats"
import Team from "@/components/about/teams"
import Features from "@/components/about/features"
import Link from "next/link"

export default function AboutPage() {
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
            <span className="text-foreground">About</span>
          </nav>
          <AboutHero />
          <Stats />
          <Team />
          <Features />
        </div>
      </main>
      <Footer />
    </div>
  )
}

