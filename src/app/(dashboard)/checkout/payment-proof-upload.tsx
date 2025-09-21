// components/checkout/payment-proof-upload.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Upload, 
  X, 
  FileImage, 
  File, 
  Loader2,
  CheckCircle 
} from 'lucide-react';
import { checkoutService } from '@/lib/database/services/checkout-service';

interface PaymentProofUploadProps {
  orderId: string;
  orderTotal: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PaymentProofUpload({
  orderId,
  orderTotal,
  onSuccess,
  onCancel
}: PaymentProofUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    bankAccount: 'BCA - 1234567890 - Your Store Name',
    transferAmount: orderTotal,
    transferDate: new Date().toISOString().split('T')[0],
    senderName: '',
    notes: ''
  });

  // Session ID for guest users
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('guest-session-id') || '';
    }
    return '';
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setErrors({ file: 'Only JPEG, PNG, and PDF files are allowed' });
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors({ file: 'File size must be less than 5MB' });
      return;
    }

    setSelectedFile(file);
    setErrors(prev => ({ ...prev, file: '' }));

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    const input = document.getElementById('file-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedFile) {
      newErrors.file = 'Please select a file';
    }

    if (!formData.senderName.trim()) {
      newErrors.senderName = 'Sender name is required';
    }

    if (!formData.transferAmount || formData.transferAmount <= 0) {
      newErrors.transferAmount = 'Transfer amount is required';
    }

    if (formData.transferAmount < orderTotal * 0.95) {
      newErrors.transferAmount = `Transfer amount should be at least ${checkoutService.formatCurrency(orderTotal * 0.95)}`;
    }

    if (!formData.transferDate) {
      newErrors.transferDate = 'Transfer date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const submitData = new FormData();
      submitData.append('file', selectedFile!);
      submitData.append('bankAccount', formData.bankAccount);
      submitData.append('transferAmount', formData.transferAmount.toString());
      submitData.append('transferDate', formData.transferDate);
      submitData.append('senderName', formData.senderName);
      submitData.append('notes', formData.notes);
      submitData.append('sessionId', sessionId);

      console.log('🔄 Uploading payment proof...');

      const response = await checkoutService.uploadPaymentProof(orderId, submitData);

      if (response.success) {
        console.log('✅ Payment proof uploaded successfully');
        onSuccess();
      } else {
        setErrors({ submit: response.error || 'Failed to upload payment proof' });
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      setErrors({ 
        submit: error instanceof Error ? error.message : 'An unexpected error occurred' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Payment Proof</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bank Account Info */}
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm font-medium">Transfer to:</p>
            <p className="text-sm">{formData.bankAccount}</p>
            <p className="text-sm font-medium mt-1">
              Amount: {checkoutService.formatCurrency(orderTotal)}
            </p>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">Payment Proof Image/PDF *</Label>
            {!selectedFile ? (
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Click to upload image or PDF
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Max file size: 5MB
                  </p>
                </label>
              </div>
            ) : (
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {selectedFile.type.startsWith('image/') ? (
                      <FileImage className="h-4 w-4" />
                    ) : (
                      <File className="h-4 w-4" />
                    )}
                    <span className="text-sm truncate">{selectedFile.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {previewUrl && (
                  <div className="mt-2">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-full h-32 object-contain rounded"
                    />
                  </div>
                )}
              </div>
            )}
            {errors.file && (
              <p className="text-sm text-red-500">{errors.file}</p>
            )}
          </div>

          {/* Sender Name */}
          <div className="space-y-2">
            <Label htmlFor="senderName">Sender Name *</Label>
            <Input
              id="senderName"
              type="text"
              placeholder="Name on the bank account"
              value={formData.senderName}
              onChange={(e) => handleInputChange('senderName', e.target.value)}
              className={errors.senderName ? 'border-red-500' : ''}
              required
            />
            {errors.senderName && (
              <p className="text-sm text-red-500">{errors.senderName}</p>
            )}
          </div>

          {/* Transfer Amount */}
          <div className="space-y-2">
            <Label htmlFor="transferAmount">Transfer Amount *</Label>
            <Input
              id="transferAmount"
              type="number"
              step="0.01"
              min="0"
              value={formData.transferAmount}
              onChange={(e) => handleInputChange('transferAmount', parseFloat(e.target.value))}
              className={errors.transferAmount ? 'border-red-500' : ''}
              required
            />
            {errors.transferAmount && (
              <p className="text-sm text-red-500">{errors.transferAmount}</p>
            )}
          </div>

          {/* Transfer Date */}
          <div className="space-y-2">
            <Label htmlFor="transferDate">Transfer Date *</Label>
            <Input
              id="transferDate"
              type="date"
              max={new Date().toISOString().split('T')[0]}
              value={formData.transferDate}
              onChange={(e) => handleInputChange('transferDate', e.target.value)}
              className={errors.transferDate ? 'border-red-500' : ''}
              required
            />
            {errors.transferDate && (
              <p className="text-sm text-red-500">{errors.transferDate}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information about the transfer"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          {/* Error Alert */}
          {errors.submit && (
            <Alert variant="destructive">
              <AlertDescription>
                {errors.submit}
              </AlertDescription>
            </Alert>
          )}

          {/* Info Alert */}
          <Alert>
            <AlertDescription className="text-sm">
              <strong>Important:</strong> Please ensure the transfer amount matches your order total. 
              Your payment will be verified by our team within 1-2 business days.
            </AlertDescription>
          </Alert>
        </form>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || !selectedFile}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Proof
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}