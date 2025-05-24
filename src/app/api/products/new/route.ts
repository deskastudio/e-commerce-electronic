import { NextRequest, NextResponse } from "next/server";
import { createProduct } from "@/lib/database/services/product-service";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validasi sederhana (optional)
    if (!data.name || !data.description || data.price <= 0) {
      return NextResponse.json({ error: "Data produk tidak valid" }, { status: 400 });
    }

    // Panggil fungsi service untuk buat produk
    const newProduct = await createProduct(data);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("API create product error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
