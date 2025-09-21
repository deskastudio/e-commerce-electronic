// app/orders/[id]/page.tsx - FIXED VERSION
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  Clock, 
  Truck, 
  Package, 
  X, 
  Upload,
  Eye,
  CreditCard,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { Order, PaymentProof } from '@/types/checkout';
import { checkoutService } from '@/lib/database/services/checkout-service';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [paymentProof, setPaymentProof] = useState<PaymentProof | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // FIXED: Get session ID properly
  const [sessionId] = useState(() => {
    // First try to get from URL params (for redirects from checkout)
    const urlSessionId = searchParams.get('sessionId');
    if (urlSessionId) {
      return urlSessionId;
    }
    
    // Then try localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('guest-session-id') || '';
    }
    return '';
  });

  useEffect(() => {
    fetchOrder();
  }, [params.id, sessionId]);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const orderId = params.id as string;
      console.log('🔄 Fetching order:', orderId, sessionId ? `(sessionId: ${sessionId})` : '');

      // FIXED: Pass sessionId to getOrder for guest users
      const response = await checkoutService.getOrder(orderId, sessionId);

      if (response.success && response.data) {
        console.log('✅ Order fetched:', response.data);
        setOrder(response.data);
        
        // Check if there's payment proof
        if (response.data.paymentProof) {
          setPaymentProof(response.data.paymentProof);
        }
      } else {
        setError(response.error || 'Failed to load order');
      }
    } catch (error) {
      console.error('❌ Failed to fetch order:', error);
      setError('Failed to load order');
    } finally {
      setIsLoading(false);
    }
  };

  // FIXED: Enhanced payment proof upload handler
  const handlePaymentProofUpload = async (formData: FormData) => {
    if (!order) return;

    setIsUploading(true);
    try {
      const response = await checkoutService.uploadPaymentProof(order.id, formData);
      
      if (response.success) {
        console.log('✅ Payment proof uploaded successfully');
        setShowUploadForm(false);
        await fetchOrder(); // Refresh order data
        return { success: true };
      } else {
        console.error('❌ Payment proof upload failed:', response.error);
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('❌ Payment proof upload error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'processing':
        return <Package className="h-4 w-4 text-yellow-500" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-700';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <div className="mx-auto max-w-4xl px-4 py-8">
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading order details...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <div className="mx-auto max-w-4xl px-4 py-8">
            {/* Breadcrumb */}
            <nav className="mb-4 flex space-x-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <Link href="/orders" className="hover:text-foreground">Orders</Link>
              <span>/</span>
              <span className="text-foreground">Order Details</span>
            </nav>

            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                {error || 'Order not found'}
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <Button 
                onClick={() => router.push('/orders')} 
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Button>
              <Button 
                onClick={() => router.push('/')}
                variant="outline"
              >
                Go to Homepage
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-4 flex space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/orders" className="hover:text-foreground">Orders</Link>
            <span>/</span>
            <span className="text-foreground">Order #{order.orderNumber}</span>
          </nav>

          {/* Back Button */}
          <Button 
            variant="outline" 
            onClick={() => router.push('/orders')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>

          {/* Success Message for new orders */}
          {order.status === 'pending' && !paymentProof && (
            <Alert className="mb-6">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Order placed successfully!</strong> Please upload your payment proof to confirm your order.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    Order #{order.orderNumber}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Order Status:</span>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Payment Status:</span>
                    <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </Badge>
                  </div>
                  {order.trackingNumber && (
                    <div className="flex items-center justify-between">
                      <span>Tracking Number:</span>
                      <span className="font-mono text-sm">{order.trackingNumber}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.productName}</h4>
                          {item.variant && (
                            <p className="text-sm text-muted-foreground">
                              {item.variant.color && `Color: ${item.variant.color}`}
                              {item.variant.size && ` • Size: ${item.variant.size}`}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × {checkoutService.formatCurrency(item.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {checkoutService.formatCurrency(item.subtotal)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                    {order.shippingAddress.company && (
                      <p className="text-muted-foreground">{order.shippingAddress.company}</p>
                    )}
                    <p>{order.shippingAddress.streetAddress}</p>
                    {order.shippingAddress.apartment && (
                      <p>{order.shippingAddress.apartment}</p>
                    )}
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                    <div className="pt-2 space-y-1">
                      <p>
                        <span className="font-medium">Phone:</span> {order.shippingAddress.phone}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> {order.shippingAddress.email}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Notes */}
              {order.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Order Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{order.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary & Payment */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{checkoutService.formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>
                      {order.shippingCost === 0 
                        ? "Free" 
                        : checkoutService.formatCurrency(order.shippingCost)
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>{checkoutService.formatCurrency(order.tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>{checkoutService.formatCurrency(order.total)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="font-medium">Bank Transfer</p>
                    <div className="mt-2 text-sm">
                      <p><strong>Bank:</strong> BCA (Bank Central Asia)</p>
                      <p><strong>Account:</strong> 1234567890</p>
                      <p><strong>Name:</strong> Your Store Name</p>
                      <p><strong>Branch:</strong> Jakarta Pusat</p>
                    </div>
                  </div>

                  {/* Payment Proof Section */}
                  {order.paymentStatus === 'pending' && !paymentProof && (
                    <div className="space-y-3">
                      <Alert>
                        <AlertDescription>
                          Please upload your payment proof to confirm your order.
                        </AlertDescription>
                      </Alert>
                      <Button
                        onClick={() => setShowUploadForm(true)}
                        className="w-full"
                        variant="outline"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Payment Proof
                      </Button>
                    </div>
                  )}

                  {paymentProof && (
                    <div className="space-y-3">
                      <Alert>
                        <AlertDescription>
                          Payment proof uploaded. Status: {' '}
                          <Badge className={
                            paymentProof.status === 'approved' ? 'bg-green-100 text-green-700' :
                            paymentProof.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }>
                            {paymentProof.status.charAt(0).toUpperCase() + paymentProof.status.slice(1)}
                          </Badge>
                        </AlertDescription>
                      </Alert>
                      <div className="space-y-2 text-sm">
                        <p><strong>Transfer Amount:</strong> {checkoutService.formatCurrency(paymentProof.transferAmount)}</p>
                        <p><strong>Sender Name:</strong> {paymentProof.senderName}</p>
                        <p><strong>Transfer Date:</strong> {new Date(paymentProof.transferDate).toLocaleDateString()}</p>
                        {paymentProof.notes && (
                          <p><strong>Notes:</strong> {paymentProof.notes}</p>
                        )}
                        {paymentProof.rejectionReason && (
                          <div className="p-2 bg-red-50 border border-red-200 rounded">
                            <p className="text-red-700 text-sm">
                              <strong>Rejection Reason:</strong> {paymentProof.rejectionReason}
                            </p>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(paymentProof.fileUrl, '_blank')}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Proof
                      </Button>
                      {paymentProof.status === 'rejected' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowUploadForm(true)}
                          className="w-full"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload New Proof
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/')}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>

          {/* FIXED: Simple Payment Proof Upload Form */}
          {showUploadForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Upload Payment Proof</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const result = await handlePaymentProofUpload(formData);
                    if (!result.success) {
                      alert(result.error || 'Upload failed');
                    }
                  }} className="space-y-4">
                    
                    <div>
                      <label htmlFor="file" className="block text-sm font-medium mb-2">
                        Payment Receipt/Screenshot *
                      </label>
                      <input
                        type="file"
                        id="file"
                        name="file"
                        accept="image/*,.pdf"
                        required
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div>
                      <label htmlFor="bankAccount" className="block text-sm font-medium mb-2">
                        Bank Account Used *
                      </label>
                      <input
                        type="text"
                        id="bankAccount"
                        name="bankAccount"
                        required
                        placeholder="e.g. BCA 1234567890"
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div>
                      <label htmlFor="transferAmount" className="block text-sm font-medium mb-2">
                        Transfer Amount *
                      </label>
                      <input
                        type="number"
                        id="transferAmount"
                        name="transferAmount"
                        required
                        defaultValue={order?.total}
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div>
                      <label htmlFor="transferDate" className="block text-sm font-medium mb-2">
                        Transfer Date *
                      </label>
                      <input
                        type="date"
                        id="transferDate"
                        name="transferDate"
                        required
                        defaultValue={new Date().toISOString().split('T')[0]}
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div>
                      <label htmlFor="senderName" className="block text-sm font-medium mb-2">
                        Sender Name *
                      </label>
                      <input
                        type="text"
                        id="senderName"
                        name="senderName"
                        required
                        placeholder="Name on bank account"
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        placeholder="Optional notes about the transfer"
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={isUploading}
                        className="flex-1"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowUploadForm(false)}
                        disabled={isUploading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}