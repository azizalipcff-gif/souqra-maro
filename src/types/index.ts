export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  role: 'customer' | 'seller' | 'admin'
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  sellerId: string
  title: string
  description: string
  price: number
  images: string[]
  category: string
  stock: number
  condition: 'new' | 'used'
  location: string
  featured: boolean
  views: number
  createdAt: Date
  updatedAt: Date
  seller?: Seller
}

export interface Service {
  id: string
  sellerId: string
  title: string
  description: string
  price: number
  images: string[]
  category: string
  location: string
  featured: boolean
  rating: number
  reviews: number
  whatsapp: string
  phone?: string
  createdAt: Date
  updatedAt: Date
  seller?: Seller
}

export interface Seller {
  id: string
  userId: string
  storeName: string
  logo?: string
  banner?: string
  description: string
  location: string
  whatsapp: string
  phone?: string
  website?: string
  socialMedia?: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  rating: number
  reviews: number
  followers: number
  verified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: 'cod' | 'bank_transfer' | 'cash_plus' | 'stripe' | 'paypal'
  paymentStatus: 'pending' | 'paid' | 'failed'
  shippingAddress: Address
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  productId: string
  quantity: number
  price: number
  product?: Product
}

export interface Address {
  street: string
  city: string
  postalCode: string
  country: string
  phone: string
}

export interface Review {
  id: string
  userId: string
  productId?: string
  serviceId?: string
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
  user?: User
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  read: boolean
  createdAt: Date
  sender?: User
  receiver?: User
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'order' | 'message' | 'review' | 'promotion' | 'system'
  read: boolean
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  image?: string
  parentId?: string
  order: number
}

export interface CartItem {
  productId: string
  quantity: number
  product?: Product
}

export interface Favorite {
  id: string
  userId: string
  productId?: string
  serviceId?: string
  createdAt: Date
}
