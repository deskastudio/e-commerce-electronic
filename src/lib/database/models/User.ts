// models/User.ts
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

export interface UserFormValues {
  name: string;
  emailOrPhone: string;
  password: string;
}

// Check if string is an email
export function isEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}