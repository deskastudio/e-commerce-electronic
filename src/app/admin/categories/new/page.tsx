// app/admin/categories/new/page.tsx - New Category
import { Metadata } from "next";
import CategoryForm from "@/components/admin/categories/category-form";

export const metadata: Metadata = {
  title: "Tambah Kategori Baru | Admin Panel",
  description: "Tambahkan kategori baru untuk produk"
};

export default function NewCategoryPage() {
  return (
    <CategoryForm isEditing={false} />
  );
}