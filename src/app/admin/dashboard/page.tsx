// app/admin/dashboard/page.tsx
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import OverviewCards from "@/components/admin/dashboard/overview-cards";
import SalesChart from "@/components/admin/dashboard/sales-chart";
import RecentOrders from "@/components/admin/dashboard/recent-orders";
import TopProducts from "@/components/admin/dashboard/top-products";
import QuickStats from "@/components/admin/dashboard/quick-stats";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Overview Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-[60px] mb-1" />
              <Skeleton className="h-3 w-[120px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <Skeleton className="h-5 w-[120px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <Skeleton className="h-5 w-[100px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview analytics dan performa toko Anda
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Data terakhir update: {new Date().toLocaleDateString('id-ID')}
          </span>
        </div>
      </div>

      {/* Overview Cards */}
      <Suspense fallback={<DashboardSkeleton />}>
        <OverviewCards />
      </Suspense>

      {/* Charts and Analytics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Suspense fallback={<Skeleton className="h-[400px] col-span-4" />}>
          <SalesChart />
        </Suspense>
        
        <Suspense fallback={<Skeleton className="h-[400px] col-span-3" />}>
          <QuickStats />
        </Suspense>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Suspense fallback={<Skeleton className="h-[400px]" />}>
          <RecentOrders />
        </Suspense>
        
        <Suspense fallback={<Skeleton className="h-[400px]" />}>
          <TopProducts />
        </Suspense>
      </div>
    </div>
  );
}