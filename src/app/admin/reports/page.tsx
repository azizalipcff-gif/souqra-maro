"use client"

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Clock,
  ShoppingBag,
  Building2,
  User,
  Eye,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'

// Mock data - will be replaced with Supabase data
const reports = [
  {
    id: '1',
    type: 'product',
    targetId: '12345',
    targetName: 'Wireless Headphones Pro',
    reason: 'Fake product',
    description: 'The product images do not match the description. Suspected counterfeit.',
    reporter: 'Ahmed M.',
    status: 'pending',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    type: 'business',
    targetId: '67890',
    targetName: 'Tech Solutions Morocco',
    reason: 'Fraudulent business',
    description: 'Business claims to be verified but is not. Contact information is invalid.',
    reporter: 'Fatima Z.',
    status: 'investigating',
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    type: 'product',
    targetId: '54321',
    targetName: 'Vintage Camera',
    reason: 'Inappropriate content',
    description: 'Product description contains inappropriate language.',
    reporter: 'Youssef K.',
    status: 'resolved',
    createdAt: '2024-01-13',
  },
  {
    id: '4',
    type: 'user',
    targetId: '98765',
    targetName: 'user@example.com',
    reason: 'Spam account',
    description: 'User is posting spam messages and fake listings.',
    reporter: 'Sara B.',
    status: 'pending',
    createdAt: '2024-01-12',
  },
  {
    id: '5',
    type: 'product',
    targetId: '11111',
    targetName: 'Organic Argan Oil',
    reason: 'Misleading information',
    description: 'Product claims to be organic but has no certification.',
    reporter: 'Karim L.',
    status: 'dismissed',
    createdAt: '2024-01-11',
  },
]

export default function ReportsPage() {
  const handleView = (id: string) => {
    // TODO: Implement view details logic
    console.log('Viewing report:', id)
  }

  const handleResolve = (id: string) => {
    // TODO: Implement resolve logic with Supabase
    console.log('Resolving report:', id)
  }

  const handleDismiss = (id: string) => {
    // TODO: Implement dismiss logic with Supabase
    console.log('Dismissing report:', id)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>
      case 'investigating':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Investigating</Badge>
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Resolved</Badge>
      case 'dismissed':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Dismissed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <ShoppingBag className="h-5 w-5 text-blue-600" />
      case 'business':
        return <Building2 className="h-5 w-5 text-blue-600" />
      case 'user':
        return <User className="h-5 w-5 text-blue-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-blue-600" />
    }
  }

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
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Reports</h1>
          <p className="text-blue-100 text-lg">Manage user reports and platform violations</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <Card className="hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Reports</CardTitle>
                <AlertCircle className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">{reports.length}</div>
                <p className="text-xs text-gray-500 font-medium">All time</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
                <Clock className="h-5 w-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">{reports.filter(r => r.status === 'pending').length}</div>
                <p className="text-xs text-gray-500 font-medium">Awaiting action</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Resolved</CardTitle>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">{reports.filter(r => r.status === 'resolved').length}</div>
                <p className="text-xs text-gray-500 font-medium">This week</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Dismissed</CardTitle>
                <XCircle className="h-5 w-5 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">{reports.filter(r => r.status === 'dismissed').length}</div>
                <p className="text-xs text-gray-500 font-medium">This week</p>
              </CardContent>
            </Card>
          </div>

          {/* Reports List */}
          <Card className="border border-gray-100">
            <CardHeader>
              <CardTitle className="text-xl">All Reports ({reports.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(report.type)}
                        <div>
                          <h3 className="font-semibold text-gray-900 text-base">{report.targetName}</h3>
                          <p className="text-sm text-gray-500">
                            {report.type.charAt(0).toUpperCase() + report.type.slice(1)} • ID: {report.targetId}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(report.status)}
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="font-semibold text-red-600 text-sm">{report.reason}</span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{report.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="font-medium">Reported by {report.reporter}</span>
                      <span className="font-medium">{report.createdAt}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(report.id)}
                        className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      {report.status === 'pending' || report.status === 'investigating' ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleResolve(report.id)}
                            className="bg-green-600 hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Resolve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDismiss(report.id)}
                            className="hover:bg-red-50 hover:border-red-300 transition-colors"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Dismiss
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(report.id)}
                          className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          View Resolution
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {reports.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg font-medium">No reports</p>
                  <p className="text-gray-500 mt-2">Platform is clean!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
