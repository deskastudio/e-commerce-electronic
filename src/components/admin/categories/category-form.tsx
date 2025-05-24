// components/admin/category-form.tsx - Category Form Component
"use client";

import { useState, useRef, ChangeEvent, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, X, Loader2, Hash } from "lucide-react";
import { toast } from "sonner";

// Updated imports with new structure
import { 
  CategoryService,
  UploadService,
  ValidationService 
} from "@/lib/database/services";
import { 
  Category, 
  CategoryFormValues 
} from "@/types";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState<CategoryFormValues>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    imageUrl: initialData?.imageUrl || "",
    isActive: initialData?.isActive ?? true,
  });

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    initialData?.imageUrl || ""
  );
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  };

  // Handler for form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };
      
      // Auto-generate slug when name changes
      if (name === "name" && !isEditing) {
        updated.slug = generateSlug(value);
      }
      
      return updated;
    });
  };

  // Handler for switch changes
  const handleSwitchChange = (name: keyof CategoryFormValues, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Handler for image upload
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file using validation service
    const validationErrors = ValidationService.validateFileUpload(file, {
      maxSize: 2 * 1024 * 1024, // 2MB for category images
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    });

    if (!ValidationService.isValid(validationErrors)) {
      toast.error(ValidationService.formatErrors(validationErrors));
      return;
    }

    // Create preview URL
    const preview = URL.createObjectURL(file);
    
    setImageFile(file);
    setPreviewUrl(preview);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handler for removing image
  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl("");
    
    // Clear from form data
    setFormData((prev) => ({
      ...prev,
      imageUrl: "",
    }));
  };

  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(async () => {
      try {
        // Validate form data
        const validationErrors = ValidationService.validateCategory(formData);
        if (!ValidationService.isValid(validationErrors)) {
          const errorsByField = ValidationService.groupErrorsByField(validationErrors);
          
          // Show first error
          const firstError = validationErrors[0];
          toast.error(firstError.message);
          
          console.error('Validation errors:', errorsByField);
          return;
        }

        setUploadProgress(10);

        // Upload image if new file is selected
        let finalImageUrl = formData.imageUrl;

        if (imageFile) {
          setUploadProgress(30);
          
          try {
            finalImageUrl = await UploadService.uploadCategoryImage(imageFile);
            setUploadProgress(60);
          } catch (uploadError) {
            console.error('Upload error:', uploadError);
            toast.error(`Gagal mengunggah gambar: ${(uploadError as Error).message}`);
            return;
          }
        }

        setUploadProgress(80);

        // Prepare data for submission
        const submissionData: CategoryFormValues = {
          ...formData,
          imageUrl: finalImageUrl,
        };

        // Create or update category
        if (isEditing && initialData?.id) {
          await CategoryService.updateCategory(initialData.id, submissionData);
          toast.success("Kategori berhasil diperbarui");
        } else {
          await CategoryService.createCategory(submissionData);
          toast.success("Kategori berhasil ditambahkan");
        }
        
        setUploadProgress(100);
        
        // Redirect to categories list
        router.push("/admin/categories");
        router.refresh();
      } catch (error) {
        console.error("Error saving category:", error);
        toast.error(`Gagal menyimpan kategori: ${(error as Error).message}`);
      } finally {
        setUploadProgress(0);
      }
    });
  };

  const isSubmitting = isPending || uploadProgress > 0;

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
          {/* Basic Information */}
          <Card>
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
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug URL *</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="slug"
                    name="slug"
                    placeholder="url-friendly-slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="pl-10"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  URL yang ramah SEO untuk kategori ini. Otomatis dibuat dari nama.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Masukkan deskripsi kategori (opsional)"
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-[100px]"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="isActive">Kategori Aktif</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Kategori aktif akan ditampilkan di frontend dan bisa dipilih untuk produk.
              </p>
            </CardContent>
          </Card>

          {/* Category Image */}
          <Card>
            <CardHeader>
              <CardTitle>Gambar Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  id="imageUpload"
                  disabled={isSubmitting}
                />
                
                {previewUrl ? (
                  <div className="relative rounded-md border">
                    <img
                      src={previewUrl}
                      alt="Preview kategori"
                      className="h-[200px] w-full rounded-md object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8"
                      onClick={handleRemoveImage}
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Hapus gambar</span>
                    </Button>
                  </div>
                ) : (
                  <div
                    className="flex h-[200px] cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-4 text-center hover:bg-gray-50"
                    onClick={() => !isSubmitting && fileInputRef.current?.click()}
                  >
                    <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">Klik untuk tambah gambar kategori</p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, WebP atau GIF (maks 2MB)
                    </p>
                  </div>
                )}
                
                {/* Upload Progress */}
                {uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Mengunggah...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Actions */}
        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" asChild disabled={isSubmitting}>
            <Link href="/admin/categories">Batal</Link>
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
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