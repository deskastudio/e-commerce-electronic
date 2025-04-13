
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  sku?: string;
  stock: number;
  category: string;
  status: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

// Tipe data untuk form input produk (sesuai dengan SimpleProductForm)
export interface ProductFormValues {
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

// Fungsi bantuan untuk mengkonversi string tag menjadi array (untuk kompatibilitas)
export function parseTags(tagsString: string): string[] {
  if (!tagsString) return [];
  return tagsString.split(",").map(tag => tag.trim()).filter(Boolean);
}

// Fungsi bantuan untuk mengkonversi array tag menjadi string (untuk kompatibilitas)
export function formatTags(tags: string[]): string {
  if (!tags || !tags.length) return "";
  return tags.join(", ");
}