// Database Models for SOUQORA
// These models represent the database schema in TypeScript

export interface User {
  id: string
  email: string
  password_hash: string
  name: string
  phone?: string
  avatar?: string
  role: 'customer' | 'seller'
  is_verified: boolean
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface Seller {
  id: string
  user_id: string
  store_name: string
  logo?: string
  banner?: string
  description?: string
  location: string
  whatsapp: string
  phone?: string
  website?: string
  facebook?: string
  instagram?: string
  twitter?: string
  rating: number
  reviews_count: number
  followers_count: number
  is_verified: boolean
  is_approved: boolean
  created_at: Date
  updated_at: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  image?: string
  parent_id?: string
  order_index: number
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface Product {
  id: string
  seller_id: string
  category_id?: string
  title: string
  description?: string
  price: number
  original_price?: number
  images: string[]
  condition: 'new' | 'used'
  stock: number
  location: string
  rating: number
  reviews_count: number
  views_count: number
  favorites_count: number
  is_featured: boolean
  is_active: boolean
  is_approved: boolean
  created_at: Date
  updated_at: Date
}

export interface Service {
  id: string
  seller_id: string
  category_id?: string
  title: string
  description?: string
  price: number
  images: string[]
  location: string
  whatsapp: string
  phone?: string
  rating: number
  reviews_count: number
  is_featured: boolean
  is_active: boolean
  is_approved: boolean
  created_at: Date
  updated_at: Date
}

export interface Order {
  id: string
  user_id: string
  order_number: string
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_method: 'cod' | 'bank_transfer' | 'cash_plus' | 'stripe' | 'paypal'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  shipping_address: ShippingAddress
  notes?: string
  created_at: Date
  updated_at: Date
}

export interface OrderItem {
  id: string
  order_id: string
  product_id?: string
  quantity: number
  price: number
  created_at: Date
}

export interface Review {
  id: string
  user_id: string
  product_id?: string
  service_id?: string
  rating: number
  comment?: string
  is_approved: boolean
  created_at: Date
  updated_at: Date
}

export interface Favorite {
  id: string
  user_id: string
  product_id?: string
  service_id?: string
  created_at: Date
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  is_read: boolean
  created_at: Date
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'order' | 'message' | 'review' | 'promotion' | 'system'
  link?: string
  is_read: boolean
  created_at: Date
}

export interface Report {
  id: string
  reporter_id: string
  target_type: 'product' | 'service' | 'seller' | 'user'
  target_id: string
  reason: string
  description?: string
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed'
  admin_notes?: string
  created_at: Date
  updated_at: Date
}

export interface ShippingAddress {
  street: string
  city: string
  postalCode: string
  country: string
  phone: string
}

// Database connection configuration
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'souqora',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
}

// Query builders and helpers
export class Database {
  static async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    // This would be implemented with actual database client (pg, prisma, etc.)
    // For now, this is a placeholder
    console.log('Executing query:', sql, params)
    return []
  }

  static async queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    const results = await this.query<T>(sql, params)
    return results[0] || null
  }

  static async execute(sql: string, params?: any[]): Promise<void> {
    console.log('Executing:', sql, params)
  }
}

// Repository pattern for each model
export class UserRepository {
  static async findById(id: string): Promise<User | null> {
    return Database.queryOne<User>('SELECT * FROM users WHERE id = $1', [id])
  }

  static async findByEmail(email: string): Promise<User | null> {
    return Database.queryOne<User>('SELECT * FROM users WHERE email = $1', [email])
  }

  static async create(data: Partial<User>): Promise<User> {
    const result = await Database.queryOne<User>(
      'INSERT INTO users (email, password_hash, name, phone, avatar, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [data.email, data.password_hash, data.name, data.phone, data.avatar, data.role]
    )
    return result!
  }

  static async update(id: string, data: Partial<User>): Promise<User> {
    const result = await Database.queryOne<User>(
      'UPDATE users SET name = $1, phone = $2, avatar = $3 WHERE id = $4 RETURNING *',
      [data.name, data.phone, data.avatar, id]
    )
    return result!
  }
}

export class ProductRepository {
  static async findAll(filters?: any): Promise<Product[]> {
    let sql = 'SELECT * FROM products WHERE is_active = true AND is_approved = true'
    const params: any[] = []

    if (filters?.category_id) {
      sql += ' AND category_id = $1'
      params.push(filters.category_id)
    }

    if (filters?.seller_id) {
      sql += ' AND seller_id = $' + (params.length + 1)
      params.push(filters.seller_id)
    }

    if (filters?.featured) {
      sql += ' AND is_featured = true'
    }

    sql += ' ORDER BY created_at DESC'

    return Database.query<Product>(sql, params)
  }

  static async findById(id: string): Promise<Product | null> {
    return Database.queryOne<Product>('SELECT * FROM products WHERE id = $1', [id])
  }

  static async create(data: Partial<Product>): Promise<Product> {
    const result = await Database.queryOne<Product>(
      'INSERT INTO products (seller_id, category_id, title, description, price, original_price, images, condition, stock, location) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [data.seller_id, data.category_id, data.title, data.description, data.price, data.original_price, data.images, data.condition, data.stock, data.location]
    )
    return result!
  }

  static async update(id: string, data: Partial<Product>): Promise<Product> {
    const result = await Database.queryOne<Product>(
      'UPDATE products SET title = $1, description = $2, price = $3, stock = $4 WHERE id = $5 RETURNING *',
      [data.title, data.description, data.price, data.stock, id]
    )
    return result!
  }

  static async delete(id: string): Promise<void> {
    await Database.execute('UPDATE products SET is_active = false WHERE id = $1', [id])
  }
}

export class OrderRepository {
  static async findByUserId(userId: string): Promise<Order[]> {
    return Database.query<Order>('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId])
  }

  static async findById(id: string): Promise<Order | null> {
    return Database.queryOne<Order>('SELECT * FROM orders WHERE id = $1', [id])
  }

  static async create(data: Partial<Order>): Promise<Order> {
    const result = await Database.queryOne<Order>(
      'INSERT INTO orders (user_id, order_number, total, status, payment_method, payment_status, shipping_address, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [data.user_id, data.order_number, data.total, data.status, data.payment_method, data.payment_status, JSON.stringify(data.shipping_address), data.notes]
    )
    return result!
  }

  static async updateStatus(id: string, status: Order['status']): Promise<Order> {
    const result = await Database.queryOne<Order>(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    )
    return result!
  }
}
