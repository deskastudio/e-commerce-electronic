'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TopBar from "@/components/home/top-bar";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

export default function LogoutPage() {
  useEffect(() => {
    const performLogout = async () => {
      toast.info('Berhasil logout', {
        description: 'Terima kasih telah menggunakan layanan kami'
      });
      
      // Menunda signout sedikit untuk memungkinkan toast ditampilkan
      setTimeout(async () => {
        await signOut({ callbackUrl: '/' });
      }, 1500);
    };
    
    performLogout();
  }, []);
  
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Logging Out</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              Anda akan segera dialihkan ke halaman utama...
            </p>
            <div className="mt-6 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}