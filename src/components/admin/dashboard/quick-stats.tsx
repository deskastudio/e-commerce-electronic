// app/admin/dashboard/components/quick-stats.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import {
  ShoppingCart,
  Users,
  Star,
  Package,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";

// Mock data untuk quick stats
const quickStatsData = {
  conversionRate: 3.2,
  avgOrderValue: 1750000,
  returnRate: 2.1,
  customerSatisfaction: 4.6,
  newCustomers: 145,
  returningCustomers: 89,
  pendingReviews: 23,
  lowStockItems: 8
};

const categoryData = [
  { name: "Smartphone", value: 45, color: "#2563eb" },
  { name: "Laptop", value: 25, color: "#7c3aed" },
  { name: "Tablet", value: 15, color: "#059669" },
  { name: "Audio", value: 10, color: "#dc2626" },
  { name: "Lainnya", value: 5, color: "#9ca3af" }
];

const dailyVisitors = [
  { day: "Sen", visitors: 1200 },
  { day: "Sel", visitors: 1100 },
  { day: "Rab", visitors: 1400 },
  { day: "Kam", visitors: 1350 },
  { day: "Jum", visitors: 1600 },
  { day: "Sab", visitors: 1800 },
  { day: "Min", visitors: 1500 }
];

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

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

function StatCard({ icon: Icon, title, value, description, trend, color = "text-muted-foreground" }: StatCardProps) {
  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg border bg-card">
      <div className={`p-2 rounded-lg bg-muted ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{value}</p>
        <p className="text-xs text-muted-foreground">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-1">
            <TrendingUp className={`w-3 h-3 mr-1 ${trend.isPositive ? 'text-green-500' : 'text-red-500 rotate-180'}`} />
            <span className={`text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function QuickStats() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Quick Stats</CardTitle>
        <p className="text-sm text-muted-foreground">
          Ringkasan metrics penting toko Anda
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="space-y-3">
          <StatCard
            icon={ShoppingCart}
            title="Conversion Rate"
            value={`${quickStatsData.conversionRate}%`}
            trend={{ value: 0.3, isPositive: true }}
            color="text-blue-600"
          />
          
          <StatCard
            icon={Package}
            title="Avg Order Value"
            value={formatCurrency(quickStatsData.avgOrderValue)}
            trend={{ value: 5.2, isPositive: true }}
            color="text-green-600"
          />
          
          <StatCard
            icon={Star}
            title="Customer Rating"
            value={`${quickStatsData.customerSatisfaction}/5.0`}
            description="Dari 127 ulasan"
            color="text-yellow-600"
          />
          
          <StatCard
            icon={Users}
            title="New Customers"
            value={formatNumber(quickStatsData.newCustomers)}
            description="Bulan ini"
            trend={{ value: 12.5, isPositive: true }}
            color="text-purple-600"
          />
        </div>

        {/* Category Distribution */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Distribusi Penjualan</h4>
          <div className="h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-md">
                          <p className="text-sm font-medium">{data.name}</p>
                          <p className="text-xs text-muted-foreground">{data.value}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {categoryData.slice(0, 4).map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-muted-foreground">{item.name}</span>
                <span className="text-xs font-medium ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Alerts</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">Stok Rendah</span>
              </div>
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                {quickStatsData.lowStockItems}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">Review Pending</span>
              </div>
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                {quickStatsData.pendingReviews}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800">Orders Processed</span>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">
                47
              </Badge>
            </div>
          </div>
        </div>

        {/* Weekly Visitors Trend */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Visitor Trend (7 hari)</h4>
          <div className="h-[100px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyVisitors}>
                <XAxis 
                  dataKey="day" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis hide />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-md">
                          <p className="text-sm font-medium">{label}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatNumber(payload[0].value as number)} visitors
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="visitors" 
                  fill="#2563eb" 
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}