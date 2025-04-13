// app/admin/layout.tsx
'use client';

import type { ReactNode } from "react";
import { useSession, SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar from "@/components/admin/admin-sidebar";

// Wrapper component with SessionProvider
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  );
}

// Content component that uses useSession
function AdminLayoutContent({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      // If not authenticated at all, redirect to login
      router.push('/login?callbackUrl=/admin');
    } else if (session && !session.user.isAdmin) {
      // If authenticated but not an admin, redirect to home
      console.log('User is not an admin, redirecting to home');
      router.push('/');
    } else {
      // If admin, show content
      setIsLoading(false);
    }
  }, [status, session, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p>Memverifikasi akses admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}