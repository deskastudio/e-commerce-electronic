'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-red-500">Akses Ditolak</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">
            Anda tidak memiliki izin untuk mengakses halaman admin.
          </p>
          <p className="text-center text-sm text-gray-500">
            Silakan hubungi administrator jika Anda yakin seharusnya memiliki akses.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/">Kembali ke Home</Link>
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
          >
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}