// src/app/layout.tsx - Root Layout yang diperbaiki
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/providers/auth-provider';
import { CartProvider } from '@/providers/cart-provider';
import ConditionalLayout from '@/components/layout/conditional-layout';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Electronic Commerce',
  description: 'Toko elektronik online terpercaya',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            <Toaster 
              position="top-right" 
              richColors
              closeButton
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}