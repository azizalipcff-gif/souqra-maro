"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Users, ShoppingBag, Package, TrendingUp, AlertTriangle,
  CheckCircle, Clock, DollarSign, ArrowUpRight, Eye, Edit, Trash2, Ban, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layout/sidebar"
import { Avatar } from "@/components/ui/avatar"
import { getSupabase } from "@/lib/supabase/client"

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([])
  const [stats, setStats] = useState([
    {
      title: "Total Users",
      value: "0",
      change: "+15.3%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Total Sellers",
      value: "0",
      change: "+8.7%",
      trend: "up",
      icon: ShoppingBag,
    },
    {
      title: "Total Products",
      value: "0",
      change: "+12.1%",
      trend: "up",
      icon: Package,
    },
    {
      title: "Revenue",
      value: "0",
      change: "+23.5%",
      trend: "up",
      icon: DollarSign,
    },
  ])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch pending businesses
      const { data: businesses } = await getSupabase()
        .from('businesses')
        .select('*')
        .eq('approved', false)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5)

      if (businesses) {
        setPendingApprovals(businesses.map((b: any) => ({
          id: b.id,
          type: 'business',
          name: b.name,
          email: b.email,
          city: b.city,
          submitted: new Date(b.created_at).toLocaleDateString(),
        })))
      }

      // Fetch stats (mock for now, would be real queries in production)
      setStats([
        {
          title: "Total Users",
          value: "12,456",
          change: "+15.3%",
          trend: "up",
          icon: Users,
        },
        {
          title: "Total Sellers",
          value: "1,234",
          change: "+8.7%",
          trend: "up",
          icon: ShoppingBag,
        },
        {
          title: "Total Products",
          value: "45,678",
          change: "+12.1%",
          trend: "up",
          icon: Package,
        },
        {
          title: "Revenue",
          value: "2.3M",
          change: "+23.5%",
          trend: "up",
          icon: DollarSign,
        },
      ])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const { error } = await getSupabase()
        .from('businesses')
        .update({ approved: true, status: 'active' })
        .eq('id', id)

      if (error) throw error

      // Refresh data
      fetchDashboardData()
    } catch (error) {
      console.error('Error approving business:', error)
    }
  }

  const handleReject = async (id: string) => {
    try {
      const { error } = await getSupabase()
        .from('businesses')
        .update({ status: 'rejected' })
        .eq('id', id)

      if (error) throw error

      // Refresh data
      fetchDashboardData()
    } catch (error) {
      console.error('Error rejecting business:', error)
    }
  }

  const recentReports = [
    {
      id: 1,
      type: "product",
      title: "Fake Designer Bag",
      reporter: "User123",
      status: "pending",
      date: "2024-01-15",
    },
    {
      id: 2,
      type: "seller",
      title: "Suspicious Activity",
      reporter: "System",
      status: "investigating",
      date: "2024-01-14",
    },
    {
      id: 3,
      type: "service",
      title: "Fraudulent Service",
      reporter: "User456",
      status: "pending",
      date: "2024-01-13",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      action: "New seller registered",
      user: "TechFix Morocco",
      time: "5 minutes ago",
    },
    {
      id: 2,
      action: "Product approved",
      user: "Admin",
      time: "15 minutes ago",
    },
    {
      id: 3,
      action: "Report resolved",
      user: "Admin",
      time: "1 hour ago",
    },
    {
      id: 4,
      action: "Payment received",
      user: "System",
      time: "2 hours ago",
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-royal-blue" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <div className="flex">
        <Sidebar userRole="admin" />
        
        <div className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">Platform overview and management</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Reports (3)
                </Button>
                <Button>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approvals (3)
                </Button>
              </div>
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
                          <ArrowUpRight className="h-4 w-4 mr-1" />
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

            {/* Pending Approvals */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Pending Approvals</CardTitle>
                  <Link href="/admin/approvals">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApprovals.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:border-gold transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          {item.type === "business" ? (
                            <ShoppingBag className="h-5 w-5 text-royal-blue" />
                          ) : item.type === "seller" ? (
                            <Users className="h-5 w-5 text-royal-blue" />
                          ) : (
                            <Package className="h-5 w-5 text-royal-blue" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold">{item.name}</h4>
                          {item.type === "business" ? (
                            <p className="text-sm text-gray-600">{item.email} • {item.city}</p>
                          ) : (
                            <p className="text-sm text-gray-600">{item.email}</p>
                          )}
                          <p className="text-xs text-gray-500">Submitted {item.submitted}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                        <Button size="sm" onClick={() => handleApprove(item.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleReject(item.id)}>
                          <Ban className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Recent Reports */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Recent Reports</CardTitle>
                    <Link href="/admin/reports">
                      <Button variant="outline" size="sm">View All</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentReports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{report.type}</Badge>
                            <h4 className="font-semibold">{report.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600">by {report.reporter} • {report.date}</p>
                        </div>
                        <Badge
                          variant={
                            report.status === "pending" ? "warning" :
                            report.status === "investigating" ? "secondary" : "success"
                          }
                        >
                          {report.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 rounded-full">
                          <Clock className="h-4 w-4 text-royal-blue" />
                        </div>
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.user} • {activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Platform Health */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Server Status</span>
                      <Badge variant="success">Online</Badge>
                    </div>
                    <p className="text-sm text-gray-600">All systems operational</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Database</span>
                      <Badge variant="success">Healthy</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Response time: 45ms</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Storage</span>
                      <Badge variant="warning">78%</Badge>
                    </div>
                    <p className="text-sm text-gray-600">780GB / 1TB used</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
