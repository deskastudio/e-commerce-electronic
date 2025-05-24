// app/admin/layout.tsx - Admin Layout for Next.js App Router
import { Metadata } from "next";
import AdminLayout from "@/components/admin/admin-layout";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    template: "%s | Admin Panel",
    default: "Admin Panel"
  },
  description: "Admin panel untuk mengelola toko online",
  robots: {
    index: false,
    follow: false,
  },
};

interface AdminLayoutPageProps {
  children: React.ReactNode;
}

export default function AdminLayoutPage({ children }: AdminLayoutPageProps) {
  return (
    <>
      <AdminLayout>
        {children}
      </AdminLayout>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
        }}
      />
    </>
  );
}