// app/admin/dashboard/components/overview-cards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown
} from "lucide-react";

// Mock data - dalam implementasi nyata, ini akan dari API/database
const mockData = {
  totalRevenue: {
    value: 245600000,
    change: 12.5,
    period: "vs bulan lalu"
  },
  totalOrders: {
    value: 1234,
    change: 8.2,
    period: "vs bulan lalu"
  },
  totalCustomers: {
    value: 856,
    change: -2.1,
    period: "vs bulan lalu"
  },
  totalProducts: {
    value: 157,
    change: 4.3,
    period: "vs bulan lalu"
  }
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  period: string;
  icon: React.ElementType;
}

function MetricCard({ title, value, change, period, icon: Icon }: MetricCardProps) {
  const isPositive = change > 0;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          {isPositive ? (
            <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
          ) : (
            <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
          )}
          <span className={isPositive ? "text-green-500" : "text-red-500"}>
            {isPositive ? "+" : ""}{change}%
          </span>
          <span className="ml-1">{period}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OverviewCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Pendapatan"
        value={formatCurrency(mockData.totalRevenue.value)}
        change={mockData.totalRevenue.change}
        period={mockData.totalRevenue.period}
        icon={DollarSign}
      />
      
      <MetricCard
        title="Total Pesanan"
        value={formatNumber(mockData.totalOrders.value)}
        change={mockData.totalOrders.change}
        period={mockData.totalOrders.period}
        icon={ShoppingCart}
      />
      
      <MetricCard
        title="Total Pelanggan"
        value={formatNumber(mockData.totalCustomers.value)}
        change={mockData.totalCustomers.change}
        period={mockData.totalCustomers.period}
        icon={Users}
      />
      
      <MetricCard
        title="Total Produk"
        value={formatNumber(mockData.totalProducts.value)}
        change={mockData.totalProducts.change}
        period={mockData.totalProducts.period}
        icon={Package}
      />
    </div>
  );
}