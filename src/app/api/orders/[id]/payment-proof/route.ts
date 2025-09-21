// app/api/orders/[id]/payment-proof/route.ts - Payment Proof Upload API
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database/connection';
import OrderModel from '@/lib/database/models/Order';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('💳 ===============================================');
    console.log('💳 PAYMENT PROOF API - Upload starting');
    console.log('💳 Order ID:', params.id);
    console.log('💳 ===============================================');

    // Validate order ID
    if (!params.id) {
      return NextResponse.json({
        success: false,
        error: 'Order ID is required'
      }, { status: 400 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bankAccount = formData.get('bankAccount') as string;
    const transferAmount = formData.get('transferAmount') as string;
    const transferDate = formData.get('transferDate') as string;
    const senderName = formData.get('senderName') as string;
    const notes = formData.get('notes') as string;

    console.log('📋 Payment proof data:', {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      bankAccount,
      transferAmount,
      transferDate,
      senderName,
      notesLength: notes?.length || 0
    });

    // Validate required fields
    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'Payment proof file is required'
      }, { status: 400 });
    }

    if (!bankAccount || !transferAmount || !transferDate || !senderName) {
      return NextResponse.json({
        success: false,
        error: 'All payment proof fields are required'
      }, { status: 400 });
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid file type. Only JPEG, PNG, WebP, and PDF files are allowed'
      }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: 'File size too large. Maximum size is 5MB'
      }, { status: 400 });
    }

    // Connect to database
    await connectDB();
    console.log('✅ Database connected');

    // Find order
    const order = await OrderModel.findById(params.id);
    
    if (!order) {
      console.log('❌ Order not found');
      return NextResponse.json({
        success: false,
        error: 'Order not found'
      }, { status: 404 });
    }

    // Check if order can accept payment proof
    if (order.paymentMethod !== 'bank_transfer') {
      return NextResponse.json({
        success: false,
        error: 'Payment proof is only required for bank transfer orders'
      }, { status: 400 });
    }

    if (order.paymentStatus === 'paid') {
      return NextResponse.json({
        success: false,
        error: 'Payment proof has already been approved for this order'
      }, { status: 400 });
    }

    // Create upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'payment-proofs');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.log('Upload directory already exists or created');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = path.extname(file.name);
    const fileName = `payment-proof-${params.id}-${timestamp}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);
    const fileUrl = `/uploads/payment-proofs/${fileName}`;

    console.log('📁 File upload details:', {
      fileName,
      filePath,
      fileUrl
    });

    // Save file to disk
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);
      console.log('✅ File saved successfully');
    } catch (fileError) {
      console.error('❌ File save error:', fileError);
      return NextResponse.json({
        success: false,
        error: 'Failed to save uploaded file'
      }, { status: 500 });
    }

    // Create payment proof object
    const paymentProof = {
      fileName,
      fileUrl,
      bankAccount,
      transferAmount: parseFloat(transferAmount),
      transferDate: new Date(transferDate),
      senderName,
      notes: notes || '',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Update order with payment proof
    order.paymentProof = paymentProof;
    order.paymentStatus = 'pending'; // Keep as pending until admin approval
    
    await order.save();

    console.log('✅ Payment proof saved to order');
    console.log('💳 ===============================================');

    return NextResponse.json({
      success: true,
      message: 'Payment proof uploaded successfully. Please wait for verification.',
      paymentProof: {
        fileName: paymentProof.fileName,
        fileUrl: paymentProof.fileUrl,
        bankAccount: paymentProof.bankAccount,
        transferAmount: paymentProof.transferAmount,
        transferDate: paymentProof.transferDate,
        senderName: paymentProof.senderName,
        notes: paymentProof.notes,
        status: paymentProof.status,
        createdAt: paymentProof.createdAt.toISOString(),
        updatedAt: paymentProof.updatedAt.toISOString()
      }
    }, { status: 200 });

  } catch (error) {
    console.error('❌ PAYMENT PROOF API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to upload payment proof',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET method to retrieve payment proof details (optional)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('📋 Getting payment proof for order:', params.id);

    await connectDB();

    const order = await OrderModel.findById(params.id);
    
    if (!order) {
      return NextResponse.json({
        success: false,
        error: 'Order not found'
      }, { status: 404 });
    }

    if (!order.paymentProof) {
      return NextResponse.json({
        success: false,
        error: 'No payment proof found for this order'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      paymentProof: order.paymentProof
    }, { status: 200 });

  } catch (error) {
    console.error('❌ GET payment proof error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve payment proof',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}