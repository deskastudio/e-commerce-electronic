import TopBar from "@/components/home/top-bar"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import WishlistItems from "@/components/wishlist/wishlist-items"
import RecommendedItems from "@/components/wishlist/recommended-items"

export default function WishlistPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-xl font-bold">Wishlist (4)</h1>
            <button className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">
              Move All To Bag
            </button>
          </div>
          <WishlistItems />
          <RecommendedItems />
        </div>
      </main>
      <Footer />
    </div>
  )
}

