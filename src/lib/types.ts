export interface UserProfile {
  id: string
  full_name: string | null
  username: string | null
  email: string
  phone: string | null
  city: string | null
  bio: string | null
  avatar_url: string | null
  whatsapp: string | null
  role: 'client' | 'business_owner' | 'admin'
  created_at: string | null
}

export interface Product {
  id: string
  title: string
  description: string | null
  category: string
  price: number
  city: string
  images: string[]
  phone: string | null
  whatsapp: string | null
  seller_id: string
}

export interface Business {
  id: string
  name: string
  category: string
  city: string
  phone: string
  whatsapp: string | null
  description: string | null
  logo_url: string | null
  cover_url: string | null
  owner_id: string
}
