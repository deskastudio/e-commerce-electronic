'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import TopBar from "@/components/home/top-bar";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  
  useEffect(() => {
    if (error) {
      toast.error('Login gagal', {
        description: decodeURIComponent(error)
      });
    }
  }, [error]);
  
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Login Gagal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">
              {error ? decodeURIComponent(error) : 'Terjadi kesalahan saat login'}
            </p>
            <p className="text-sm text-gray-500 text-center">
              Silakan coba lagi dengan kredensial yang benar, atau hubungi administrator jika masalah berlanjut.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/">Kembali ke Home</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/login">Coba Login Kembali</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}