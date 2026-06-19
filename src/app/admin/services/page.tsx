"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, XCircle, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface Service {
  id: string
  title: string
  description: string
  category: string
  city: string
  price_range: string
  whatsapp: string
  image_url: string | null
  status: string
  created_at: string
  owner_id: string
}

export default function AdminServicesPage() {
  const supabase = createClient()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    action: 'approve' | 'reject' | 'delete'
    serviceId: string
    serviceTitle: string
  }>({ open: false, action: 'approve', serviceId: '', serviceTitle: '' })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setServices(data || [])
    } catch (error) {
      console.error('Error fetching services:', error)
      toast.error('Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action: 'approve' | 'reject' | 'delete', serviceId: string) => {
    setActionLoading(serviceId)
    
    try {
      if (action === 'delete') {
        const { error } = await supabase
          .from('services')
          .delete()
          .eq('id', serviceId)
        
        if (error) throw error
        toast.success('Service deleted successfully')
      } else {
        const status = action === 'approve' ? 'active' : 'rejected'
        const { error } = await supabase
          .from('services')
          .update({ status })
          .eq('id', serviceId)
        
        if (error) throw error
        toast.success(`Service ${action}d successfully`)
      }
      
      await fetchServices()
    } catch (error) {
      console.error(`Error ${action}ing service:`, error)
      toast.error(`Failed to ${action} service`)
    } finally {
      setActionLoading(null)
    }
  }

  const confirmAction = () => {
    handleAction(confirmDialog.action, confirmDialog.serviceId)
    setConfirmDialog({ open: false, action: 'approve', serviceId: '', serviceTitle: '' })
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Services</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage service listings</p>
      </div>

      <div className="grid gap-4">
        {services.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              No services found
            </CardContent>
          </Card>
        ) : (
          services.map((service) => (
            <Card key={service.id}>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Image */}
                  {service.image_url ? (
                    <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={service.image_url}
                        alt={service.title}
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
                          {service.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {service.category} • {service.city}
                        </p>
                      </div>
                      <StatusBadge status={service.status} />
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {service.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {service.price_range && (
                        <span>Price: {service.price_range}</span>
                      )}
                      {service.whatsapp && (
                        <span>WhatsApp: {service.whatsapp}</span>
                      )}
                      <span>Created: {new Date(service.created_at).toLocaleDateString()}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {service.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => setConfirmDialog({
                              open: true,
                              action: 'approve',
                              serviceId: service.id,
                              serviceTitle: service.title
                            })}
                            disabled={actionLoading === service.id}
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
                              serviceId: service.id,
                              serviceTitle: service.title
                            })}
                            disabled={actionLoading === service.id}
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
                          serviceId: service.id,
                          serviceTitle: service.title
                        })}
                        disabled={actionLoading === service.id}
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
        title={`${confirmDialog.action.charAt(0).toUpperCase() + confirmDialog.action.slice(1)} Service`}
        description={`Are you sure you want to ${confirmDialog.action} "${confirmDialog.serviceTitle}"?`}
        onConfirm={confirmAction}
        confirmText={confirmDialog.action === 'delete' ? 'Delete' : confirmDialog.action === 'approve' ? 'Approve' : 'Reject'}
      />
    </div>
  )
}
