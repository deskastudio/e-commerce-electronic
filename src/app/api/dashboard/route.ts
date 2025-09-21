// app/api/admin/dashboard/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/connection';
import CategoryModel from '@/lib/database/models/Category';

// Temporary mock models - replace with your actual models
const ProductModel = {
  countDocuments: async () => Math.floor(Math.random() * 100) + 50,
  find: async () => [
    { name: "iPhone 15 Pro", sales: 45, revenue: 67500000 },
    { name: "Samsung Galaxy S24", sales: 32, revenue: 48000000 },
    { name: "MacBook Air M3", sales: 28, revenue: 42000000 },
    { name: "AirPods Pro", sales: 67, revenue: 20100000 },
    { name: "iPad Air", sales: 23, revenue: 17250000 }
  ]
};

const OrderModel = {
  countDocuments: async () => Math.floor(Math.random() * 50) + 20,
  find: async () => [
    {
      id: "ORD-001",
      customerName: "Ahmad Wijaya",
      total: 2500000,
      status: "processing",
      createdAt: new Date().toISOString()
    },
    {
      id: "ORD-002", 
      customerName: "Siti Nurhaliza",
      total: 1750000,
      status: "shipped",
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: "ORD-003",
      customerName: "Budi Santoso", 
      total: 3200000,
      status: "delivered",
      createdAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: "ORD-004",
      customerName: "Rina Melati",
      total: 950000,
      status: "pending",
      createdAt: new Date(Date.now() - 259200000).toISOString()
    },
    {
      id: "ORD-005",
      customerName: "Dedi Kurniawan",
      total: 4100000,
      status: "processing",
      createdAt: new Date(Date.now() - 345600000).toISOString()
    }
  ]
};

const CustomerModel = {
  countDocuments: async () => Math.floor(Math.random() * 200) + 100
};

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export async function GET() {
  try {
    console.log('🔄 GET /api/admin/dashboard - Starting...');
    
    await connectDB();
    console.log('✅ Database connected');

    // Fetch all stats in parallel
    const [
      totalCategories,
      totalProducts, 
      totalOrders,
      totalCustomers,
      recentOrdersData,
      topProductsData
    ] = await Promise.all([
      CategoryModel.countDocuments(),
      ProductModel.countDocuments(),
      OrderModel.countDocuments(), 
      CustomerModel.countDocuments(),
      OrderModel.find().then(orders => orders.slice(0, 5)), // Get latest 5 orders
      ProductModel.find().then(products => products.slice(0, 5)) // Get top 5 products
    ]);

    // Calculate total revenue from recent orders (mock calculation)
    const totalRevenue = recentOrdersData.reduce((sum, order) => sum + order.total, 0) * 4; // Mock multiplier

    const dashboardData = {
      totalProducts,
      totalCategories,
      totalOrders,
      totalCustomers,
      totalRevenue,
      recentOrders: recentOrdersData.map(order => ({
        id: order.id,
        customerName: order.customerName,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt
      })),
      topProducts: topProductsData.map((product, index) => ({
        id: `prod-${index + 1}`,
        name: product.name,
        sales: product.sales,
        revenue: product.revenue
      }))
    };

    console.log('📊 Dashboard stats compiled:', {
      totalProducts,
      totalCategories,
      totalOrders,
      totalCustomers,
      totalRevenue,
      recentOrdersCount: recentOrdersData.length,
      topProductsCount: topProductsData.length
    });

    const response: ApiResponse = {
      success: true,
      data: dashboardData,
      message: 'Dashboard data retrieved successfully'
    };

    console.log('✅ GET /api/admin/dashboard - Success');
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('❌ GET /api/admin/dashboard error:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Failed to retrieve dashboard data',
      message: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(response, { status: 500 });
  }
}