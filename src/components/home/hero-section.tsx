import SidebarCategories from "./sidebar-categories"
import HeroBanner from "./hero-banner"

export default function HeroSection() {
  return (
    <div className="bg-background px-4 py-4 md:px-6">
      <div className="flex flex-col lg:flex-row lg:gap-6">
        <div className="hidden lg:block lg:w-64">
          <SidebarCategories />
        </div>
        <div className="flex-1">
          <HeroBanner />
        </div>
      </div>
    </div>
  )
}

