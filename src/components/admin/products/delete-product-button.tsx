// components/admin/delete-product-button.tsx - Updated with new structure
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Updated imports with new structure
import { ProductService } from "@/lib/database/services";

interface DeleteProductButtonProps {
  id: string;
  name: string;
  onSuccess?: () => void;
  variant?: "icon" | "button";
  size?: "default" | "sm" | "lg" | "icon";
}

export default function DeleteProductButton({
  id,
  name,
  onSuccess,
  variant = "icon",
  size = "icon"
}: DeleteProductButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!id) {
      toast.error("ID produk tidak valid");
      return;
    }

    startTransition(async () => {
      try {
        // Use new service layer for delete operation
        const success = await ProductService.deleteProduct(id);
        
        if (success) {
          toast.success("Produk berhasil dihapus");
          
          // If there's a success callback, call it
          if (typeof onSuccess === 'function') {
            onSuccess();
          } else {
            // Default behavior: refresh the page
            router.refresh();
          }
        } else {
          toast.error("Gagal menghapus produk. Produk tidak ditemukan.");
        }
        
        setOpen(false);
      } catch (error) {
        console.error("Gagal menghapus produk:", error);
        toast.error(`Gagal menghapus produk: ${(error as Error).message}`);
      }
    });
  };

  return (
    <>
      {variant === "icon" ? (
        <Button
          variant="outline"
          size={size}
          className="text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={() => setOpen(true)}
          disabled={isPending}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Hapus</span>
        </Button>
      ) : (
        <Button
          variant="destructive"
          size={size}
          onClick={() => setOpen(true)}
          disabled={isPending}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          <span>Hapus Produk</span>
        </Button>
      )}

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin ingin menghapus?</AlertDialogTitle>
            <AlertDialogDescription>
              Produk <span className="font-medium">{name}</span> akan dihapus secara permanen.
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isPending}
            >
              {isPending ? "Menghapus..." : "Hapus Produk"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}