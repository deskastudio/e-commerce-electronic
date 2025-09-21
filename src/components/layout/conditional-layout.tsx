// src/components/layout/conditional-layout.tsx
'use client';

import { usePathname } from 'next/navigation';
import TopBar from './top-bar';
import Header from './header';
import Footer from './footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Tentukan apakah halaman ini perlu Header/Footer
  const isAdminPage = pathname.startsWith('/admin');
  const isAuthPage = pathname.startsWith('/auth') || pathname.startsWith('/login') || pathname.startsWith('/register');
  const isApiRoute = pathname.startsWith('/api');
  
  // Jangan tampilkan Header/Footer untuk halaman admin, auth, atau API
  const shouldShowHeaderFooter = !isAdminPage && !isAuthPage && !isApiRoute;

  if (!shouldShowHeaderFooter) {
    // Untuk admin dan auth pages, tampilkan children saja
    return <>{children}</>;
  }

  // Untuk user pages, tampilkan dengan Header/Footer
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Bar */}
      <TopBar />
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}