// app/admin/orders/page.tsx - Server Component (like Products)
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Eye, Search, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Import server-side service
import { OrderService, OrderSearchParams } from "@/lib/database/services/order-service";

interface OrdersPageProps {
  searchParams: OrderSearchParams;
}

export const metadata = {
  title: "Orders | Admin Dashboard",
  description: "Kelola semua pesanan"
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
    month: 'short',
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

// Build URL with preserved params
const buildUrl = (newParams: Record<string, string>, searchParams: OrderSearchParams): string => {
  const params = new URLSearchParams();
  
  // Preserve existing params
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value && key !== 'page') {
      params.set(key, value);
    }
  });
  
  // Add new params
  Object.entries(newParams).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });
  
  return `/admin/orders?${params.toString()}`;
};

// Search component (client-side)
function OrderSearch({ currentQuery }: { currentQuery?: string }) {
  return (
    <form method="GET" className="flex w-full max-w-sm items-center space-x-2">
      <Input 
        type="search" 
        name="query"
        placeholder="Search by order number, customer name, or email..." 
        className="w-full"
        defaultValue={currentQuery || ''}
      />
      <Button type="submit" size="icon">
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
}

// Filter component (client-side)
function OrderFilter({ currentStatus, currentPaymentStatus }: { 
  currentStatus?: string; 
  currentPaymentStatus?: string; 
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">Filter by:</span>
      
      <form method="GET" className="flex gap-2">
        <Select name="status" defaultValue={currentStatus || 'all'}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Order Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select name="paymentStatus" defaultValue={currentPaymentStatus || 'all'}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
        
        <Button type="submit" variant="outline" size="sm">
          Apply
        </Button>
      </form>
    </div>
  );
}

export default async function AdminOrders({ searchParams }: OrdersPageProps) {
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  
  try {
    console.log('🔄 Loading orders page...');
    console.log('📥 Search params:', searchParams);
    
    // Get orders server-side (like products)
    const result = await OrderService.getOrdersPaginated(page, limit, searchParams);
    const { orders, total, totalPages } = result;
    
    console.log('✅ Orders loaded:', orders.length, 'of', total);
    
    // Check if any filters are active
    const hasActiveFilters = Object.entries(searchParams).some(([key, value]) => 
      value && key !== 'page' && key !== 'limit' && 
      !(key === 'status' && value === 'all') && 
      !(key === 'paymentStatus' && value === 'all')
    );
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground">
              Kelola semua pesanan
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/orders">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <OrderSearch currentQuery={searchParams.query} />
          <OrderFilter 
            currentStatus={searchParams.status} 
            currentPaymentStatus={searchParams.paymentStatus} 
          />
        </div>

        {/* Orders Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    <div className="text-center">
                      <p className="text-lg font-medium text-muted-foreground">No orders found</p>
                      <p className="text-sm text-muted-foreground">
                        {hasActiveFilters 
                          ? 'Try adjusting your search criteria or filters.'
                          : 'Orders will appear here once customers start placing them.'
                        }
                      </p>
                      {!hasActiveFilters && (
                        <Button variant="outline" asChild className="mt-4">
                          <Link href="/admin/products">Manage Products</Link>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium font-mono text-sm">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      {order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatRupiah(order.total)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusBadgeClass(order.status)}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getPaymentStatusBadgeClass(order.paymentStatus)}
                      >
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/admin/orders/${order.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View Order Details</span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Statistics */}
        {orders.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === 'delivered').length}
              </div>
              <div className="text-sm text-muted-foreground">Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {orders.filter(o => o.paymentStatus === 'paid').length}
              </div>
              <div className="text-sm text-muted-foreground">Paid</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {orders.filter(o => o.paymentStatus === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Payment Pending</div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Menampilkan <strong>{(page - 1) * limit + 1}-{Math.min(page * limit, total)}</strong> dari{" "}
              <strong>{total}</strong> orders
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                disabled={page === 1}
                asChild={page !== 1}
              >
                {page !== 1 ? (
                  <Link href={buildUrl({ page: (page - 1).toString() }, searchParams)}>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous page</span>
                  </Link>
                ) : (
                  <span>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous page</span>
                  </span>
                )}
              </Button>

              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                const pageNumber = page <= 3 ? i + 1 : page - 2 + i;
                if (pageNumber > totalPages) return null;
                
                return (
                  <Button 
                    key={pageNumber} 
                    variant={page === pageNumber ? "default" : "outline"} 
                    size="sm" 
                    className="h-8 w-8"
                    asChild={page !== pageNumber}
                  >
                    {page !== pageNumber ? (
                      <Link href={buildUrl({ page: pageNumber.toString() }, searchParams)}>
                        {pageNumber}
                      </Link>
                    ) : (
                      <span>{pageNumber}</span>
                    )}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="icon"
                disabled={page === totalPages}
                asChild={page !== totalPages}
              >
                {page !== totalPages ? (
                  <Link href={buildUrl({ page: (page + 1).toString() }, searchParams)}>
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next page</span>
                  </Link>
                ) : (
                  <span>
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next page</span>
                  </span>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-md text-xs">
            <details>
              <summary className="cursor-pointer font-medium">Debug Info (Development Only)</summary>
              <pre className="mt-2 whitespace-pre-wrap">
                {JSON.stringify({
                  ordersCount: orders.length,
                  total,
                  page,
                  totalPages,
                  searchParams,
                  hasActiveFilters
                }, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('❌ Error loading orders page:', error);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground">
              Kelola semua pesanan
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/orders">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Link>
          </Button>
        </div>
        
        <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">
              Gagal memuat data orders
            </p>
            <p className="text-sm text-red-600 mb-4">
              Error: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Coba Lagi
            </Button>
          </div>
        </div>
      </div>
    );
  }
}