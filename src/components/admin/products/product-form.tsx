// components/admin/product-form.tsx - Updated with new structure
"use client";

import { useState, useRef, ChangeEvent, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Updated imports with new structure
import { 
  ProductService, 
  UploadService, 
  ValidationService 
} from "@/lib/database/services";
import { 
  Product, 
  ProductFormValues, 
  CategorySelectOption,
  ProductStatus 
} from "@/types";

interface SimpleProductFormProps {
  initialData?: Product;
  categories: CategorySelectOption[];
  isEditing?: boolean;
}

export default function SimpleProductForm({ 
  initialData, 
  categories,
  isEditing = false 
}: SimpleProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState<ProductFormValues>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    discountPrice: initialData?.discountPrice || undefined,
    cost: initialData?.cost || undefined,
    sku: initialData?.sku || "",
    barcode: initialData?.barcode || "",
    stock: initialData?.stock || 0,
    category: initialData?.category || (categories[0]?.slug || ""),
    status: initialData?.status || "active",
    tags: initialData?.tags || [],
    images: initialData?.images || [],
    isPhysical: initialData?.isPhysical ?? true,
    isTaxable: initialData?.isTaxable ?? true,
    isShippingRequired: initialData?.isShippingRequired ?? true,
  });

  // File upload state
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    initialData?.images || []
  );
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Handler for form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" 
        ? (value === "" ? 0 : Number(value))
        : value,
    }));
  };

  // Handler for select changes
  const handleSelectChange = (value: string, name: keyof ProductFormValues) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for checkbox changes
  const handleCheckboxChange = (name: keyof ProductFormValues, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Handler for tags input
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString
      .split(",")
      .map(tag => tag.trim())
      .filter(Boolean);
    
    setFormData((prev) => ({
      ...prev,
      tags: tagsArray,
    }));
  };

  // Handler for image upload
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    
    // Validate files using validation service
    const validationErrors = ValidationService.validateMultipleFileUpload(newFiles, {
      maxFiles: 5,
      maxSize: 5 * 1024 * 1024, // 5MB
      maxTotalSize: 25 * 1024 * 1024 // 25MB total
    });

    if (!ValidationService.isValid(validationErrors)) {
      toast.error(ValidationService.formatErrors(validationErrors));
      return;
    }

    // Check total images limit
    const totalImages = previewUrls.length + newFiles.length;
    if (totalImages > 5) {
      toast.error("Maksimal 5 gambar per produk");
      return;
    }

    // Create preview URLs
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    
    setImageFiles(prev => [...prev, ...newFiles]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handler for removing images
  const handleRemoveImage = (indexToRemove: number) => {
    const newPreviewUrls = previewUrls.filter((_, index) => index !== indexToRemove);
    setPreviewUrls(newPreviewUrls);

    // Remove from imageFiles if it's a new file
    if (indexToRemove >= (initialData?.images?.length || 0)) {
      const fileIndex = indexToRemove - (initialData?.images?.length || 0);
      const newImageFiles = imageFiles.filter((_, index) => index !== fileIndex);
      setImageFiles(newImageFiles);
    }
  };

  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(async () => {
      try {
        // Validate form data
        const validationErrors = ValidationService.validateProduct(formData);
        if (!ValidationService.isValid(validationErrors)) {
          const errorsByField = ValidationService.groupErrorsByField(validationErrors);
          
          // Show first error
          const firstError = validationErrors[0];
          toast.error(firstError.message);
          
          console.error('Validation errors:', errorsByField);
          return;
        }

        setUploadProgress(10);

        // Upload new images if any
        let finalImageUrls = previewUrls.filter(url => 
          url.startsWith('http') || url.startsWith('/'));

        if (imageFiles.length > 0) {
          setUploadProgress(30);
          
          try {
            const uploadedUrls = await UploadService.uploadProductImages(imageFiles);
            finalImageUrls = [...finalImageUrls, ...uploadedUrls];
            setUploadProgress(60);
          } catch (uploadError) {
            console.error('Upload error:', uploadError);
            toast.error(`Gagal mengunggah gambar: ${(uploadError as Error).message}`);
            return;
          }
        }

        setUploadProgress(80);

        // Prepare data for submission
        const submissionData: ProductFormValues = {
          ...formData,
          images: finalImageUrls
        };

        // Create or update product
        if (isEditing && initialData?.id) {
          await ProductService.updateProduct(initialData.id, submissionData);
          toast.success("Produk berhasil diperbarui");
        } else {
          await ProductService.createProduct(submissionData);
          toast.success("Produk berhasil ditambahkan");
        }
        
        setUploadProgress(100);
        
        // Redirect to products list
        router.push("/admin/products");
        router.refresh();
      } catch (error) {
        console.error("Error saving product:", error);
        toast.error(`Gagal menyimpan produk: ${(error as Error).message}`);
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
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Kembali</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditing ? "Edit Produk" : "Tambah Produk Baru"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Produk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nama Produk *
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Masukkan nama produk"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Deskripsi *
                </label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Masukkan deskripsi produk"
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-[120px]"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="price" className="text-sm font-medium">
                    Harga *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      Rp
                    </span>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="0"
                      className="pl-7"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="1000"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="discountPrice" className="text-sm font-medium">
                    Harga Diskon
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      Rp
                    </span>
                    <Input
                      id="discountPrice"
                      name="discountPrice"
                      type="number"
                      placeholder="0"
                      className="pl-7"
                      value={formData.discountPrice || ""}
                      onChange={handleChange}
                      min="0"
                      step="1000"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="sku" className="text-sm font-medium">
                    SKU
                  </label>
                  <Input
                    id="sku"
                    name="sku"
                    placeholder="Stock Keeping Unit"
                    value={formData.sku}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="stock" className="text-sm font-medium">
                    Stok *
                  </label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    placeholder="0"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="tags" className="text-sm font-medium">
                  Tags (pisahkan dengan koma)
                </label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="gaming, elektronik, komputer"
                  value={formData.tags?.join(", ") || ""}
                  onChange={handleTagsChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Kategori *
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange(value, "category")}
                    required
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    Status *
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange(value as ProductStatus, "status")}
                    required
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Diarsipkan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle>Gambar Produk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/jpeg,image/png,image/gif,image/svg+xml,image/webp"
                  multiple
                  className="hidden"
                  id="imageUpload"
                  disabled={isSubmitting}
                />
                
                {previewUrls.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative rounded-md border">
                        <img
                          src={url}
                          alt={`Produk gambar ${index + 1}`}
                          className="h-[150px] w-full rounded-md object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute right-2 top-2 h-6 w-6"
                          onClick={() => handleRemoveImage(index)}
                          disabled={isSubmitting}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Hapus gambar</span>
                        </Button>
                      </div>
                    ))}
                    {previewUrls.length < 5 && (
                      <div
                        className="flex h-[150px] cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-4 text-center hover:bg-gray-50"
                        onClick={() => !isSubmitting && fileInputRef.current?.click()}
                      >
                        <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                        <p className="text-sm font-medium">Tambah Gambar</p>
                        <p className="text-xs text-muted-foreground">
                          Maks 5 gambar (5MB)
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="flex h-[200px] cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-4 text-center hover:bg-gray-50"
                    onClick={() => !isSubmitting && fileInputRef.current?.click()}
                  >
                    <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                    <p className="text-sm font-medium">Klik untuk tambah gambar produk</p>
                    <p className="text-xs text-muted-foreground">
                      SVG, PNG, JPG, WebP atau GIF (maks 5MB)
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
            <Link href="/admin/products">Batal</Link>
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || previewUrls.length === 0}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Menyimpan..." : "Menambahkan..."}
              </>
            ) : (
              isEditing ? "Simpan Perubahan" : "Tambah Produk"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}