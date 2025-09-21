// components/admin/categories/add-category-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface CategoryFormData {
  name: string;
  description?: string;
}

export default function AddCategoryForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    console.log('📝 Form field changed:', name, '=', value);
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }

    if (submitError) {
      setSubmitError("");
    }
  };

  const validateForm = (): boolean => {
    console.log('🔍 Validating form data:', formData);
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama kategori harus diisi";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Nama kategori maksimal 100 karakter";
    }

    if (formData.description && formData.description.trim().length > 500) {
      newErrors.description = "Deskripsi maksimal 500 karakter";
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    
    console.log('✅ Form validation result:', isValid ? 'VALID' : 'INVALID');
    if (!isValid) {
      console.log('❌ Validation errors:', newErrors);
    }
    
    return isValid;
  };

  // NEW: Create category using API route instead of service
  const createCategory = async (data: CategoryFormData) => {
    try {
      console.log('🔄 Creating category via API...');
      console.log('📤 Request data:', JSON.stringify(data, null, 2));

      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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
        throw new Error(result.error || result.message || 'Failed to create category');
      }

      console.log('✅ Category created successfully:', result.data?.id);
      return result.data;
    } catch (error) {
      console.error('❌ Create category error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 === FORM SUBMISSION STARTED ===');
    console.log('📤 Form data:', JSON.stringify(formData, null, 2));
    
    // Reset states
    setSubmitError("");
    setIsSuccess(false);
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      toast.error("Periksa kembali form Anda");
      return;
    }

    setIsLoading(true);

    try {
      const submissionData: CategoryFormData = {
        name: formData.name.trim(),
        description: formData.description?.trim() || ""
      };

      console.log('📤 Submission data:', JSON.stringify(submissionData, null, 2));

      // CHANGED: Use API route instead of CategoryService
      const result = await createCategory(submissionData);
      
      console.log('✅ Category created successfully:', result);
      console.log('🎉 === FORM SUBMISSION SUCCESSFUL ===');
      
      setIsSuccess(true);
      toast.success("Kategori berhasil ditambahkan!", {
        description: `Kategori "${result.name}" telah dibuat`
      });
      
      // Reset form
      setFormData({ name: "", description: "" });
      setErrors({});
      
      // Redirect after delay
      setTimeout(() => {
        console.log('🔄 Redirecting to categories list...');
        router.push("/admin/categories");
        router.refresh();
      }, 2000);
      
    } catch (error) {
      console.error("❌ === FORM SUBMISSION FAILED ===");
      console.error("Error details:", error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Terjadi kesalahan saat menambahkan kategori';
      
      console.log('📢 Setting error message:', errorMessage);
      setSubmitError(errorMessage);
      toast.error(errorMessage);
      
    } finally {
      setIsLoading(false);
      console.log('🏁 Form submission process completed');
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setErrors({});
    setSubmitError("");
    setIsSuccess(false);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/categories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Kategori
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isSuccess ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                Kategori Berhasil Ditambahkan
              </>
            ) : (
              "Informasi Kategori"
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Kategori Berhasil Ditambahkan!
              </h3>
              <p className="text-green-600 mb-4">
                Anda akan diarahkan ke halaman daftar kategori...
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={resetForm} variant="outline">
                  Tambah Kategori Lain
                </Button>
                <Button asChild>
                  <Link href="/admin/categories">Lihat Daftar Kategori</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-800">{submitError}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">
                  Nama Kategori <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Masukkan nama kategori"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "border-red-500" : ""}
                  disabled={isLoading}
                  autoComplete="off"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Masukkan deskripsi kategori (opsional)"
                  value={formData.description}
                  onChange={handleChange}
                  className={`min-h-[100px] ${errors.description ? "border-red-500" : ""}`}
                  disabled={isLoading}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Maksimal 500 karakter ({formData.description?.length || 0}/500)
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  disabled={isLoading}
                >
                  <Link href="/admin/categories">Batal</Link>
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Tambah Kategori"
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Debug Panel (development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Debug Info:</h4>
              <div className="text-xs space-y-2">
                <div>
                  <strong>Form Data:</strong>
                  <pre className="bg-white p-2 rounded mt-1 overflow-auto">
                    {JSON.stringify(formData, null, 2)}
                  </pre>
                </div>
                <div>
                  <strong>Errors:</strong>
                  <pre className="bg-white p-2 rounded mt-1 overflow-auto">
                    {JSON.stringify(errors, null, 2)}
                  </pre>
                </div>
                <div>
                  <strong>State:</strong>
                  <pre className="bg-white p-2 rounded mt-1 overflow-auto">
                    {JSON.stringify({ isLoading, isSuccess, submitError }, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}