import SimpleProductForm from "@/components/admin/product-form";
import { getCategories } from "@/lib/products-db";

export default async function NewProductPage() {
  const categories = await getCategories();
  
  return <SimpleProductForm categories={categories} />;
}