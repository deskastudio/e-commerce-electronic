// app/api/seed/admin/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { createAdminUser } from '@/lib/user-db';

export async function GET() {
  // Gunakan ini hanya untuk membuat admin pertama
  // Hapus atau nonaktifkan route ini di produksi
  try {
    await connectDB();
    
    // Buat admin baru menggunakan fungsi createAdminUser
    const admin = await createAdminUser({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'Admin123456'
    });
    
    return NextResponse.json({ 
      message: 'Admin berhasil dibuat',
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json({ 
      error: 'Gagal membuat admin: ' + (error as Error).message
    }, { status: 500 });
  }
}