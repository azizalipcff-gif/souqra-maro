export interface Profile {
  id: string
  full_name: string | null
  role: 'client' | 'business_owner' | 'admin'
  created_at: string
}

export interface Business {
  id: string
  user_id: string
  business_name: string
  category: string
  city: string
  phone: string
  whatsapp: string | null
  description: string | null
  logo_url: string | null
  cover_url: string | null
  approved: boolean
  created_at: string
}

export interface BusinessFormData {
  business_name: string
  category: string
  city: string
  phone: string
  whatsapp: string
  description: string
  logo_url: string | null
  cover_url: string | null
}

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}
