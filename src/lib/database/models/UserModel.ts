// models/UserModel.ts
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
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

// Mencegah error ketika model sudah dikompilasi
const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

export default UserModel;