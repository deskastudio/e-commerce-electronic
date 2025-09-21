// models/User.ts - Unified User Model
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// TypeScript Interface for User
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// User type for frontend use (without mongoose Document methods)
export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Form values interface for registration
export interface UserFormValues {
  name: string;
  emailOrPhone: string;
  password: string;
}

// Utility function to check if string is email
export function isEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

// Mongoose Schema Definition
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Nama diperlukan'],
    trim: true,
    minlength: [2, 'Nama minimal 2 karakter'],
    maxlength: [50, 'Nama tidak boleh lebih dari 50 karakter']
  },
  email: {
    type: String,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Masukkan alamat email yang valid'
    ],
    sparse: true, // Memungkinkan nilai null dengan tetap menjaga keunikan
    index: true
  },
  phone: {
    type: String,
    match: [
      /^\+?[\d\s-]{8,}$/,
      'Masukkan nomor telepon yang valid'
    ],
    sparse: true, // Memungkinkan nilai null dengan tetap menjaga keunikan
    index: true
  },
  password: {
    type: String,
    required: [true, 'Password diperlukan'],
    minlength: [8, 'Password minimal 8 karakter']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { 
  timestamps: true 
});

// Memastikan salah satu dari email atau phone harus ada
userSchema.pre('validate', function(next) {
  if (!this.email && !this.phone) {
    this.invalidate('email', 'Email atau nomor telepon harus diisi');
  }
  next();
});

// Index untuk memastikan keunikan email dan phone
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ phone: 1 }, { unique: true, sparse: true });

// Hash password sebelum menyimpan
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Metode untuk membandingkan password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Helper function to convert mongoose document to User object
export function convertDocumentToUser(doc: IUser): User {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email || undefined,
    phone: doc.phone || undefined,
    password: doc.password, // Note: password is hashed
    role: doc.role,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    comparePassword: doc.comparePassword.bind(doc),
  };
}

// Mencegah error ketika model sudah dikompilasi
const UserModel = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default UserModel;