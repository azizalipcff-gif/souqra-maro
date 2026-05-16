// Validation utilities for API routes

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function validatePassword(password: string): ValidationResult {
  const errors: Record<string, string> = {}

  if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  }

  if (!/[A-Z]/.test(password)) {
    errors.password = 'Password must contain at least one uppercase letter'
  }

  if (!/[a-z]/.test(password)) {
    errors.password = 'Password must contain at least one lowercase letter'
  }

  if (!/[0-9]/.test(password)) {
    errors.password = 'Password must contain at least one number'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateProduct(data: any): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.title || data.title.length < 3) {
    errors.title = 'Title must be at least 3 characters'
  }

  if (!data.price || data.price <= 0) {
    errors.price = 'Price must be greater than 0'
  }

  if (!data.images || !Array.isArray(data.images) || data.images.length === 0) {
    errors.images = 'At least one image is required'
  }

  if (!data.location || data.location.length < 2) {
    errors.location = 'Location is required'
  }

  if (data.stock !== undefined && data.stock < 0) {
    errors.stock = 'Stock cannot be negative'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateOrder(data: any): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.user_id) {
    errors.user_id = 'User ID is required'
  }

  if (!data.total || data.total <= 0) {
    errors.total = 'Total must be greater than 0'
  }

  if (!data.payment_method) {
    errors.payment_method = 'Payment method is required'
  }

  if (!data.shipping_address) {
    errors.shipping_address = 'Shipping address is required'
  }

  const requiredAddressFields = ['street', 'city', 'postalCode', 'country', 'phone']
  for (const field of requiredAddressFields) {
    if (!data.shipping_address[field]) {
      errors[`shipping_address.${field}`] = `${field} is required`
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

export function validateRequiredFields(data: any, fields: string[]): ValidationResult {
  const errors: Record<string, string> = {}

  for (const field of fields) {
    if (!data[field]) {
      errors[field] = `${field} is required`
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
