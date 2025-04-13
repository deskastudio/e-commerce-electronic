import { notFound } from "next/navigation";
import SimpleProductForm from "@/components/admin/product-form";
import { getProductById, getCategories } from "@/lib/products-db";

interface ProductEditPageProps {
  params: {
    id: string;
  };
}

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  const product = await getProductById(params.id);
  const categories = await getCategories();
  
  if (!product) {
    notFound();
  }
  
  return <SimpleProductForm 
    initialData={product} 
    categories={categories} 
    isEditing 
  />;
}