'use server';

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import ProductModel from "@/models/ProductModel";
import CategoryModel from "@/models/CategoryModel";
import { Product, ProductFormValues } from "@/models/Product";

// Koneksi ke database
async function dbConnect() {
  await connectDB();
  console.log("Connected to MongoDB database");
}

// Konversi dokumen Mongoose ke objek Product
function convertDocumentToProduct(doc: any): Product {
  return {
    id: doc._id.toString(),
    name: doc.name,
    description: doc.description,
    price: doc.price,
    discountPrice: doc.discountPrice,
    sku: doc.sku,
    stock: doc.stock,
    category: doc.category,
    status: doc.status,
    images: doc.images,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

// Fungsi untuk mendapatkan semua produk
export async function getProducts(): Promise<Product[]> {
  try {
    await dbConnect();
    const products = await ProductModel.find().sort({ createdAt: -1 });
    return products.map(convertDocumentToProduct);
  } catch (error) {
    console.error("Error getting products:", error);
    return [];
  }
}

// Fungsi untuk mendapatkan produk berdasarkan ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    await dbConnect();
    const product = await ProductModel.findById(id);
    
    if (!product) {
      return null;
    }
    
    return convertDocumentToProduct(product);
  } catch (error) {
    console.error(`Error getting product with ID ${id}:`, error);
    return null;
  }
}

// Fungsi untuk membuat produk baru (disesuaikan dengan form simpel)
export async function createProduct(data: ProductFormValues): Promise<Product> {
  try {
    console.log("Creating product with data:", data);
    await dbConnect();
    
    // Memastikan images tidak kosong
    const productData = {
      ...data,
      images: data.images?.length ? data.images : ["/placeholder.svg?height=300&width=300"],
    };
    
    const newProduct = await ProductModel.create(productData);
    console.log("Product created successfully:", newProduct._id);
    
    // Revalidasi path agar data terupdate di UI
    revalidatePath('/admin/products');
    
    return convertDocumentToProduct(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product: " + (error as Error).message);
  }
}

// Fungsi untuk mengupdate produk
export async function updateProduct(id: string, data: ProductFormValues): Promise<Product | null> {
  try {
    console.log("Updating product with ID:", id, "and data:", data);
    await dbConnect();
    
    // Gunakan { new: true } untuk mengembalikan dokumen yang telah diupdate
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id, 
      data, 
      { new: true }
    );
    
    if (!updatedProduct) {
      console.error("Product not found for update with ID:", id);
      return null;
    }
    
    console.log("Product updated successfully:", updatedProduct._id);
    
    // Revalidasi path agar data terupdate di UI
    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${id}`);
    
    return convertDocumentToProduct(updatedProduct);
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw new Error("Failed to update product: " + (error as Error).message);
  }
}

// Fungsi untuk menghapus produk
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    console.log("Deleting product with ID:", id);
    await dbConnect();
    
    const result = await ProductModel.findByIdAndDelete(id);
    
    if (!result) {
      console.error("Product not found for deletion with ID:", id);
      return false;
    }
    
    console.log("Product deleted successfully:", id);
    
    // Revalidasi path agar data terupdate di UI
    revalidatePath('/admin/products');
    
    // Kembalikan true jika produk berhasil dihapus
    return true;
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw new Error("Failed to delete product: " + (error as Error).message);
  }
}

// Fungsi untuk mencari produk berdasarkan query tertentu
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    await dbConnect();
    
    // Buat regex untuk pencarian case-insensitive
    const searchRegex = new RegExp(query, 'i');
    
    const products = await ProductModel.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { sku: searchRegex }
      ]
    });
    
    return products.map(convertDocumentToProduct);
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}

// Fungsi untuk mendapatkan produk dengan paginasi
export async function getProductsPaginated(page: number = 1, limit: number = 10): Promise<{
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}> {
  try {
    await dbConnect();
    
    const skip = (page - 1) * limit;
    
    // Dapatkan total jumlah produk
    const total = await ProductModel.countDocuments();
    
    // Dapatkan produk dengan paginasi
    const products = await ProductModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      products: products.map(convertDocumentToProduct),
      total,
      page,
      totalPages,
    };
  } catch (error) {
    console.error("Error getting paginated products:", error);
    return {
      products: [],
      total: 0,
      page,
      totalPages: 0,
    };
  }
}

// Fungsi untuk mendapatkan kategori
export async function getCategories() {
  try {
    await dbConnect();
    
    // Periksa apakah ada kategori
    const count = await CategoryModel.countDocuments();
    
    // Jika tidak ada kategori, buat kategori default
    if (count === 0) {
      const defaultCategories = [
        { name: "Gaming", slug: "gaming", description: "Produk untuk gaming" },
        { name: "Accessories", slug: "accessories", description: "Aksesori elektronik" },
        { name: "Monitors", slug: "monitors", description: "Monitor dan display" },
        { name: "Components", slug: "components", description: "Komponen komputer" },
        { name: "Laptops", slug: "laptops", description: "Laptop dan notebook" },
        { name: "Peripherals", slug: "peripherals", description: "Periferal komputer" },
      ];
      
      await CategoryModel.insertMany(defaultCategories);
    }
    
    const categories = await CategoryModel.find().sort({ name: 1 });
    
    return categories.map(cat => ({
      id: cat._id.toString(),
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      imageUrl: cat.imageUrl,
    }));
  } catch (error) {
    console.error("Error getting categories:", error);
    
    // Kembalikan kategori default jika terjadi error
    return [
      { id: "gaming", name: "Gaming", slug: "gaming" },
      { id: "accessories", name: "Accessories", slug: "accessories" },
      { id: "monitors", name: "Monitors", slug: "monitors" },
      { id: "components", name: "Components", slug: "components" },
      { id: "laptops", name: "Laptops", slug: "laptops" },
      { id: "peripherals", name: "Peripherals", slug: "peripherals" },
    ];
  }
}

// Fungsi untuk mendapatkan produk berdasarkan kategori
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    await dbConnect();
    
    const products = await ProductModel.find({ category });
    
    return products.map(convertDocumentToProduct);
  } catch (error) {
    console.error(`Error getting products in category ${category}:`, error);
    return [];
  }
}

// Fungsi untuk mendapatkan produk berdasarkan status
export async function getProductsByStatus(status: string): Promise<Product[]> {
  try {
    await dbConnect();
    
    const products = await ProductModel.find({ status });
    
    return products.map(convertDocumentToProduct);
  } catch (error) {
    console.error(`Error getting products with status ${status}:`, error);
    return [];
  }
}