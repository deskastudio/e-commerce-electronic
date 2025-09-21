// app/admin/dashboard/components/recent-orders.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye, ArrowUpRight } from "lucide-react";
import Link from "next/link";

// Mock data untuk recent orders
const recentOrders = [
  {
    id: "ORD-001",
    customer: {
      name: "Ahmad Rizki",
      email: "ahmad.rizki@email.com",
      avatar: "AR"
    },
    products: ["iPhone 14 Pro", "Airpods Pro"],
    total: 25000000,
    status: "completed",
    date: "2024-01-15T10:30:00Z",
    paymentStatus: "paid"
  },
  {
    id: "ORD-002",
    customer: {
      name: "Siti Nurhaliza",
      email: "siti.nur@email.com",
      avatar: "SN"
    },
    products: ["MacBook Air M2"],
    total: 18500000,
    status: "processing",
    date: "2024-01-15T09:15:00Z",
    paymentStatus: "paid"
  },
  {
    id: "ORD-003",
    customer: {
      name: "Budi Santoso",
      email: "budi.santoso@email.com",
      avatar: "BS"
    },
    products: ["Samsung Galaxy S24", "Galaxy Watch"],
    total: 15750000,
    status: "pending",
    date: "2024-01-15T08:45:00Z",
    paymentStatus: "pending"
  },
  {
    id: "ORD-004",
    customer: {
      name: "Maria Christina",
      email: "maria.christina@email.com",
      avatar: "MC"
    },
    products: ["iPad Pro 12.9\""],
    total: 16000000,
    status: "shipped",
    date: "2024-01-14T16:20:00Z",
    paymentStatus: "paid"
  },
  {
    id: "ORD-005",
    customer: {
      name: "Doni Prakoso",
      email: "doni.prakoso@email.com",
      avatar: "DP"
    },
    products: ["Sony WH-1000XM5", "iPad Air"],
    total: 12000000,
    status: "cancelled",
    date: "2024-01-14T14:10:00Z",
    paymentStatus: "refunded"
  }
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

function getStatusBadge(status: string) {
  const statusConfig = {
    completed: { label: "Selesai", variant: "default" as const, color: "bg-green-500" },
    processing: { label: "Proses", variant: "secondary" as const, color: "bg-blue-500" },
    pending: { label: "Pending", variant: "outline" as const, color: "bg-yellow-500" },
    shipped: { label: "Dikirim", variant: "secondary" as const, color: "bg-blue-500" },
    cancelled: { label: "Dibatal", variant: "destructive" as const, color: "bg-red-500" }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  
  return (
    <Badge variant={config.variant} className="text-xs">
      <div className={`w-2 h-2 rounded-full ${config.color} mr-1`}></div>
      {config.label}
    </Badge>
  );
}

function getPaymentStatusBadge(status: string) {
  const statusConfig = {
    paid: { label: "Lunas", variant: "default" as const },
    pending: { label: "Pending", variant: "outline" as const },
    refunded: { label: "Refund", variant: "secondary" as const }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  
  return (
    <Badge variant={config.variant} className="text-xs">
      {config.label}
    </Badge>
  );
}

export default function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Pesanan Terbaru</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              5 pesanan terakhir yang masuk
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/orders">
              Lihat Semua
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Produk</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {order.customer.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{order.customer.name}</p>
                      <p className="text-xs text-muted-foreground">{order.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{order.products[0]}</p>
                    {order.products.length > 1 && (
                      <p className="text-xs text-muted-foreground">
                        +{order.products.length - 1} produk lainnya
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">{formatCurrency(order.total)}</p>
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(order.status)}
                </TableCell>
                <TableCell>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(order.date)}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/orders/${order.id}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Summary */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Total 5 pesanan dengan nilai{" "}
            <span className="font-medium text-foreground">
              {formatCurrency(recentOrders.reduce((sum, order) => sum + order.total, 0))}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">2 selesai</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">2 proses</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">1 pending</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}