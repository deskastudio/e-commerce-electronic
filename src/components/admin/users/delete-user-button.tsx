"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteUser } from "@/lib/database/services/user-service";

interface DeleteUserButtonProps {
  id: string;
  name: string;
}

export default function DeleteUserButton({ id, name }: DeleteUserButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Apakah Anda yakin ingin menghapus pengguna "${name}"?`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const success = await deleteUser(id);
      if (success) {
        toast.success("Pengguna berhasil dihapus");
        router.refresh(); // Refresh data pada halaman
      } else {
        toast.error("Gagal menghapus pengguna");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(`Gagal menghapus pengguna: ${(error as Error).message}`);
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
