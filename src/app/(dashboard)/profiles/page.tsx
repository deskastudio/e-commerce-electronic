import TopBar from "@/components/home/top-bar"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import AccountLayout from "../../../components/account/layout"
import ProfileForm from "@/components/account/profile-form"

export default function AccountPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <AccountLayout>
            <ProfileForm />
          </AccountLayout>
        </div>
      </main>
      <Footer />
    </div>
  )
}

