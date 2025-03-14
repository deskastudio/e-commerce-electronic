import Header from "@/components/common/header"
import HeroBanner from "@/components/home/hero-banner"
import FlashSales from "@/components/home/flash-sales"
import CategoryBrowser from "@/components/home/category-browser"
import BestSelling from "@/components/home/best-selling"
import MusicPromo from "@/components/home/music-promo"
import ExploreProducts from "@/components/home/explore-product"
import NewArrivals from "@/components/home/new-arrival"
import Features from "@/components/home/features"
import Footer from "@/components/common/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroBanner />
        <div className="container mx-auto px-4 py-8 md:px-6">
          <FlashSales />
          <CategoryBrowser />
          <BestSelling />
          <MusicPromo />
          <ExploreProducts />
          <NewArrivals />
          <Features />
        </div>
      </main>
      <Footer />
    </div>
  )
}

