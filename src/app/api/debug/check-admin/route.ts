// app/api/debug/check-admin/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import UserModel from '@/models/UserModel';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    // Dapatkan email dari query parameter
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ 
        error: 'Email diperlukan' 
      }, { status: 400 });
    }
    
    // Cek di model User
    const userAdmin = await UserModel.findOne({ 
      email,
      role: 'admin'
    });
    
    // Jika tidak ditemukan, cari user dengan email yang sama
    const regularUser = !userAdmin 
      ? await UserModel.findOne({ email }) 
      : null;
    
    return NextResponse.json({
      foundInUserModel: !!userAdmin,
      isAdmin: userAdmin?.role === 'admin',
      userDetails: userAdmin ? {
        id: userAdmin._id,
        name: userAdmin.name,
        email: userAdmin.email,
        role: userAdmin.role,
        hasPassword: !!userAdmin.password,
        passwordLength: userAdmin.password?.length || 0
      } : null,
      
      foundAsRegularUser: !!regularUser,
      regularUserDetails: regularUser ? {
        id: regularUser._id,
        name: regularUser.name,
        email: regularUser.email,
        role: regularUser.role
      } : null
    });
    
  } catch (error) {
    console.error('Debug admin error:', error);
    return NextResponse.json({ 
      error: 'Gagal memeriksa admin: ' + (error as Error).message 
    }, { status: 500 });
  }
}