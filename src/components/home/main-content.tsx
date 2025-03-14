import FlashSales from "./flash-sales"
import CategoryBrowser from "./category-browser"
import BestSelling from "./best-selling"
import MusicPromo from "./music-promo"
import ExploreProducts from "./explore-product"
import NewArrivals from "./new-arrival"
import Features from "./features"

export default function MainContent() {
  return (
    <main className="flex-1 px-4 md:px-6">
      <FlashSales />
      <CategoryBrowser />
      <BestSelling />
      <MusicPromo />
      <ExploreProducts />
      <NewArrivals />
      <Features />
    </main>
  )
}

