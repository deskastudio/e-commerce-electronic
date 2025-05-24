// components/admin/delete-category-button.tsx - Delete Category Button
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
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
import { CategoryService } from "@/lib/database/services";

interface DeleteCategoryButtonProps {
  id: string;
  name: string;
  productCount?: number;
  onSuccess?: () => void;
  variant?: "icon" | "button";
  size?: "default" | "sm" | "lg" | "icon";
}

export default function DeleteCategoryButton({
  id,
  name,
  productCount = 0,
  onSuccess,
  variant = "icon",
  size = "icon"
}: DeleteCategoryButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!id) {
      toast.error("ID kategori tidak valid");
      return;
    }

    startTransition(async () => {
      try {
        // Use new service layer for delete operation
        const success = await CategoryService.deleteCategory(id);
        
        if (success) {
          toast.success("Kategori berhasil dihapus");
          
          // If there's a success callback, call it
          if (typeof onSuccess === 'function') {
            onSuccess();
          } else {
            // Default behavior: refresh the page
            router.refresh();
          }
        } else {
          toast.error("Gagal menghapus kategori. Kategori tidak ditemukan.");
        }
        
        setOpen(false);
      } catch (error) {
        console.error("Gagal menghapus kategori:", error);
        toast.error(`Gagal menghapus kategori: ${(error as Error).message}`);
      }
    });
  };

  // Check if category can be deleted (no products)
  const canDelete = productCount === 0;

  return (
    <>
      {variant === "icon" ? (
        <Button
          variant="outline"
          size={size}
          className={canDelete 
            ? "text-red-500 hover:bg-red-50 hover:text-red-600" 
            : "text-gray-400 cursor-not-allowed"
          }
          onClick={() => canDelete && setOpen(true)}
          disabled={isPending || !canDelete}
          title={!canDelete ? `Tidak dapat menghapus kategori yang memiliki ${productCount} produk` : undefined}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Hapus</span>
        </Button>
      ) : (
        <Button
          variant="destructive"
          size={size}
          onClick={() => canDelete && setOpen(true)}
          disabled={isPending || !canDelete}
          className={`flex items-center gap-2 ${!canDelete ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Trash2 className="h-4 w-4" />
          <span>Hapus Kategori</span>
        </Button>
      )}

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Hapus Kategori?
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-2">
                <p>
                  Kategori <span className="font-medium">{name}</span> akan dihapus secara permanen.
                  Tindakan ini tidak dapat dibatalkan.
                </p>
                
                {productCount > 0 ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-amber-800">
                        <p className="font-medium">Peringatan:</p>
                        <p>
                          Kategori ini memiliki {productCount} produk. 
                          Hapus semua produk terlebih dahulu sebelum menghapus kategori.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <div className="flex items-start gap-2">
                      <div className="h-4 w-4 rounded-full bg-green-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-green-800">
                        <p>Kategori ini kosong dan aman untuk dihapus.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
              disabled={isPending || !canDelete}
            >
              {isPending ? "Menghapus..." : "Hapus Kategori"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}