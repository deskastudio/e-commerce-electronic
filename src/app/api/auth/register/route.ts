// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/user-db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || (!data.email && !data.phone) || !data.password) {
      return NextResponse.json(
        { message: 'Semua field wajib diisi' },
        { status: 400 }
      );
    }
    
    // Make sure only user role is allowed (no admin registration)
    if (data.role === 'admin') {
      return NextResponse.json(
        { message: 'Tidak diizinkan mendaftar sebagai admin' },
        { status: 403 }
      );
    }
    
    // Register the user
    const user = await registerUser({
      name: data.name,
      emailOrPhone: data.email || data.phone,
      password: data.password
    });
    
    // Return success without sensitive data
    return NextResponse.json({
      message: 'Registrasi berhasil',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration API error:', error);
    
    return NextResponse.json(
      { message: (error as Error).message || 'Terjadi kesalahan saat mendaftar' },
      { status: 500 }
    );
  }
}