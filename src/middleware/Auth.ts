import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Definisikan path yang memerlukan autentikasi admin
  const isAdminPath = path.startsWith('/admin');
  
  // Cek apakah path saat ini memerlukan autentikasi
  if (isAdminPath) {
    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    // Redirect ke login jika pengguna tidak terautentikasi
    if (!session) {
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }
    
    // Redirect jika pengguna bukan admin
    if (!session.isAdmin) {
      return NextResponse.redirect(new URL('/auth/unauthorized', request.url));
    }
  }
  
  return NextResponse.next();
}

// Konfigurasi path mana yang akan diproses oleh middleware
export const config = {
  matcher: ['/admin/:path*'],
};