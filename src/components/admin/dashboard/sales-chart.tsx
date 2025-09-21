// app/admin/dashboard/components/sales-chart.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from "recharts";
import { useState } from "react";

// Mock data untuk chart
const salesData = [
  { name: "Jan", penjualan: 18000000, pesanan: 145, target: 20000000 },
  { name: "Feb", penjualan: 22000000, pesanan: 182, target: 20000000 },
  { name: "Mar", penjualan: 19500000, pesanan: 156, target: 20000000 },
  { name: "Apr", penjualan: 26000000, pesanan: 203, target: 25000000 },
  { name: "May", penjualan: 31000000, pesanan: 241, target: 25000000 },
  { name: "Jun", penjualan: 28500000, pesanan: 218, target: 25000000 },
  { name: "Jul", penjualan: 35000000, pesanan: 267, target: 30000000 },
  { name: "Agu", penjualan: 32500000, pesanan: 251, target: 30000000 },
  { name: "Sep", penjualan: 38000000, pesanan: 289, target: 30000000 },
  { name: "Okt", penjualan: 41000000, pesanan: 312, target: 35000000 },
  { name: "Nov", penjualan: 39500000, pesanan: 298, target: 35000000 },
  { name: "Des", penjualan: 43000000, pesanan: 324, target: 35000000 },
];

const recentWeeksData = [
  { name: "Minggu 1", penjualan: 8500000, pesanan: 67 },
  { name: "Minggu 2", penjualan: 9200000, pesanan: 74 },
  { name: "Minggu 3", penjualan: 11000000, pesanan: 89 },
  { name: "Minggu 4", penjualan: 10300000, pesanan: 82 },
  { name: "Minggu 5", penjualan: 12100000, pesanan: 95 },
  { name: "Minggu 6", penjualan: 13500000, pesanan: 108 },
  { name: "Minggu 7", penjualan: 14200000, pesanan: 113 },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactCurrency(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

export default function SalesChart() {
  const [chartType, setChartType] = useState<'yearly' | 'weekly'>('yearly');
  const [viewType, setViewType] = useState<'line' | 'bar'>('line');
  
  const currentData = chartType === 'yearly' ? salesData : recentWeeksData;
  
  return (
    <Card className="col-span-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Analytics Penjualan</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Performa penjualan {chartType === 'yearly' ? 'bulanan' : 'mingguan'} toko Anda
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex rounded-lg border p-1">
              <Button
                variant={chartType === 'yearly' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('yearly')}
                className="h-7 px-2"
              >
                Bulanan
              </Button>
              <Button
                variant={chartType === 'weekly' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('weekly')}
                className="h-7 px-2"
              >
                Mingguan
              </Button>
            </div>
            <div className="flex rounded-lg border p-1">
              <Button
                variant={viewType === 'line' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewType('line')}
                className="h-7 px-2"
              >
                Line
              </Button>
              <Button
                variant={viewType === 'bar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewType('bar')}
                className="h-7 px-2"
              >
                Bar
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {viewType === 'line' ? (
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatCompactCurrency}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-3 shadow-md">
                          <p className="font-medium">{label}</p>
                          {payload.map((entry, index) => (
                            <p key={index} className="text-sm" style={{ color: entry.color }}>
                              {entry.name}: {
                                entry.dataKey === 'penjualan' || entry.dataKey === 'target' 
                                  ? formatCurrency(entry.value as number)
                                  : entry.value
                              }
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="penjualan" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  name="Penjualan"
                  dot={{ fill: '#2563eb' }}
                />
                {chartType === 'yearly' && (
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#64748b" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Target"
                    dot={{ fill: '#64748b' }}
                  />
                )}
              </LineChart>
            ) : (
              <BarChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatCompactCurrency}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-3 shadow-md">
                          <p className="font-medium">{label}</p>
                          {payload.map((entry, index) => (
                            <p key={index} className="text-sm" style={{ color: entry.color }}>
                              {entry.name}: {
                                entry.dataKey === 'penjualan' || entry.dataKey === 'target' 
                                  ? formatCurrency(entry.value as number)
                                  : entry.value
                              }
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="penjualan" 
                  fill="#2563eb" 
                  name="Penjualan"
                  radius={[2, 2, 0, 0]}
                />
                {chartType === 'yearly' && (
                  <Bar 
                    dataKey="target" 
                    fill="#64748b" 
                    name="Target"
                    radius={[2, 2, 0, 0]}
                  />
                )}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        
        {/* Summary Stats */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Periode Ini</p>
              <p className="text-lg font-semibold">
                {formatCurrency(currentData.reduce((sum, item) => sum + item.penjualan, 0))}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rata-rata</p>
              <p className="text-lg font-semibold">
                {formatCurrency(currentData.reduce((sum, item) => sum + item.penjualan, 0) / currentData.length)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-green-600 border-green-600">
              ↗ 12.5% vs periode sebelumnya
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}