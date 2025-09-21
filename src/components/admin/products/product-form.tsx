// components/admin/products/product-form.tsx - Minimal Product Form
"use client";

import { useState, useRef, ChangeEvent, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, X, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { Product, ProductFormValues, CategorySelectOption, ProductStatus, ProductCondition } from '@/types/product';

interface ProductFormProps {
  initialData?: Product;
  categories: CategorySelectOption[];
  isEditing?: boolean;
}

export default function ProductForm({ 
  initialData, 
  categories,
  isEditing = false 
}: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state - minimal fields only
  const [formData, setFormData] = useState<ProductFormValues>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    brand: initialData?.brand || "",
    model: initialData?.model || "",
    sku: initialData?.sku || "",
    condition: initialData?.condition || "new",
    warranty: initialData?.warranty || "",
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    category: initialData?.category || (categories[0]?.slug || ""),
    status: initialData?.status || "active",
    images: initialData?.images || [],
  });

  // Image state
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    initialData?.images?.filter(img => img && img !== "/placeholder.svg") || []
  );

  // Form errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Debug log for initial data
  useEffect(() => {
    console.log('🔄 ProductForm initialized');
    console.log('📥 Initial data received:', JSON.stringify(initialData, null, 2));
    console.log('📊 Form data state:', JSON.stringify(formData, null, 2));
    console.log('🏷️ Categories available:', categories.length);
    
    // Update form data when initialData changes (for edit mode)
    if (isEditing && initialData) {
      console.log('🔄 Updating form data for edit mode');
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        brand: initialData.brand || "",
        model: initialData.model || "",
        sku: initialData.sku || "",
        condition: initialData.condition || "new",
        warranty: initialData.warranty || "",
        price: initialData.price || 0,
        stock: initialData.stock || 0,
        category: initialData.category || (categories[0]?.slug || ""),
        status: initialData.status || "active",
        images: initialData.images || [],
      });
      
      // Update preview URLs for images
      const validImages = initialData.images?.filter(img => img && img !== "/placeholder.svg") || [];
      setPreviewUrls(validImages);
      console.log('🖼️ Updated preview URLs:', validImages);
    }
  }, [initialData, categories, isEditing]);

  // Format currency
  const formatRupiah = (value: number | string): string => {
    if (!value) return '';
    const number = typeof value === 'string' ? parseFloat(value.replace(/\D/g, '')) : value;
    if (isNaN(number)) return '';
    return number.toLocaleString('id-ID');
  };

  const parseRupiah = (value: string): number => {
    if (!value || value.trim() === '') return 0;
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue) return 0;
    const number = parseFloat(cleanValue);
    return isNaN(number) ? 0 : number;
  };

  // Generate SKU suggestion
  const generateSKU = () => {
    if (!formData.brand || !formData.model) {
      toast.error("Mohon isi Brand dan Model terlebih dahulu");
      return;
    }

    const brand = formData.brand.toUpperCase().replace(/\s+/g, '').substring(0, 3);
    const model = formData.model.toUpperCase().replace(/\s+/g, '').substring(0, 5);
    const timestamp = Date.now().toString().slice(-4);
    
    const sku = `${brand}${model}${timestamp}`;
    setFormData(prev => ({ ...prev, sku }));
    toast.success("SKU berhasil digenerate");
  };

  // Handle basic input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (formErrors[name]) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle currency changes
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (formErrors[name]) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
    
    const numericValue = parseRupiah(value);
    setFormData(prev => ({ ...prev, [name]: numericValue }));
  };

  // Handle number changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (formErrors[name]) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
    
    const numValue = value === "" ? 0 : parseInt(value) || 0;
    setFormData(prev => ({ ...prev, [name]: numValue }));
  };

  // Handle select changes
  const handleSelectChange = (value: string, name: keyof ProductFormValues) => {
    if (formErrors[name as string]) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated[name as string];
        return updated;
      });
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const invalidFiles = newFiles.filter(file => file.size > maxSize);
    
    if (invalidFiles.length > 0) {
      toast.error("Beberapa file terlalu besar (maksimal 5MB)");
      return;
    }

    if (previewUrls.length + newFiles.length > 5) {
      toast.error("Maksimal 5 gambar per produk");
      return;
    }

    if (formErrors.images) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated.images;
        return updated;
      });
    }

    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    setImageFiles(prev => [...prev, ...newFiles]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove image
  const handleRemoveImage = (indexToRemove: number) => {
    const newPreviewUrls = previewUrls.filter((_, index) => index !== indexToRemove);
    setPreviewUrls(newPreviewUrls);

    const existingImagesCount = initialData?.images?.filter(img => img && img !== "/placeholder.svg").length || 0;
    if (indexToRemove >= existingImagesCount) {
      const fileIndex = indexToRemove - existingImagesCount;
      const newImageFiles = imageFiles.filter((_, index) => index !== fileIndex);
      setImageFiles(newImageFiles);
    }
  };

  // Upload images (placeholder)
  const uploadImages = async (files: File[]): Promise<string[]> => {
    console.log('📤 Starting image upload for', files.length, 'files');
    
    const uploadedUrls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`📤 Uploading file ${i + 1}/${files.length}:`, file.name);
      
      try {
        // Create FormData for upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'products'); // Specify products folder
        formData.append('type', 'product'); // Specify type
        
        // Call our consistent upload API
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        const result = await response.json();
        
        if (!response.ok || !result.success) {
          console.error(`❌ Upload failed for ${file.name}:`, result.message);
          throw new Error(result.message || result.error || `Upload failed for ${file.name}`);
        }
        
        console.log(`✅ Upload successful for ${file.name}:`, result.data.url);
        uploadedUrls.push(result.data.url);
        
      } catch (error) {
        console.error(`❌ Upload error for ${file.name}:`, error);
        // Optionally continue with other files or throw
        throw new Error(`Failed to upload ${file.name}: ${(error as Error).message}`);
      }
    }
    
    console.log('✅ All uploads completed. URLs:', uploadedUrls);
    return uploadedUrls;
  };

  // Validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = "Nama produk harus diisi";
    if (!formData.description.trim()) errors.description = "Deskripsi harus diisi";
    if (!formData.brand.trim()) errors.brand = "Brand harus diisi";
    if (!formData.model.trim()) errors.model = "Model harus diisi";
    if (!formData.sku.trim()) errors.sku = "SKU harus diisi";
    if (!formData.category.trim()) errors.category = "Kategori harus dipilih";
    if (!formData.price || formData.price <= 0) errors.price = "Harga harus lebih dari 0";
    if (formData.stock < 0) errors.stock = "Stok tidak boleh negatif";
    if (previewUrls.length === 0) errors.images = "Minimal satu gambar produk";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // API calls
  const createProduct = async (data: ProductFormValues) => {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || result.error || 'Failed to create product');
    }
    return result.data;
  };

  const updateProduct = async (id: string, data: ProductFormValues) => {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || result.error || 'Failed to update product');
    }
    return result.data;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Form submission started');
    console.log('📊 Current form data before validation:', JSON.stringify(formData, null, 2));
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      console.log('❌ Form errors:', formErrors);
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }
    
    console.log('✅ Form validation passed');
    
    startTransition(async () => {
      try {
        let finalImageUrls: string[] = [];
        
        if (isEditing && initialData?.images) {
          finalImageUrls = initialData.images.filter(img => 
            img && img !== "/placeholder.svg" && !img.startsWith('blob:')
          );
          console.log('📷 Existing images:', finalImageUrls);
        }
        
        const existingPreviews = previewUrls.filter(url => 
          !url.startsWith('blob:') && url !== "/placeholder.svg"
        );
        finalImageUrls = [...finalImageUrls, ...existingPreviews];
        console.log('📷 Combined images after existing previews:', finalImageUrls);

        if (imageFiles.length > 0) {
          console.log('📤 Uploading new images:', imageFiles.length);
          const uploadedUrls = await uploadImages(imageFiles);
          finalImageUrls = [...finalImageUrls, ...uploadedUrls];
          console.log('📷 Combined images after upload:', finalImageUrls);
        }

        finalImageUrls = [...new Set(finalImageUrls)];
        if (finalImageUrls.length === 0) {
          finalImageUrls = ["/placeholder.svg"];
        }

        // Ensure all required fields are present and properly typed
        const submissionData: ProductFormValues = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          brand: formData.brand.trim(),
          model: formData.model.trim(),
          sku: formData.sku.trim().toUpperCase(),
          condition: formData.condition,
          warranty: formData.warranty?.trim() || "",
          price: Number(formData.price),
          stock: Number(formData.stock),
          category: formData.category.trim(),
          status: formData.status,
          images: finalImageUrls,
        };

        // Final validation before sending
        if (!submissionData.name || !submissionData.description || !submissionData.brand || 
            !submissionData.model || !submissionData.sku || !submissionData.category) {
          throw new Error('Missing required fields after preparation');
        }

        if (submissionData.price <= 0) {
          throw new Error('Price must be greater than 0');
        }

        if (submissionData.stock < 0) {
          throw new Error('Stock cannot be negative');
        }

        console.log('📤 Final submission data:', JSON.stringify(submissionData, null, 2));

        let response;
        if (isEditing && initialData?.id) {
          console.log('📝 Updating product with ID:', initialData.id);
          response = await updateProduct(initialData.id, submissionData);
          toast.success("Produk berhasil diperbarui");
        } else {
          console.log('➕ Creating new product');
          response = await createProduct(submissionData);
          toast.success("Produk berhasil ditambahkan");
        }
        
        console.log('✅ Product operation successful:', response);
        router.push("/admin/products");
        router.refresh();
      } catch (error) {
        console.error("❌ Error saving product:", error);
        console.error("❌ Error stack:", (error as Error).stack);
        toast.error(`Gagal menyimpan produk: ${(error as Error).message}`);
      }
    });
  };

  const getImageSrc = (url: string): string => {
    if (!url || url === "/placeholder.svg") {
      return "/api/placeholder/300/300?text=No+Image";
    }
    return url;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
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
                <Label htmlFor="name">Nama Produk <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Masukkan nama produk"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isPending}
                  className={formErrors.name ? 'border-red-500' : ''}
                />
                {formErrors.name && <p className="text-sm text-red-600">{formErrors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi <span className="text-red-500">*</span></Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Masukkan deskripsi produk"
                  value={formData.description}
                  onChange={handleChange}
                  className={`min-h-[120px] ${formErrors.description ? 'border-red-500' : ''}`}
                  required
                  disabled={isPending}
                />
                {formErrors.description && <p className="text-sm text-red-600">{formErrors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand <span className="text-red-500">*</span></Label>
                  <Input
                    id="brand"
                    name="brand"
                    placeholder="Samsung, Apple, Xiaomi..."
                    value={formData.brand}
                    onChange={handleChange}
                    required
                    disabled={isPending}
                    className={formErrors.brand ? 'border-red-500' : ''}
                  />
                  {formErrors.brand && <p className="text-sm text-red-600">{formErrors.brand}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model <span className="text-red-500">*</span></Label>
                  <Input
                    id="model"
                    name="model"
                    placeholder="Galaxy A54, iPhone 15..."
                    value={formData.model}
                    onChange={handleChange}
                    required
                    disabled={isPending}
                    className={formErrors.model ? 'border-red-500' : ''}
                  />
                  {formErrors.model && <p className="text-sm text-red-600">{formErrors.model}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="sku">SKU <span className="text-red-500">*</span></Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateSKU}
                    disabled={!formData.brand || !formData.model || isPending}
                  >
                    <Wand2 className="h-4 w-4 mr-1" />
                    Generate
                  </Button>
                </div>
                <Input
                  id="sku"
                  name="sku"
                  placeholder="SKU produk"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                  disabled={isPending}
                  className={formErrors.sku ? 'border-red-500' : ''}
                />
                {formErrors.sku && <p className="text-sm text-red-600">{formErrors.sku}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="condition">Kondisi <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => handleSelectChange(value as ProductCondition, "condition")}
                    required
                    disabled={isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kondisi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Baru</SelectItem>
                      <SelectItem value="refurbished">Refurbished</SelectItem>
                      <SelectItem value="used-like-new">Bekas Seperti Baru</SelectItem>
                      <SelectItem value="used-good">Bekas Kondisi Baik</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warranty">Garansi</Label>
                  <Input
                    id="warranty"
                    name="warranty"
                    placeholder="1 Tahun Resmi"
                    value={formData.warranty}
                    onChange={handleChange}
                    disabled={isPending}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Harga <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">Rp</span>
                    <Input
                      id="price"
                      name="price"
                      type="text"
                      placeholder="0"
                      value={formData.price ? formatRupiah(formData.price) : ""}
                      onChange={handleCurrencyChange}
                      required
                      disabled={isPending}
                      className={`pl-10 ${formErrors.price ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {formErrors.price && <p className="text-sm text-red-600">{formErrors.price}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stok <span className="text-red-500">*</span></Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    placeholder="0"
                    value={formData.stock}
                    onChange={handleNumberChange}
                    required
                    min="0"
                    disabled={isPending}
                    className={formErrors.stock ? 'border-red-500' : ''}
                  />
                  {formErrors.stock && <p className="text-sm text-red-600">{formErrors.stock}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange(value, "category")}
                    required
                    disabled={isPending}
                  >
                    <SelectTrigger className={formErrors.category ? 'border-red-500' : ''}>
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
                  {formErrors.category && <p className="text-sm text-red-600">{formErrors.category}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange(value as ProductStatus, "status")}
                    required
                    disabled={isPending}
                  >
                    <SelectTrigger>
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
              <CardTitle>Gambar Produk <span className="text-red-500">*</span></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={isPending}
                />
                
                {previewUrls.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative rounded-md border overflow-hidden">
                        <img
                          src={getImageSrc(url)}
                          alt={`Produk gambar ${index + 1}`}
                          className="h-[150px] w-full rounded-md object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/api/placeholder/300/300?text=Error+Loading";
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute right-2 top-2 h-6 w-6"
                          onClick={() => handleRemoveImage(index)}
                          disabled={isPending}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-md">
                    <p className="text-sm text-gray-500">Belum ada gambar yang diunggah.</p>
                  </div>
                )}

                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPending || previewUrls.length >= 5}
                  className="w-full"
                  variant="outline"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mengunggah...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Unggah Gambar {previewUrls.length > 0 && `(${previewUrls.length}/5)`}
                    </>
                  )}
                </Button>
                {formErrors.images && (
                  <p className="text-sm text-red-600">{formErrors.images}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : isEditing ? (
              "Perbarui Produk"
            ) : (
              "Tambah Produk"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}