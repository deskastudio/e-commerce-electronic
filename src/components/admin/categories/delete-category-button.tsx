// components/admin/categories/delete-category-button.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteCategoryButtonProps {
  categoryId: string;
  categoryName: string;
  productCount?: number;
  onSuccess?: () => void;
  variant?: "icon" | "button";
  size?: "default" | "sm" | "lg" | "icon";
}

export default function DeleteCategoryButton({
  categoryId,
  categoryName,
  productCount = 0,
  onSuccess,
  variant = "icon",
  size = "icon"
}: DeleteCategoryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const deleteCategory = async () => {
    try {
      console.log('🔄 Deleting category...');
      console.log('📤 Category ID:', categoryId);

      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      console.log('📡 Response status:', response.status, response.statusText);

      const responseText = await response.text();
      console.log('📥 Raw response:', responseText);

      if (!response.ok) {
        console.error('❌ Response not OK:', response.status);
        
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        } catch (parseError) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const result = JSON.parse(responseText);
      console.log('📥 Parsed response:', result);

      if (!result.success) {
        throw new Error(result.error || result.message || 'Failed to delete category');
      }

      console.log('✅ Category deleted successfully');
      return result;
    } catch (error) {
      console.error('❌ Delete category error:', error);
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!categoryId) {
      toast.error("ID kategori tidak valid");
      return;
    }

    setIsLoading(true);

    try {
      console.log('🚀 === DELETE CATEGORY STARTED ===');
      console.log('📤 Deleting category:', categoryName, '(ID:', categoryId, ')');

      await deleteCategory();
      
      console.log('✅ Category deleted successfully');
      console.log('🎉 === DELETE CATEGORY SUCCESSFUL ===');
      
      toast.success("Kategori berhasil dihapus!", {
        description: `Kategori "${categoryName}" telah dihapus`
      });
      
      setIsOpen(false);
      
      // Call success callback or refresh page
      if (typeof onSuccess === 'function') {
        onSuccess();
      } else {
        router.refresh();
      }
      
    } catch (error) {
      console.error("❌ === DELETE CATEGORY FAILED ===");
      console.error("Error details:", error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Terjadi kesalahan saat menghapus kategori';
      
      console.log('📢 Showing error message:', errorMessage);
      toast.error(errorMessage);
      
    } finally {
      setIsLoading(false);
      console.log('🏁 Delete category process completed');
    }
  };

  // Check if category can be deleted
  const canDelete = productCount === 0;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {variant === "icon" ? (
          <Button
            variant="outline"
            size={size}
            className={canDelete 
              ? "text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200" 
              : "text-gray-400 cursor-not-allowed"
            }
            disabled={!canDelete || isLoading}
            title={!canDelete ? `Tidak dapat menghapus kategori yang memiliki ${productCount} produk` : `Hapus kategori "${categoryName}"`}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Hapus kategori {categoryName}</span>
          </Button>
        ) : (
          <Button
            variant="destructive"
            size={size}
            disabled={!canDelete || isLoading}
            className={`flex items-center gap-2 ${!canDelete ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Trash2 className="h-4 w-4" />
            <span>Hapus Kategori</span>
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Hapus Kategori?
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Kategori <span className="font-medium">"{categoryName}"</span> akan dihapus secara permanen.
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
          <AlertDialogCancel disabled={isLoading}>
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isLoading || !canDelete}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus Kategori
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}