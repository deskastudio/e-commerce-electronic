// app/admin/products/new/page.tsx - Updated with new structure
import { Metadata } from "next";
import SimpleProductForm from "@/components/admin/products/product-form";

// Updated imports with new structure
import { CategoryService } from "@/lib/database/services";

export const metadata: Metadata = {
  title: "Tambah Produk Baru | Admin Panel",
  description: "Tambahkan produk baru ke toko anda"
};

export default async function NewProductPage() {
  try {
    // Initialize default categories if none exist
    await CategoryService.initializeDefaultCategories();
    
    // Get categories with new service layer
    const categories = await CategoryService.getCategoriesForSelect();
    
    // Ensure we have at least one category
    if (!categories || categories.length === 0) {
      // Fallback categories if service fails
      const fallbackCategories = [
        { 
          id: "gaming", 
          name: "Gaming",
          slug: "gaming"
        },
        { 
          id: "accessories", 
          name: "Accessories",
          slug: "accessories"
        },
        { 
          id: "monitors", 
          name: "Monitors",
          slug: "monitors"
        }
      ];
      
      return (
        <SimpleProductForm 
          categories={fallbackCategories}
          isEditing={false}
        />
      );
    }
    
    return (
      <SimpleProductForm 
        categories={categories}
        isEditing={false}
      />
    );
  } catch (error) {
    console.error('Error loading categories:', error);
    
    // Fallback with default categories
    const defaultCategories = [
      { 
        id: "default", 
        name: "Default",
        slug: "default"
      }
    ];
    
    return (
      <SimpleProductForm 
        categories={defaultCategories}
        isEditing={false}
      />
    );
  }
}