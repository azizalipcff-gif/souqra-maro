"use client"

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Building2, 
  ShoppingBag, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  AlertCircle,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

// Mock data - will be replaced with Supabase data
const stats = {
  totalUsers: 12500,
  totalBusinesses: 5234,
  totalProducts: 25000,
  totalRevenue: 1250000,
  pendingBusinesses: 45,
  pendingProducts: 128,
  activeUsers: 3200,
  monthlyGrowth: 15,
}

const recentActivity = [
  { id: 1, type: 'business', message: 'New business registration: Casa Electronics', time: '5 min ago' },
  { id: 2, type: 'product', message: 'New product added: Wireless Headphones', time: '12 min ago' },
  { id: 3, type: 'user', message: 'New user registered: Ahmed M.', time: '25 min ago' },
  { id: 4, type: 'approval', message: 'Business approved: Riad Restaurant', time: '1 hour ago' },
  { id: 5, type: 'report', message: 'New report: Product #12345', time: '2 hours ago' },
]

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Admin Dashboard</h1>
          <p className="text-blue-100 text-lg">Manage your marketplace platform</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                <Users className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-green-600 flex items-center font-medium">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{stats.monthlyGrowth}% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Businesses</CardTitle>
                <Building2 className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalBusinesses.toLocaleString()}</div>
                <p className="text-xs text-gray-500 font-medium">
                  {stats.pendingBusinesses} pending approval
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Products</CardTitle>
                <ShoppingBag className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalProducts.toLocaleString()}</div>
                <p className="text-xs text-gray-500 font-medium">
                  {stats.pendingProducts} pending approval
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalRevenue.toLocaleString()} MAD</div>
                <p className="text-xs text-green-600 flex items-center font-medium">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Link href="/admin/business-approval">
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 rounded-xl">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Business Approvals</h3>
                      <p className="text-sm text-gray-600">{stats.pendingBusinesses} pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/product-approval">
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 rounded-xl">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Product Approvals</h3>
                      <p className="text-sm text-gray-600">{stats.pendingProducts} pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/categories">
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Categories</h3>
                      <p className="text-sm text-gray-600">Manage categories</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/reports">
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-xl">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Reports</h3>
                      <p className="text-sm text-gray-600">View reports</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Recent Activity */}
          <Card className="border border-gray-100">
            <CardHeader>
              <CardTitle className="text-xl">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      {activity.type === 'business' && <Building2 className="h-5 w-5 text-blue-600" />}
                      {activity.type === 'product' && <ShoppingBag className="h-5 w-5 text-blue-600" />}
                      {activity.type === 'user' && <Users className="h-5 w-5 text-blue-600" />}
                      {activity.type === 'approval' && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {activity.type === 'report' && <AlertCircle className="h-5 w-5 text-red-600" />}
                      <span className="text-gray-700 font-medium">{activity.message}</span>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* View Statistics Button */}
          <div className="mt-10 text-center">
            <Link href="/admin/statistics">
              <Button size="lg" className="hover:bg-blue-700 transition-colors font-semibold px-8">
                View Detailed Statistics
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
