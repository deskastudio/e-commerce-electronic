// app/admin/categories/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import { Metadata } from "next";
import EditCategoryForm from "@/components/admin/categories/edit-category-form";
import connectDB from "@/lib/database/connection";
import CategoryModel from "@/lib/database/models/Category";

interface EditCategoryPageProps {
  params: {
    id: string;
  };
}

// Helper function to validate ObjectId
function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

async function getCategory(id: string) {
  try {
    if (!isValidObjectId(id)) {
      return null;
    }

    await connectDB();
    const category = await CategoryModel.findById(id).lean();
    
    if (!category) {
      return null;
    }

    return {
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export async function generateMetadata({ params }: EditCategoryPageProps): Promise<Metadata> {
  const category = await getCategory(params.id);
  
  if (!category) {
    return {
      title: "Kategori Tidak Ditemukan | Admin Dashboard",
    };
  }
  
  return {
    title: `Edit ${category.name} | Admin Dashboard`,
    description: `Edit kategori ${category.name}`,
  };
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const category = await getCategory(params.id);
  
  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Kategori</h1>
        <p className="text-muted-foreground">
          Perbarui informasi kategori "{category.name}"
        </p>
      </div>
      
      <EditCategoryForm category={category} />
    </div>
  );
}