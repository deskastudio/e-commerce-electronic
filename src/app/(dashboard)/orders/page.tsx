// app/orders/page.tsx - TANPA NEXTAUTH
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ShoppingBag, 
  Eye, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  X,
  Loader2,
  User
} from 'lucide-react';
import { Order } from '@/types/checkout';
import { checkoutService } from '@/lib/database/services/checkout-service';

export default function OrdersPage() {
  const router = useRouter();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Session ID for guest users
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('guest-session-id') || '';
    }
    return '';
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!sessionId) {
        setError('No session found. Please start shopping to create orders.');
        return;
      }

      console.log('🔄 Fetching orders for session:', sessionId);

      const response = await checkoutService.getCustomerOrders(undefined, sessionId);

      if (response.success && response.data) {
        console.log('✅ Orders fetched:', response.data.length, 'orders');
        setOrders(response.data);
      } else {
        setError(response.error || 'Failed to load orders');
      }
    } catch (error) {
      console.error('❌ Failed to fetch orders:', error);
      setError('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const response = await checkoutService.cancelOrder(orderId, 'Cancelled by customer');
      
      if (response.success) {
        // Refresh orders list
        fetchOrders();
      } else {
        alert(response.error || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('❌ Failed to cancel order:', error);
      alert('Failed to cancel order');
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
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading orders...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <nav className="mb-4 flex space-x-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <span>/</span>
              <span className="text-foreground">My Orders</span>
            </nav>
            <h1 className="text-3xl font-bold">Order History</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Guest Session</span>
              <span className="text-xs">•</span>
              <span className="text-xs">Session: {sessionId.slice(0, 8)}...</span>
            </div>
          </div>

          {/* Session Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Session Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Mode:</strong> Guest Shopping</p>
                <p><strong>Session ID:</strong> <code className="text-xs bg-gray-100 px-1 rounded">{sessionId}</code></p>
                <p className="text-muted-foreground">
                  Your orders are linked to this browser session. 
                  Clear browser data will remove access to these orders.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Error State */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Empty State */}
          {!error && orders.length === 0 && (
            <Card>
              <CardContent className="py-16 text-center">
                <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
                <h2 className="mt-4 text-xl font-semibold">No orders yet</h2>
                <p className="text-muted-foreground">
                  You haven't placed any orders in this session yet.
                </p>
                <div className="mt-4 space-y-2">
                  <Button 
                    onClick={() => router.push('/products')} 
                  >
                    Start Shopping
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Orders List */}
          {orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
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
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {checkoutService.formatCurrency(order.total)}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </Badge>
                          <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Customer Info */}
                      <div className="text-sm">
                        <span className="font-medium">Customer:</span> {order.customerName} ({order.customerEmail})
                      </div>

                      {/* Order Items Summary */}
                      <div>
                        <p className="text-sm font-medium mb-2">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}:
                        </p>
                        <div className="text-sm text-muted-foreground">
                          {order.items.slice(0, 2).map((item, index) => (
                            <span key={index}>
                              {item.productName} (x{item.quantity})
                              {index < Math.min(order.items.length, 2) - 1 && ', '}
                            </span>
                          ))}
                          {order.items.length > 2 && (
                            <span> and {order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}</span>
                          )}
                        </div>
                      </div>

                      {/* Tracking Information */}
                      {order.trackingNumber && (
                        <div>
                          <p className="text-sm font-medium">
                            Tracking Number: 
                            <span className="font-mono ml-1">{order.trackingNumber}</span>
                          </p>
                        </div>
                      )}

                      {/* Payment Proof Status */}
                      {order.paymentProof && (
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">Payment Proof:</span>
                            <Badge className={`ml-2 ${
                              order.paymentProof.status === 'approved' ? 'bg-green-100 text-green-700' :
                              order.paymentProof.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.paymentProof.status.charAt(0).toUpperCase() + order.paymentProof.status.slice(1)}
                            </Badge>
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/orders/${order.id}?sessionId=${sessionId}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                        
                        {order.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Cancel Order
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Continue Shopping */}
          {orders.length > 0 && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={() => router.push('/products')}
              >
                Continue Shopping
              </Button>
            </div>
          )}

          {/* Session Warning */}
          <Card className="mt-6">
            <CardContent className="p-4">
              <Alert>
                <AlertDescription className="text-sm">
                  <strong>Important:</strong> Your orders are stored in this browser session. 
                  If you clear your browser data or use a different device, you won't be able to access these orders. 
                  Consider creating an account for better order tracking.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}