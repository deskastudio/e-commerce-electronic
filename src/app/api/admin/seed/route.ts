import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function GET() {
  // Gunakan ini hanya untuk membuat admin pertama
  // Hapus atau nonaktifkan route ini di produksi
  try {
    await connectDB();
    
    // Cek apakah admin sudah ada
    const adminExists = await Admin.findOne({ email: 'admin@example.com' });
    
    if (adminExists) {
      return NextResponse.json({ 
        message: 'Admin sudah ada',
        admin: {
          id: adminExists._id,
          username: adminExists.username,
          email: adminExists.email
        }
      }, { status: 200 });
    }
    
    // Buat admin baru
    const newAdmin = await Admin.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123', // Ini akan di-hash oleh pre-save hook
      isAdmin: true
    });
    
    return NextResponse.json({ 
      message: 'Admin berhasil dibuat',
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json({ 
      error: 'Gagal membuat admin' 
    }, { status: 500 });
  }
}