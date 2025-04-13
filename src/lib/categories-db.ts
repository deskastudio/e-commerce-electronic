'use server';

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import CategoryModel from "@/models/CategoryModel";
import { Category, CategoryFormValues, generateSlug } from "@/models/Category";

// Koneksi ke database
async function dbConnect() {
  await connectDB();
  console.log("Connected to MongoDB database");
}

// Konversi dokumen Mongoose ke objek Category
function convertDocumentToCategory(doc: any): Category {
  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    description: doc.description || undefined,
    imageUrl: doc.imageUrl || undefined,
    isActive: doc.isActive,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

// Fungsi untuk mendapatkan semua kategori
export async function getCategories(): Promise<Category[]> {
  try {
    await dbConnect();
    const categories = await CategoryModel.find().sort({ name: 1 });
    return categories.map(convertDocumentToCategory);
  } catch (error) {
    console.error("Error getting categories:", error);
    
    // Kembalikan array kosong jika terjadi error
    return [];
  }
}

// Fungsi untuk mendapatkan kategori berdasarkan ID
export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    await dbConnect();
    const category = await CategoryModel.findById(id);
    
    if (!category) {
      return null;
    }
    
    return convertDocumentToCategory(category);
  } catch (error) {
    console.error(`Error getting category with ID ${id}:`, error);
    return null;
  }
}

// Fungsi untuk mendapatkan kategori berdasarkan slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    await dbConnect();
    const category = await CategoryModel.findOne({ slug });
    
    if (!category) {
      return null;
    }
    
    return convertDocumentToCategory(category);
  } catch (error) {
    console.error(`Error getting category with slug ${slug}:`, error);
    return null;
  }
}

// Fungsi untuk membuat kategori baru
export async function createCategory(data: CategoryFormValues): Promise<Category> {
  try {
    console.log("Creating category with data:", data);
    await dbConnect();
    
    // Generate slug dari nama
    const slug = generateSlug(data.name);
    
    // Periksa apakah slug sudah ada
    const existingCategory = await CategoryModel.findOne({ slug });
    if (existingCategory) {
      throw new Error(`Kategori dengan slug '${slug}' sudah ada`);
    }
    
    const categoryData = {
      ...data,
      slug,
      isActive: data.isActive ?? true,
    };
    
    const newCategory = await CategoryModel.create(categoryData);
    console.log("Category created successfully:", newCategory._id);
    
    // Revalidasi path agar data terupdate di UI
    revalidatePath('/admin/categories');
    
    return convertDocumentToCategory(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Failed to create category: " + (error as Error).message);
  }
}

// Fungsi untuk mengupdate kategori
export async function updateCategory(id: string, data: CategoryFormValues): Promise<Category | null> {
  try {
    console.log("Updating category with ID:", id, "and data:", data);
    await dbConnect();
    
    const category = await CategoryModel.findById(id);
    if (!category) {
      console.error("Category not found for update with ID:", id);
      return null;
    }
    
    // Jika nama berubah, generate slug baru
    let slug = category.slug;
    if (data.name && data.name !== category.name) {
      slug = generateSlug(data.name);
      
      // Periksa apakah slug baru sudah ada (kecuali untuk kategori ini sendiri)
      const existingCategory = await CategoryModel.findOne({ 
        slug, 
        _id: { $ne: id } 
      });
      
      if (existingCategory) {
        throw new Error(`Kategori dengan slug '${slug}' sudah ada`);
      }
    }
    
    const categoryData = {
      ...data,
      slug,
    };
    
    // Gunakan { new: true } untuk mengembalikan dokumen yang telah diupdate
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id, 
      categoryData, 
      { new: true }
    );
    
    if (!updatedCategory) {
      console.error("Failed to update category with ID:", id);
      return null;
    }
    
    console.log("Category updated successfully:", updatedCategory._id);
    
    // Revalidasi path agar data terupdate di UI
    revalidatePath('/admin/categories');
    revalidatePath(`/admin/categories/${id}`);
    
    return convertDocumentToCategory(updatedCategory);
  } catch (error) {
    console.error(`Error updating category with ID ${id}:`, error);
    throw new Error("Failed to update category: " + (error as Error).message);
  }
}

// Fungsi untuk menghapus kategori
export async function deleteCategory(id: string): Promise<boolean> {
  try {
    console.log("Deleting category with ID:", id);
    await dbConnect();
    
    // Periksa apakah ada produk yang menggunakan kategori ini
    // Ini memerlukan model Product dan fungsi terkait
    // Kode berikut hanya sebagai contoh, perlu disesuaikan dengan model Anda
    /*
    const ProductModel = mongoose.models.Product;
    if (ProductModel) {
      const productsWithCategory = await ProductModel.countDocuments({ category: id });
      if (productsWithCategory > 0) {
        throw new Error(`Tidak dapat menghapus kategori yang digunakan oleh ${productsWithCategory} produk`);
      }
    }
    */
    
    const result = await CategoryModel.findByIdAndDelete(id);
    
    if (!result) {
      console.error("Category not found for deletion with ID:", id);
      return false;
    }
    
    console.log("Category deleted successfully:", id);
    
    // Revalidasi path agar data terupdate di UI
    revalidatePath('/admin/categories');
    
    // Kembalikan true jika kategori berhasil dihapus
    return true;
  } catch (error) {
    console.error(`Error deleting category with ID ${id}:`, error);
    throw new Error("Failed to delete category: " + (error as Error).message);
  }
}