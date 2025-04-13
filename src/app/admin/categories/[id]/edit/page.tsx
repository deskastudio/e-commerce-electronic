import { notFound } from "next/navigation";
import SimpleCategoryForm from "@/components/admin/categories/category-form";
import { getCategoryById } from "@/lib/categories-db";

interface CategoryEditPageProps {
  params: {
    id: string;
  };
}

export default async function CategoryEditPage({ params }: CategoryEditPageProps) {
  const category = await getCategoryById(params.id);
  if (!category) {
    notFound();
  }
  
  return (
    <SimpleCategoryForm 
      initialData={category} 
      isEditing
    />
  );
}