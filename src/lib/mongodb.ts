import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const MONGODB_URI = process.env.MONGODB_URI;

let cachedConnection: typeof mongoose | null = null;

async function connectDB() {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const options = {
      bufferCommands: false,
    };

    const mongooseInstance = await mongoose.connect(MONGODB_URI, options);
    
    cachedConnection = mongooseInstance;
    console.log('MongoDB connected successfully');
    
    return mongooseInstance;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default connectDB;