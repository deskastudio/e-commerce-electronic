// app/admin/categories/add/page.tsx
import AddCategoryForm from "@/components/admin/categories/add-category-form";

export const metadata = {
  title: "Tambah Kategori | Admin Dashboard",
  description: "Tambah kategori produk baru"
};

export default function AddCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tambah Kategori</h1>
        <p className="text-muted-foreground">
          Buat kategori baru untuk mengorganisir produk Anda
        </p>
      </div>
      
      <AddCategoryForm />
    </div>
  );
}