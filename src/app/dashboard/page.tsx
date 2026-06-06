"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  TrendingUp, ShoppingBag, Package, Users, Star, DollarSign,
  ArrowUpRight, ArrowDownRight, Plus, Eye, Edit, Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layout/sidebar"
import { Avatar } from "@/components/ui/avatar"

export default function SellerDashboardPage() {
  const stats = [
    {
      title: "Total Sales",
      value: "45,230",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Orders",
      value: "234",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingBag,
    },
    {
      title: "Products",
      value: "45",
      change: "+3",
      trend: "up",
      icon: Package,
    },
    {
      title: "Rating",
      value: "4.8",
      change: "+0.2",
      trend: "up",
      icon: Star,
    },
  ]

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "Ahmed Benali",
      items: 2,
      total: 1200,
      status: "delivered",
      date: "2024-01-15",
    },
    {
      id: "ORD-002",
      customer: "Fatima Zahra",
      items: 1,
      total: 3500,
      status: "shipped",
      date: "2024-01-14",
    },
    {
      id: "ORD-003",
      customer: "Youssef Amrani",
      items: 3,
      total: 450,
      status: "processing",
      date: "2024-01-13",
    },
    {
      id: "ORD-004",
      customer: "Samira Bensaid",
      items: 1,
      total: 890,
      status: "pending",
      date: "2024-01-12",
    },
  ]

  const topProducts = [
    {
      id: 1,
      name: "Premium Leather Bag",
      sales: 45,
      revenue: 54000,
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100",
    },
    {
      id: 2,
      name: "Berber Rug",
      sales: 32,
      revenue: 112000,
      image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=100",
    },
    {
      id: 3,
      name: "Argan Oil Set",
      sales: 89,
      revenue: 40050,
      image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=100",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's your store overview.</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-royal-blue/10 rounded-lg">
                          <stat.icon className="h-6 w-6 text-royal-blue" />
                        </div>
                        <div className={`flex items-center text-sm ${
                          stat.trend === "up" ? "text-green-600" : "text-red-600"
                        }`}>
                          {stat.trend === "up" ? (
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 mr-1" />
                          )}
                          {stat.change}
                        </div>
                      </div>
                      <p className="text-2xl font-bold mb-1">{stat.value}</p>
                      <p className="text-gray-600">{stat.title}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-blue-50 rounded-lg">
                    <p className="text-gray-500">Sales chart placeholder</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Delivered</span>
                      <span className="font-semibold">156</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "65%" }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Shipped</span>
                      <span className="font-semibold">45</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "20%" }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Processing</span>
                      <span className="font-semibold">23</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "10%" }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Pending</span>
                      <span className="font-semibold">10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-500 h-2 rounded-full" style={{ width: "5%" }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Orders</CardTitle>
                  <Link href="/dashboard/orders">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Order ID</th>
                        <th className="text-left py-3 px-4">Customer</th>
                        <th className="text-left py-3 px-4">Items</th>
                        <th className="text-left py-3 px-4">Total</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{order.id}</td>
                          <td className="py-3 px-4">{order.customer}</td>
                          <td className="py-3 px-4">{order.items}</td>
                          <td className="py-3 px-4 font-semibold">{order.total} MAD</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                order.status === "delivered" ? "success" :
                                order.status === "shipped" ? "warning" :
                                order.status === "processing" ? "secondary" : "outline"
                              }
                            >
                              {order.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{order.date}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Top Products</CardTitle>
                  <Link href="/dashboard/products">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg hover:border-gold transition-colors">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.sales} sales</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-royal-blue">{product.revenue.toLocaleString()} MAD</p>
                        <p className="text-sm text-gray-500">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
