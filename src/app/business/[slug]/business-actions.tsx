"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Edit2, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSupabase } from "@/lib/supabase/client"

interface BusinessActionsProps {
  businessId: string
  userId: string
}

export default function BusinessActions({ businessId, userId }: BusinessActionsProps) {
  const router = useRouter()
  const [isOwner, setIsOwner] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkOwnership()
  }, [])

  const checkOwnership = async () => {
    try {
      const { data: { session } } = await getSupabase().auth.getSession()
      if (session?.user?.id === userId) {
        setIsOwner(true)
      }
    } catch (error) {
      console.error('Ownership check error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      return
    }

    try {
      const { data: { session } } = await getSupabase().auth.getSession()
      if (!session) throw new Error('Not authenticated')

      const { error } = await getSupabase()
        .from('businesses')
        .delete()
        .eq('id', businessId)
        .eq('user_id', session.user.id)

      if (error) throw error

      router.push('/profile')
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete business')
    }
  }

  if (isLoading) {
    return null
  }

  if (!isOwner) {
    return null
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push(`/business/${businessId}/edit`)}
      >
        <Edit2 className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleDelete}
        className="text-red-600 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
