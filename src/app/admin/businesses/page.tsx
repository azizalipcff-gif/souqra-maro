"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface Business {
  id: string
  title: string
  description: string
  category: string
  city: string
  price: number | null
  whatsapp: string
  image_url: string | null
  status: string
  created_at: string
  owner_id: string
}

export default function AdminBusinessesPage() {
  const supabase = createClient()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    action: 'approve' | 'reject' | 'delete'
    businessId: string
    businessTitle: string
  }>({ open: false, action: 'approve', businessId: '', businessTitle: '' })

  useEffect(() => {
    fetchBusinesses()
  }, [])

  const fetchBusinesses = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBusinesses(data || [])
    } catch (error) {
      console.error('Error fetching businesses:', error)
      toast.error('Failed to load businesses')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action: 'approve' | 'reject' | 'delete', businessId: string) => {
    setActionLoading(businessId)
    
    try {
      if (action === 'delete') {
        const { error } = await supabase
          .from('businesses')
          .delete()
          .eq('id', businessId)
        
        if (error) throw error
        toast.success('Business deleted successfully')
      } else {
        const status = action === 'approve' ? 'active' : 'rejected'
        const { error } = await supabase
          .from('businesses')
          .update({ status })
          .eq('id', businessId)
        
        if (error) throw error
        toast.success(`Business ${action}d successfully`)
      }
      
      await fetchBusinesses()
    } catch (error) {
      console.error(`Error ${action}ing business:`, error)
      toast.error(`Failed to ${action} business`)
    } finally {
      setActionLoading(null)
    }
  }

  const confirmAction = () => {
    handleAction(confirmDialog.action, confirmDialog.businessId)
    setConfirmDialog({ open: false, action: 'approve', businessId: '', businessTitle: '' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Businesses</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage business listings</p>
      </div>

      <div className="grid gap-4">
        {businesses.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              No businesses found
            </CardContent>
          </Card>
        ) : (
          businesses.map((business) => (
            <Card key={business.id}>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Image */}
                  {business.image_url ? (
                    <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={business.image_url}
                        alt={business.title}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {business.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {business.category} • {business.city}
                        </p>
                      </div>
                      <StatusBadge status={business.status} />
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {business.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {business.price && (
                        <span>Price: {business.price} MAD</span>
                      )}
                      {business.whatsapp && (
                        <span>WhatsApp: {business.whatsapp}</span>
                      )}
                      <span>Created: {new Date(business.created_at).toLocaleDateString()}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {business.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => setConfirmDialog({
                              open: true,
                              action: 'approve',
                              businessId: business.id,
                              businessTitle: business.title
                            })}
                            disabled={actionLoading === business.id}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setConfirmDialog({
                              open: true,
                              action: 'reject',
                              businessId: business.id,
                              businessTitle: business.title
                            })}
                            disabled={actionLoading === business.id}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setConfirmDialog({
                          open: true,
                          action: 'delete',
                          businessId: business.id,
                          businessTitle: business.title
                        })}
                        disabled={actionLoading === business.id}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        title={`${confirmDialog.action.charAt(0).toUpperCase() + confirmDialog.action.slice(1)} Business`}
        description={`Are you sure you want to ${confirmDialog.action} "${confirmDialog.businessTitle}"?`}
        onConfirm={confirmAction}
        confirmText={confirmDialog.action === 'delete' ? 'Delete' : confirmDialog.action === 'approve' ? 'Approve' : 'Reject'}
      />
    </div>
  )
}
