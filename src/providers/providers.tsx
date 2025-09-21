// src/providers/providers.tsx
'use client';

import { ReactNode } from 'react';
import AuthProvider from './auth-provider';
import { CartProvider } from './cart-provider';
import { Toaster } from 'sonner'; // atau toast library yang Anda gunakan

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <Toaster position="top-right" />
      </CartProvider>
    </AuthProvider>
  );
}