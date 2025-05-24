// app/admin/categories/[id]/edit/page.tsx - Category Edit
import { notFound } from "next/navigation";
import { Metadata } from "next";
import CategoryForm from "@/components/admin/categories/category-form";

// Updated imports with new structure
import { CategoryService } from "@/lib/database/services";

interface CategoryEditPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: CategoryEditPageProps): Promise<Metadata> {
  try {
    const category = await CategoryService.getCategoryById(params.id);
    
    if (!category) {
      return {
        title: "Kategori Tidak Ditemukan | Admin Panel",
      };
    }
    
    return {
      title: `Edit ${category.name} | Admin Panel`,
      description: `Edit kategori ${category.name}`,
    };
  } catch (error) {
    return {
      title: "Error | Admin Panel",
    };
  }
}

export default async function CategoryEditPage({ params }: CategoryEditPageProps) {
  try {
    const category = await CategoryService.getCategoryById(params.id);
    
    if (!category) {
      notFound();
    }
    
    return (
      <CategoryForm 
        initialData={category}
        isEditing={true}
      />
    );
  } catch (error) {
    console.error('Error loading category:', error);
    notFound();
  }
}