// components/admin/categories/category-form.tsx - Simplified Category Form
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { CategoryService } from "@/lib/database/services/category-service";
import { Category, CategoryFormValues } from "@/types";

interface CategoryFormProps {
  initialData?: Category;
  isEditing?: boolean;
}

export default function CategoryForm({ 
  initialData, 
  isEditing = false 
}: CategoryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form state
  const [formData, setFormData] = useState<CategoryFormValues>({
    name: initialData?.name || "",
    description: initialData?.description || "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Handler for form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Clear field errors when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(async () => {
      try {
        setFormErrors({});

        // Basic client-side validation
        const errors: Record<string, string> = {};
        
        if (!formData.name.trim()) {
          errors.name = "Nama kategori harus diisi";
        } else if (formData.name.trim().length > 100) {
          errors.name = "Nama kategori maksimal 100 karakter";
        }
        
        if (formData.description && formData.description.trim().length > 500) {
          errors.description = "Deskripsi kategori maksimal 500 karakter";
        }

        if (Object.keys(errors).length > 0) {
          setFormErrors(errors);
          toast.error("Periksa kembali form Anda");
          return;
        }

        // Prepare data for submission
        const submissionData: CategoryFormValues = {
          name: formData.name.trim(),
          description: formData.description?.trim() || "",
        };

        // Create or update category
        if (isEditing && initialData?.id) {
          await CategoryService.updateCategory(initialData.id, submissionData);
          toast.success("Kategori berhasil diperbarui");
        } else {
          await CategoryService.createCategory(submissionData);
          toast.success("Kategori berhasil ditambahkan");
        }
        
        // Redirect to categories list
        router.push("/admin/categories");
        router.refresh();
        
      } catch (error) {
        console.error("Error saving category:", error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Gagal menyimpan kategori';
        toast.error(errorMessage);
      }
    });
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
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Informasi Kategori</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Kategori *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Masukkan nama kategori"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isPending}
                className={formErrors.name ? 'border-red-500' : ''}
              />
              {formErrors.name && (
                <p className="text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Masukkan deskripsi kategori (opsional)"
                value={formData.description}
                onChange={handleChange}
                className={`min-h-[100px] ${formErrors.description ? 'border-red-500' : ''}`}
                disabled={isPending}
              />
              {formErrors.description && (
                <p className="text-sm text-red-600">{formErrors.description}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Maksimal 500 karakter
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" asChild disabled={isPending}>
            <Link href="/admin/categories">Batal</Link>
          </Button>
          <Button 
            type="submit" 
            disabled={isPending}
            className="min-w-[120px]"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Menyimpan..." : "Menambahkan..."}
              </>
            ) : (
              isEditing ? "Simpan Perubahan" : "Tambah Kategori"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}