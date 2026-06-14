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
  ArrowLeft,
  Calendar,
  Download
} from 'lucide-react'
import Link from 'next/link'

// Mock data - will be replaced with Supabase data
const monthlyStats = [
  { month: 'Jan', users: 8500, businesses: 3200, products: 18000, revenue: 850000 },
  { month: 'Feb', users: 9200, businesses: 3500, products: 19500, revenue: 920000 },
  { month: 'Mar', users: 9800, businesses: 3800, products: 21000, revenue: 980000 },
  { month: 'Apr', users: 10500, businesses: 4100, products: 22500, revenue: 1050000 },
  { month: 'May', users: 11500, businesses: 4600, products: 23500, revenue: 1150000 },
  { month: 'Jun', users: 12500, businesses: 5234, products: 25000, revenue: 1250000 },
]

const categoryStats = [
  { category: 'Technology', count: 4500, growth: 18 },
  { category: 'Restaurants', count: 3200, growth: 12 },
  { category: 'Shopping', count: 5800, growth: 22 },
  { category: 'Health', count: 2100, growth: 8 },
  { category: 'Services', count: 3400, growth: 15 },
  { category: 'Education', count: 1800, growth: 10 },
]

const cityStats = [
  { city: 'Casablanca', count: 2800, growth: 20 },
  { city: 'Marrakech', count: 1900, growth: 15 },
  { city: 'Rabat', count: 1500, growth: 12 },
  { city: 'Fes', count: 1200, growth: 18 },
  { city: 'Tangier', count: 900, growth: 10 },
  { city: 'Agadir', count: 800, growth: 14 },
]

export default function StatisticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin">
              <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Statistics</h1>
          <p className="text-blue-100 text-lg">Detailed analytics and performance metrics</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Export Button */}
          <div className="flex justify-end mb-8">
            <Button variant="outline" className="hover:bg-blue-50 hover:border-blue-300 transition-colors">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>

          {/* Monthly Growth */}
          <Card className="mb-10 border border-gray-100">
            <CardHeader>
              <CardTitle className="text-xl">Monthly Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Month</th>
                      <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">Users</th>
                      <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">Businesses</th>
                      <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">Products</th>
                      <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">Revenue (MAD)</th>
                      <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyStats.map((stat, index) => (
                      <tr key={stat.month} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 font-medium text-gray-900">{stat.month}</td>
                        <td className="text-right py-4 px-4 text-gray-700">{stat.users.toLocaleString()}</td>
                        <td className="text-right py-4 px-4 text-gray-700">{stat.businesses.toLocaleString()}</td>
                        <td className="text-right py-4 px-4 text-gray-700">{stat.products.toLocaleString()}</td>
                        <td className="text-right py-4 px-4 text-gray-700">{stat.revenue.toLocaleString()}</td>
                        <td className="text-right py-4 px-4">
                          <span className="text-green-600 flex items-center justify-end gap-1 font-medium">
                            <TrendingUp className="h-4 w-4" />
                            {index > 0 ? Math.round(((stat.users - monthlyStats[index - 1].users) / monthlyStats[index - 1].users) * 100) : 0}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Category Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            <Card className="border border-gray-100">
              <CardHeader>
                <CardTitle className="text-xl">Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryStats.map((stat) => (
                    <div key={stat.category} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        <span className="font-medium text-gray-900">{stat.category}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-700 font-medium">{stat.count.toLocaleString()}</span>
                        <span className="text-green-600 flex items-center gap-1 text-sm font-medium">
                          <TrendingUp className="h-3 w-3" />
                          {stat.growth}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-100">
              <CardHeader>
                <CardTitle className="text-xl">Top Cities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cityStats.map((stat) => (
                    <div key={stat.city} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        <span className="font-medium text-gray-900">{stat.city}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-700 font-medium">{stat.count.toLocaleString()}</span>
                        <span className="text-green-600 flex items-center gap-1 text-sm font-medium">
                          <TrendingUp className="h-3 w-3" />
                          {stat.growth}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                <Users className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">12,500</div>
                <p className="text-xs text-green-600 flex items-center font-medium">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Businesses</CardTitle>
                <Building2 className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">5,234</div>
                <p className="text-xs text-green-600 flex items-center font-medium">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +18% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
                <ShoppingBag className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">25,000</div>
                <p className="text-xs text-green-600 flex items-center font-medium">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
