"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";

// Catatan: Fungsi createProduct dan updateProduct perlu disediakan
// Fungsi ini harus dibuat di lib/products-db.ts
import { createProduct, updateProduct } from "@/lib/products-db";
import { Category } from "@/models/Category";

// Interface untuk data produk
interface ProductData {
  id?: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  sku?: string;
  stock: number;
  category: string;
  status: string;
  images: string[];
}

// Props untuk komponen form
interface SimpleProductFormProps {
  initialData?: ProductData;
  categories: Category[];
  isEditing?: boolean;
}

export default function SimpleProductForm({ 
  initialData, 
  categories,
  isEditing = false 
}: SimpleProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  
  // State untuk form data
  const [formData, setFormData] = useState<ProductData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    discountPrice: initialData?.discountPrice,
    sku: initialData?.sku || "",
    stock: initialData?.stock || 0,
    category: initialData?.category || "",
    status: initialData?.status || "active",
    images: initialData?.images || [],
  });

  // Handler untuk perubahan input form
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "discountPrice" || name === "stock" 
        ? Number(value) 
        : value,
    }));
  };

  // Handler untuk perubahan select
  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler untuk tambah gambar (simulasi)
  const handleAddImage = () => {
    const newImage = `/placeholder.svg?height=300&width=300&text=Product${images.length + 1}`;
    const newImages = [...images, newImage];
    setImages(newImages);
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  // Handler untuk hapus gambar
  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  // Handler untuk submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing && initialData?.id) {
        // Update produk yang sudah ada
        await updateProduct(initialData.id, formData);
        toast.success("Produk berhasil diperbarui");
      } else {
        // Buat produk baru
        await createProduct(formData);
        toast.success("Produk berhasil ditambahkan");
      }
      
      // Redirect ke halaman daftar produk
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Error menyimpan produk:", error);
      toast.error("Gagal menyimpan produk. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          {/* Informasi Dasar */}
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
                  />
                </div>
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
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
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
                    onValueChange={(value) => handleSelectChange(value, "status")}
                    required
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

          {/* Gambar */}
          <Card>
            <CardHeader>
              <CardTitle>Gambar Produk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-2">
                {images.map((image, index) => (
                  <div key={index} className="relative h-[150px] rounded-md border">
                    <img
                      src={image}
                      alt={`Product image ${index + 1}`}
                      className="h-full w-full rounded-md object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 h-6 w-6"
                      onClick={() => handleRemoveImage(index)}
                      type="button"
                    >
                      <span className="sr-only">Hapus gambar</span>
                      &times;
                    </Button>
                  </div>
                ))}

                {images.length < 5 && (
                  <div
                    className="flex h-[150px] cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-4 text-center hover:bg-gray-50"
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
            <Link href="/admin/products">Batal</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? isEditing
                ? "Menyimpan..."
                : "Menambahkan..."
              : isEditing
                ? "Simpan Perubahan"
                : "Tambah Produk"
            }
          </Button>
        </div>
      </form>
    </div>
  );
}