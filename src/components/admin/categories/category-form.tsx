"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";

// Import fungsi database
import { createCategory, updateCategory } from "@/lib/categories-db";
import { Category, CategoryFormValues } from "@/models/Category";

// Props untuk komponen form
interface SimpleCategoryFormProps {
  initialData?: Category;
  isEditing?: boolean;
}

export default function SimpleCategoryForm({ 
  initialData, 
  isEditing = false 
}: SimpleCategoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(initialData?.imageUrl || "");
  
  // State untuk form data
  const [formData, setFormData] = useState<CategoryFormValues>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    imageUrl: initialData?.imageUrl || "",
    isActive: initialData?.isActive ?? true,
  });

  // Handler untuk perubahan input form
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler untuk perubahan switch (isActive)
  const handleToggleActive = () => {
    setFormData((prev) => ({
      ...prev,
      isActive: !prev.isActive,
    }));
  };

  // Handler untuk tambah gambar (simulasi)
  const handleAddImage = () => {
    const newImage = `/placeholder.svg?height=300&width=300&text=Category`;
    setImageUrl(newImage);
    setFormData((prev) => ({
      ...prev,
      imageUrl: newImage,
    }));
  };

  // Handler untuk submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing && initialData?.id) {
        // Update kategori yang sudah ada
        await updateCategory(initialData.id, formData);
        toast.success("Kategori berhasil diperbarui");
      } else {
        // Buat kategori baru
        await createCategory(formData);
        toast.success("Kategori berhasil ditambahkan");
      }
      
      // Redirect ke halaman daftar kategori
      router.push("/admin/categories");
      router.refresh();
    } catch (error) {
      console.error("Error menyimpan kategori:", error);
      toast.error(`Gagal menyimpan kategori: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/categories">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Kembali</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditing ? "Edit Kategori" : "Tambah Kategori Baru"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Informasi Dasar */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kategori</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nama Kategori *
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Masukkan nama kategori"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Deskripsi
                </label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Masukkan deskripsi kategori"
                  value={formData.description || ""}
                  onChange={handleChange}
                  className="min-h-[120px]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <label htmlFor="isActive" className="text-sm font-medium">
                  Status Aktif
                </label>
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleToggleActive}
                  className="h-4 w-4"
                />
              </div>
            </CardContent>
          </Card>

          {/* Gambar */}
          <Card>
            <CardHeader>
              <CardTitle>Gambar Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {imageUrl ? (
                  <div className="relative h-[200px] rounded-md border">
                    <img
                      src={imageUrl}
                      alt="Category image"
                      className="h-full w-full rounded-md object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 h-6 w-6"
                      onClick={() => {
                        setImageUrl("");
                        setFormData(prev => ({ ...prev, imageUrl: "" }));
                      }}
                      type="button"
                    >
                      <span className="sr-only">Hapus gambar</span>
                      &times;
                    </Button>
                  </div>
                ) : (
                  <div
                    className="flex h-[200px] cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-4 text-center hover:bg-gray-50"
                    onClick={handleAddImage}
                  >
                    <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                    <p className="text-sm font-medium">Klik untuk tambah gambar</p>
                    <p className="text-xs text-muted-foreground">
                      SVG, PNG, JPG atau GIF
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/categories">Batal</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? isEditing
                ? "Menyimpan..."
                : "Menambahkan..."
              : isEditing
                ? "Simpan Perubahan"
                : "Tambah Kategori"
            }
          </Button>
        </div>
      </form>
    </div>
  );
}