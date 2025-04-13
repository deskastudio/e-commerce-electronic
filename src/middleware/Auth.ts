// middleware.ts (atau Auth.ts)
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequestWithAuth } from 'next-auth/middleware';

export default async function middleware(req: NextRequestWithAuth) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Proteksi route admin
  if (pathname.startsWith('/admin')) {
    // Jika tidak login, redirect ke halaman login
    if (!token) {
      const url = new URL('/login', req.url);
      url.searchParams.set('callbackUrl', encodeURI(pathname));
      return NextResponse.redirect(url);
    }
    
    // Jika bukan admin, redirect ke halaman unauthorized
    if (!token.isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  // Route yang memerlukan autentikasi
  if (pathname.startsWith('/account') && !token) {
    const url = new URL('/login', req.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Konfigurasi path yang perlu proteksi
export const config = {
  matcher: ['/admin/:path*', '/account/:path*']
};