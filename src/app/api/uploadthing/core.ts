import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple file types and routes
export const ourFileRouter = {
  // Upload untuk gambar kategori
  categoryImage: f({ 
    image: { 
      maxFileSize: "5MB", 
      maxFileCount: 1 
    } 
  })
    .middleware(async (req) => {
      // Middleware autentikasi (sesuaikan dengan sistem auth Anda)
      return { /* bisa tambahkan data tambahan */ };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload kategori selesai", file);
      return { uploadedFile: file };
    }),

  // Tambahkan route baru untuk upload gambar produk
  productImage: f({ 
    image: { 
      maxFileSize: "5MB", 
      maxFileCount: 5 // Bisa upload hingga 5 gambar
    } 
  })
    .middleware(async (req) => {
      // Middleware autentikasi (sesuaikan dengan sistem auth Anda)
      return { /* bisa tambahkan data tambahan */ };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload produk selesai", file);
      return { uploadedFile: file };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;