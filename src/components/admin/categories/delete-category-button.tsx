"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteCategory } from "@/lib/categories-db";
import { useRouter } from "next/navigation";

interface DeleteCategoryButtonProps {
  id: string;
  name: string;
}

export default function DeleteCategoryButton({ id, name }: DeleteCategoryButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kategori "${name}"?`)) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteCategory(id);
      toast.success("Kategori berhasil dihapus");
      router.refresh();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(`Gagal menghapus kategori: ${(error as Error).message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="text-red-500 hover:bg-red-50 hover:text-red-600"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className="h-4 w-4" />
      <span className="sr-only">Hapus</span>
    </Button>
  );
}