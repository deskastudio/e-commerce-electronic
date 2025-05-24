// app/admin/products/[id]/edit/page.tsx - Updated with new structure
import { notFound } from "next/navigation";
import { Metadata } from "next";
import SimpleProductForm from "@/components/admin/products/product-form";

// Updated imports with new structure
import { ProductService, CategoryService } from "@/lib/database/services";

interface ProductEditPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProductEditPageProps): Promise<Metadata> {
  try {
    const product = await ProductService.getProductById(params.id);
    
    if (!product) {
      return {
        title: "Produk Tidak Ditemukan | Admin Panel",
      };
    }
    
    return {
      title: `Edit ${product.name} | Admin Panel`,
      description: `Edit produk ${product.name}`,
    };
  } catch (error) {
    return {
      title: "Error | Admin Panel",
    };
  }
}

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  try {
    // Get product and categories in parallel
    const [product, categories] = await Promise.all([
      ProductService.getProductById(params.id),
      CategoryService.getCategoriesForSelect()
    ]);
    
    if (!product) {
      notFound();
    }
    
    // Ensure we have categories
    const finalCategories = categories && categories.length > 0 
      ? categories 
      : [
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
        initialData={product} 
        categories={finalCategories} 
        isEditing={true}
      />
    );
  } catch (error) {
    console.error('Error loading product or categories:', error);
    notFound();
  }
}