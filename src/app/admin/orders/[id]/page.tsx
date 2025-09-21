// src/app/admin/orders/[id]/page.tsx - Halaman detail order untuk admin
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, User, MapPin, CreditCard, FileText, Calendar } from "lucide-react";
import { OrderService } from "@/lib/database/services/order-service";
import OrderStatusUpdate from "@/components/admin/orders/order-status-update";

interface OrderDetailPageProps {
  params: { id: string };
}

export const metadata = {
  title: "Order Detail | Admin Dashboard",
  description: "Detail pesanan customer"
};

// Format currency to Indonesian Rupiah
const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Format date for display
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get status badge class
const getStatusBadgeClass = (status: string): string => {
  const statusClasses = {
    'delivered': 'bg-green-100 text-green-800 border-green-300',
    'processing': 'bg-blue-100 text-blue-800 border-blue-300',
    'shipped': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'pending': 'bg-gray-100 text-gray-800 border-gray-300',
    'confirmed': 'bg-purple-100 text-purple-800 border-purple-300',
    'cancelled': 'bg-red-100 text-red-800 border-red-300',
  };
  return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800 border-gray-300';
};

// Get payment status badge class
const getPaymentStatusBadgeClass = (status: string): string => {
  const statusClasses = {
    'paid': 'bg-green-100 text-green-800 border-green-300',
    'pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'failed': 'bg-red-100 text-red-800 border-red-300',
    'refunded': 'bg-orange-100 text-orange-800 border-orange-300',
  };
  return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800 border-gray-300';
};

export default async function AdminOrderDetail({ params }: OrderDetailPageProps) {
  try {
    console.log('🔄 Loading order detail page for ID:', params.id);
    
    const order = await OrderService.getOrderById(params.id);
    
    if (!order) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/admin/orders">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Order Not Found</h1>
          </div>
          
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Order Not Found</h3>
              <p className="text-muted-foreground mb-4">
                The order with ID "{params.id}" could not be found.
              </p>
              <Button asChild>
                <Link href="/admin/orders">
                  Back to Orders
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    console.log('✅ Order loaded:', order.orderNumber);
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Order {order.orderNumber}</h1>
            <p className="text-muted-foreground">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getStatusBadgeClass(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
            <Badge variant="outline" className={getPaymentStatusBadgeClass(order.paymentStatus)}>
              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Order Status Update */}
          <div className="md:col-span-2">
            <OrderStatusUpdate
              orderId={order.id}
              currentStatus={order.status}
              currentPaymentStatus={order.paymentStatus}
              currentTrackingNumber={order.trackingNumber}
              currentNotes={order.notes}
              customerName={order.customerName}
              orderNumber={order.orderNumber}
            />
          </div>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="font-medium">{order.customerEmail}</p>
              </div>
              {order.shippingAddress?.phone && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="font-medium">{order.shippingAddress.phone}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.shippingAddress ? (
                <div className="space-y-1">
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
                </div>
              ) : (
                <p className="text-muted-foreground">No shipping address provided</p>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items ({order.itemCount} items)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {item.image && (
                          <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                            <img 
                              src={item.image} 
                              alt={item.productName}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium">{item.productName}</h4>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity} × {formatRupiah(item.price)}
                          </p>
                          {item.variant && (
                            <p className="text-sm text-muted-foreground">
                              Variant: {JSON.stringify(item.variant)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatRupiah(item.subtotal)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">No items in this order</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatRupiah(order.total - (order.shippingAddress ? 15000 : 0))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{formatRupiah(15000)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>{formatRupiah(order.total)}</span>
                </div>
              </div>
              
              {order.paymentProof && (
                <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2">Payment Proof</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Bank Account:</strong> {order.paymentProof.bankAccount}</p>
                    <p><strong>Transfer Amount:</strong> {formatRupiah(order.paymentProof.transferAmount)}</p>
                    <p><strong>Sender:</strong> {order.paymentProof.senderName}</p>
                    <p><strong>Transfer Date:</strong> {formatDate(order.paymentProof.transferDate)}</p>
                    {order.paymentProof.notes && (
                      <p><strong>Notes:</strong> {order.paymentProof.notes}</p>
                    )}
                    {order.paymentProof.fileUrl && (
                      <div className="mt-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={order.paymentProof.fileUrl} target="_blank" rel="noopener noreferrer">
                            View Payment Proof
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Timeline & Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Order Date</p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(order.createdAt)}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(order.updatedAt)}
                </p>
              </div>

              {order.trackingNumber && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tracking Number</p>
                  <p className="font-mono font-medium">{order.trackingNumber}</p>
                </div>
              )}

              {order.notes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Notes</p>
                  <p className="text-sm bg-muted/30 p-3 rounded-md">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/admin/orders">
              Back to Orders
            </Link>
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline">
              Print Order
            </Button>
            <Button variant="outline">
              Send Email Update
            </Button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('❌ Error loading order detail page:', error);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Error Loading Order</h1>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Order</h3>
            <p className="text-muted-foreground mb-4">
              Failed to load order details: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
              <Button asChild>
                <Link href="/admin/orders">
                  Back to Orders
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}