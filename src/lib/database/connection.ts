// lib/database/connection.ts
import mongoose from 'mongoose';

interface ConnectionCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: ConnectionCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔍 Environment check:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- MONGODB_URI exists:', !!MONGODB_URI);

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined!');
  console.error('Please add MONGODB_URI to your .env.local file');
  console.error('Example: MONGODB_URI=mongodb://localhost:27017/electronic_commerce');
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached: ConnectionCache = globalThis.mongooseCache || {
  conn: null,
  promise: null,
};

if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    console.log('✅ Using existing MongoDB connection');
    console.log('📊 Connection state:', mongoose.connection.readyState);
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('🔄 Creating new MongoDB connection...');
    console.log('🌐 Connecting to:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      w: 'majority'
    };

    console.log('⚙️  Connection options:', {
      ...opts,
      maxPoolSize: opts.maxPoolSize,
      serverSelectionTimeoutMS: opts.serverSelectionTimeoutMS
    });

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB connected successfully!');
        console.log('📊 Connection details:');
        console.log('  - Database:', mongoose.connection.name);
        console.log('  - Host:', mongoose.connection.host);
        console.log('  - Port:', mongoose.connection.port);
        console.log('  - Ready state:', mongoose.connection.readyState);
        
        // Set up connection event listeners
        mongoose.connection.on('error', (error) => {
          console.error('❌ MongoDB connection error:', error);
        });

        mongoose.connection.on('disconnected', () => {
          console.warn('⚠️  MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
          console.log('🔄 MongoDB reconnected');
        });

        return mongoose;
      })
      .catch((error) => {
        console.error('❌ MongoDB connection failed:');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Full error:', error);
        
        // Reset promise so we can try again
        cached.promise = null;
        throw error;
      });
  }

  try {
    console.log('⏳ Waiting for connection promise...');
    cached.conn = await cached.promise;
    console.log('✅ Connection promise resolved');
    return cached.conn;
  } catch (error) {
    // Reset promise if connection fails
    cached.promise = null;
    console.error('❌ Failed to establish MongoDB connection:', error);
    throw error;
  }
}

export default connectDB;

// Export connection status checker
export async function checkConnection(): Promise<boolean> {
  try {
    await connectDB();
    const isConnected = mongoose.connection.readyState === 1;
    console.log('🔍 Connection check result:', isConnected ? 'CONNECTED' : 'NOT CONNECTED');
    return isConnected;
  } catch (error) {
    console.error('❌ Connection check failed:', error);
    return false;
  }
}

// Export connection info
export function getConnectionInfo() {
  const readyState = mongoose.connection.readyState;
  const states = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };

  const info = {
    status: states[readyState as keyof typeof states] || 'Unknown',
    readyState: readyState,
    database: mongoose.connection.name || 'Unknown',
    host: mongoose.connection.host || 'Unknown',
    port: mongoose.connection.port || 'Unknown'
  };

  console.log('📊 Current connection info:', info);
  return info;
}

// Export disconnect function for testing
export async function disconnectDB(): Promise<void> {
  if (cached.conn) {
    console.log('🔌 Disconnecting from MongoDB...');
    await cached.conn.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('✅ MongoDB disconnected');
  }
}