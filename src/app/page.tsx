import TopBar from "@/components/home/top-bar"
import Header from "@/components/common/header"
import HeroSection from "@/components/home/hero-section"
import MainContent from "@/components/home/main-content"
import Footer from "@/components/common/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <Header />
      <div className="mx-auto w-full max-w-7xl">
        <HeroSection />
        <MainContent />
      </div>
      <Footer />
    </div>
  )
}

