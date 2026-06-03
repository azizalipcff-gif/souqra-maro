"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Users, Building2, Clock, CheckCircle, LayoutDashboard, List, AlertCircle } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getSupabase } from "@/lib/supabase/client"
import Link from "next/link"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBusinesses: 0,
    pendingBusinesses: 0,
    approvedBusinesses: 0
  })

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        router.push("/login")
        return
      }

      setIsAuthenticated(true)

      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (profile?.role !== 'admin') {
        router.push("/")
        return
      }

      setIsAdmin(true)
      await fetchStats()
    } catch (error) {
      console.error('Admin access check error:', error)
      router.push("/")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const supabase = getSupabase()

      // Fetch total users
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Fetch total businesses
      const { count: businessCount } = await supabase
        .from('businesses')
        .select('*', { count: 'exact', head: true })

      // Fetch pending businesses
      const { count: pendingCount } = await supabase
        .from('businesses')
        .select('*', { count: 'exact', head: true })
        .eq('approved', false)

      // Fetch approved businesses
      const { count: approvedCount } = await supabase
        .from('businesses')
        .select('*', { count: 'exact', head: true })
        .eq('approved', true)

      setStats({
        totalUsers: userCount || 0,
        totalBusinesses: businessCount || 0,
        pendingBusinesses: pendingCount || 0,
        approvedBusinesses: approvedCount || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-gray-600">Redirecting...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage SOUQORA platform</p>
          </div>

          {/* Navigation */}
          <div className="flex gap-4 mb-8">
            <Link href="/admin">
              <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/businesses">
              <Button variant="outline">
                <List className="h-4 w-4 mr-2" />
                Businesses
              </Button>
            </Link>
            <Link href="/admin/pending">
              <Button variant="outline">
                <AlertCircle className="h-4 w-4 mr-2" />
                Pending Approvals
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalUsers}</p>
                <p className="text-gray-600">Total Users</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalBusinesses}</p>
                <p className="text-gray-600">Total Businesses</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-100 hover:border-yellow-300 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stats.pendingBusinesses}</p>
                <p className="text-gray-600">Pending Businesses</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100 hover:border-green-300 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stats.approvedBusinesses}</p>
                <p className="text-gray-600">Approved Businesses</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/admin/pending">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                    <Clock className="h-5 w-5 mr-2" />
                    Review Pending Businesses
                  </Button>
                </Link>
                <Link href="/admin/businesses">
                  <Button variant="outline" className="w-full" size="lg">
                    <List className="h-5 w-5 mr-2" />
                    View All Businesses
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
