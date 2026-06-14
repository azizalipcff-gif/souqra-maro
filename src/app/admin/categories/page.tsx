"use client"

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Search,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

interface Category {
  id: string
  name: string
  slug: string
  icon: string
  description: string
  order_index: number
  is_active: boolean
  created_at: string
}

export default function CategoriesPage() {
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: '', icon: '', description: '' })
  const supabase = createClient()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .order('order_index', { ascending: true })

      if (fetchError) throw fetchError
      
      setCategories(data || [])
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddCategory = async () => {
    if (!newCategory.name) {
      alert('Please enter a category name')
      return
    }

    try {
      setProcessing('add')
      setError(null)
      
      const slug = newCategory.name.toLowerCase().replace(/\s+/g, '-')
      const orderIndex = categories.length + 1
      
      const { error: insertError } = await supabase
        .from('categories')
        .insert({
          name: newCategory.name,
          slug,
          icon: newCategory.icon || '📁',
          description: newCategory.description,
          order_index: orderIndex,
          is_active: true
        })

      if (insertError) throw insertError
      
      // Reset form
      setNewCategory({ name: '', icon: '', description: '' })
      setIsAddingCategory(false)
      
      // Refresh the list
      await fetchCategories()
      
      alert('Category added successfully!')
    } catch (err) {
      console.error('Error adding category:', err)
      setError('Failed to add category')
      alert('Failed to add category. Please try again.')
    } finally {
      setProcessing(null)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      setProcessing(id)
      setError(null)
      
      const { error: updateError } = await supabase
        .from('categories')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (updateError) throw updateError
      
      // Refresh the list
      await fetchCategories()
      
      alert(`Category ${!currentStatus ? 'activated' : 'deactivated'} successfully!`)
    } catch (err) {
      console.error('Error toggling category status:', err)
      setError('Failed to update category status')
      alert('Failed to update category status. Please try again.')
    } finally {
      setProcessing(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return
    }

    try {
      setProcessing(id)
      setError(null)
      
      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
      
      // Refresh the list
      await fetchCategories()
      
      alert('Category deleted successfully!')
    } catch (err) {
      console.error('Error deleting category:', err)
      setError('Failed to delete category')
      alert('Failed to delete category. Please try again.')
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            <Button onClick={() => setIsAddingCategory(true)} className="bg-white text-blue-600 hover:bg-gray-100 transition-colors font-semibold">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Category Management</h1>
          <p className="text-blue-100 text-lg">Manage marketplace categories</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-300"
              />
            </div>
          </div>

          {/* Add Category Form */}
          {isAddingCategory && (
            <Card className="mb-8 border border-gray-100">
              <CardHeader>
                <CardTitle className="text-xl">Add New Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <Input
                    placeholder="Category name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="border-gray-200 focus:border-blue-300"
                  />
                  <Input
                    placeholder="Icon (emoji)"
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                    className="md:w-32 border-gray-200 focus:border-blue-300"
                  />
                  <Input
                    placeholder="Description (optional)"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    className="border-gray-200 focus:border-blue-300"
                  />
                  <Button 
                    onClick={handleAddCategory} 
                    disabled={processing === 'add'}
                    className="hover:bg-blue-700 transition-colors"
                  >
                    {processing === 'add' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Add'
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingCategory(false)} className="hover:bg-gray-50 transition-colors">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Categories List */}
          <Card className="border border-gray-100">
            <CardHeader>
              <CardTitle className="text-xl">All Categories ({filteredCategories.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading categories...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredCategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors px-4 -mx-4 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{category.icon}</div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-600">/{category.slug}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:text-blue-600 transition-colors">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleStatus(category.id, category.is_active)}
                          disabled={processing === category.id}
                          className="hover:bg-yellow-50 transition-colors"
                        >
                          {processing === category.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : category.is_active ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category.id)}
                          disabled={processing === category.id}
                          className="hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          {processing === category.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && filteredCategories.length === 0 && (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg font-medium">No categories found</p>
                  <p className="text-gray-500 mt-2">Add your first category to get started</p>
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
