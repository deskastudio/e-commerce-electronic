// app/admin/dashboard/components/top-products.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Mock data untuk top products
const topProducts = [
  {
    id: "1",
    name: "iPhone 14 Pro Max",
    category: "Smartphone",
    image: "/api/placeholder/60/60",
    sold: 245,
    revenue: 612500000,
    change: 15.2,
    stock: 45,
    price: 25000000
  },
  {
    id: "2", 
    name: "MacBook Air M2",
    category: "Laptop",
    image: "/api/placeholder/60/60",
    sold: 156,
    revenue: 390000000,
    change: 8.7,
    stock: 23,
    price: 25000000
  },
  {
    id: "3",
    name: "Samsung Galaxy S24",
    category: "Smartphone", 
    image: "/api/placeholder/60/60",
    sold: 189,
    revenue: 283500000,
    change: -3.1,
    stock: 67,
    price: 15000000
  },
  {
    id: "4",
    name: "iPad Pro 12.9\"",
    category: "Tablet",
    image: "/api/placeholder/60/60", 
    sold: 134,
    revenue: 214400000,
    change: 12.3,
    stock: 34,
    price: 16000000
  },
  {
    id: "5",
    name: "Sony WH-1000XM5",
    category: "Audio",
    image: "/api/placeholder/60/60",
    sold: 298,
    revenue: 149000000,
    change: 22.8,
    stock: 89,
    price: 5000000
  }
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatCompactCurrency(amount: number): string {
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)}B`;
  }
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`;
  }
  return amount.toString();
}

function getStockStatus(stock: number) {
  if (stock <= 20) {
    return { label: "Stok Rendah", color: "text-red-500", bgColor: "bg-red-100" };
  }
  if (stock <= 50) {
    return { label: "Stok Sedang", color: "text-yellow-600", bgColor: "bg-yellow-100" };
  }
  return { label: "Stok Aman", color: "text-green-600", bgColor: "bg-green-100" };
}

export default function TopProducts() {
  const maxSold = Math.max(...topProducts.map(p => p.sold));
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Produk Terlaris</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Top 5 produk dengan penjualan tertinggi bulan ini
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/products">
              Lihat Semua
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => {
            const stockStatus = getStockStatus(product.stock);
            const progressValue = (product.sold / maxSold) * 100;
            const isPositive = product.change > 0;
            
            return (
              <div key={product.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                {/* Ranking */}
                <div className="flex-shrink-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-600 text-white' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                </div>

                {/* Product Image */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">IMG</span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <div className="flex items-center space-x-1">
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                      <span className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? '+' : ''}{product.change}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>{product.category}</span>
                    <span>{formatCurrency(product.price)}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <Progress value={progressValue} className="h-1.5" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {product.sold} terjual
                      </span>
                      <span className="font-medium">
                        {formatCompactCurrency(product.revenue)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stock Status */}
                <div className="flex-shrink-0">
                  <Badge variant="outline" className={`text-xs ${stockStatus.color} border-current`}>
                    {product.stock}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {topProducts.reduce((sum, product) => sum + product.sold, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Total Terjual</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {formatCompactCurrency(topProducts.reduce((sum, product) => sum + product.revenue, 0))}
              </p>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center mt-4">
            <Badge variant="outline" className="text-green-600 border-green-600">
              ↗ 11.2% vs bulan lalu
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}