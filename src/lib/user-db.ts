// lib/user-db.ts
'use server';

import connectDB from "@/lib/mongodb";
import UserModel from "@/models/UserModel";
import { User, UserFormValues, isEmail } from "@/models/User";

// Connect to database
async function dbConnect() {
  await connectDB();
  console.log("Connected to MongoDB database");
}

// Convert Mongoose document to User object
function convertDocumentToUser(doc: any): User {
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

// Get all users
export async function getUsers(): Promise<User[]> {
  try {
    await dbConnect();
    const users = await UserModel.find().sort({ name: 1 });
    return users.map(convertDocumentToUser);
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  try {
    await dbConnect();
    const user = await UserModel.findById(id);
    
    if (!user) {
      return null;
    }
    
    return convertDocumentToUser(user);
  } catch (error) {
    console.error(`Error getting user with ID ${id}:`, error);
    return null;
  }
}

// Get user by email or phone
export async function getUserByEmailOrPhone(emailOrPhone: string): Promise<User | null> {
  try {
    await dbConnect();
    
    const query = isEmail(emailOrPhone)
      ? { email: emailOrPhone }
      : { phone: emailOrPhone };
    
    const user = await UserModel.findOne(query);
    
    if (!user) {
      return null;
    }
    
    return convertDocumentToUser(user);
  } catch (error) {
    console.error(`Error getting user with email/phone ${emailOrPhone}:`, error);
    return null;
  }
}

// Register new user
export async function registerUser(data: UserFormValues): Promise<User> {
  try {
    console.log("Registering user with data:", data);
    await dbConnect();
    
    // Determine if input is email or phone
    const emailOrPhoneValue = data.emailOrPhone;
    
    // Check if user already exists
    const existingUser = await getUserByEmailOrPhone(emailOrPhoneValue);
    if (existingUser) {
      throw new Error(`User dengan email/phone '${emailOrPhoneValue}' sudah terdaftar`);
    }
    
    // Prepare user data
    const userData: any = {
      name: data.name,
      password: data.password,
      role: 'user', // Always set role to 'user' for registration
    };
    
    // Set either email or phone based on input
    if (isEmail(emailOrPhoneValue)) {
      userData.email = emailOrPhoneValue;
    } else {
      userData.phone = emailOrPhoneValue;
    }
    
    // Create the user (password will be hashed by the model's pre-save hook)
    const newUser = await UserModel.create(userData);
    console.log("User registered successfully:", newUser._id);
    
    return convertDocumentToUser(newUser);
  } catch (error) {
    console.error("Error registering user:", error);
    throw new Error("Gagal mendaftarkan pengguna: " + (error as Error).message);
  }
}

// Create admin user (special function for admin creation)
export async function createAdminUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  try {
    console.log("Creating admin user:", data.email);
    await dbConnect();
    
    // Check if admin already exists
    const existingAdmin = await UserModel.findOne({ 
      email: data.email,
      role: 'admin'
    });
    
    if (existingAdmin) {
      console.log("Admin already exists:", existingAdmin._id);
      return convertDocumentToUser(existingAdmin);
    }
    
    // Create the admin user
    const adminData = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'admin'
    };
    
    const newAdmin = await UserModel.create(adminData);
    console.log("Admin created successfully:", newAdmin._id);
    
    return convertDocumentToUser(newAdmin);
  } catch (error) {
    console.error("Error creating admin:", error);
    throw new Error("Gagal membuat admin: " + (error as Error).message);
  }
}

// Update user
export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  try {
    console.log("Updating user with ID:", id, "and data:", data);
    await dbConnect();
    
    // Ensure role cannot be changed to admin except through a special function
    if (data.role === 'admin') {
      delete data.role;
    }
    
    const user = await UserModel.findById(id);
    if (!user) {
      console.error("User not found for update with ID:", id);
      return null;
    }
    
    // Update user data
    const updatedUser = await UserModel.findByIdAndUpdate(
      id, 
      data, 
      { new: true }
    );
    
    if (!updatedUser) {
      console.error("Failed to update user with ID:", id);
      return null;
    }
    
    console.log("User updated successfully:", updatedUser._id);
    
    return convertDocumentToUser(updatedUser);
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw new Error("Gagal mengupdate pengguna: " + (error as Error).message);
  }
}

// Delete user
export async function deleteUser(id: string): Promise<boolean> {
  try {
    console.log("Deleting user with ID:", id);
    await dbConnect();
    
    const result = await UserModel.findByIdAndDelete(id);
    
    if (!result) {
      console.error("User not found for deletion with ID:", id);
      return false;
    }
    
    console.log("User deleted successfully:", id);
    
    return true;
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw new Error("Gagal menghapus pengguna: " + (error as Error).message);
  }
}