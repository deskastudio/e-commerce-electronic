import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    const mongoose = await connectDB();
    const connectionStatus = mongoose.connection.readyState;
    
    // Tetapkan tipe yang jelas untuk collections dan dbName
    let collections: string[] = [];
    let dbName: string = '';
    
    if (mongoose.connection.db) {
      const collectionList = await mongoose.connection.db.collections();
      // Secara eksplisit menetapkan tipe hasil mapping
      collections = collectionList.map((c) => c.collectionName);
      dbName = mongoose.connection.db.databaseName;
    }
    
    return NextResponse.json({
      status: 'Connected to MongoDB!',
      connectionState: connectionStatus,
      database: dbName,
      collections: collections
    }, { status: 200 });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      error: 'Failed to connect to MongoDB',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}