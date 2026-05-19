import { BusinessFormData, ValidationResult, ValidationError } from '@/types/business'

const MOROCCAN_CITIES = [
  "Casablanca",
  "Rabat",
  "Tangier",
  "Marrakech",
  "Agadir",
  "Fes",
  "Oujda",
  "Meknes",
  "Kenitra",
  "Tetouan",
  "Safi",
  "El Jadida",
  "Beni Mellal",
  "Nador",
  "Berkane",
  "Al Hoceima",
  "Taza",
  "Essaouira",
  "Khouribga",
  "Settat",
]

const BUSINESS_CATEGORIES = [
  "Technology",
  "Restaurants & Food",
  "Retail",
  "Services",
  "Health & Wellness",
  "Education",
  "Entertainment",
  "Automotive",
  "Construction",
  "Professional Services",
  "Beauty & Fashion",
  "Home & Garden",
  "Sports & Fitness",
  "Travel & Tourism",
  "Other",
]

export const validateBusinessData = (data: BusinessFormData): ValidationResult => {
  const errors: ValidationError[] = []

  // Validate business name
  if (!data.business_name || data.business_name.trim().length === 0) {
    errors.push({ field: 'business_name', message: 'Business name is required' })
  } else if (data.business_name.trim().length < 3) {
    errors.push({ field: 'business_name', message: 'Business name must be at least 3 characters' })
  } else if (data.business_name.trim().length > 100) {
    errors.push({ field: 'business_name', message: 'Business name must not exceed 100 characters' })
  }

  // Validate category
  if (!data.category || data.category.trim().length === 0) {
    errors.push({ field: 'category', message: 'Category is required' })
  } else if (!BUSINESS_CATEGORIES.includes(data.category)) {
    errors.push({ field: 'category', message: 'Invalid category' })
  }

  // Validate city
  if (!data.city || data.city.trim().length === 0) {
    errors.push({ field: 'city', message: 'City is required' })
  } else if (!MOROCCAN_CITIES.includes(data.city)) {
    errors.push({ field: 'city', message: 'Invalid city' })
  }

  // Validate phone
  if (!data.phone || data.phone.trim().length === 0) {
    errors.push({ field: 'phone', message: 'Phone number is required' })
  } else {
    const phoneRegex = /^(\+212|0)?[6-7]\d{8}$/
    if (!phoneRegex.test(data.phone.trim())) {
      errors.push({ field: 'phone', message: 'Invalid Moroccan phone number format (e.g., +212 6XX XXX XXX or 06XX XXX XXX)' })
    }
  }

  // Validate whatsapp (optional but must be valid if provided)
  if (data.whatsapp && data.whatsapp.trim().length > 0) {
    const phoneRegex = /^(\+212|0)?[6-7]\d{8}$/
    if (!phoneRegex.test(data.whatsapp.trim())) {
      errors.push({ field: 'whatsapp', message: 'Invalid Moroccan WhatsApp number format' })
    }
  }

  // Validate description
  if (!data.description || data.description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Description is required' })
  } else if (data.description.trim().length < 20) {
    errors.push({ field: 'description', message: 'Description must be at least 20 characters' })
  } else if (data.description.trim().length > 2000) {
    errors.push({ field: 'description', message: 'Description must not exceed 2000 characters' })
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

export const MOROCCAN_CITIES_LIST = MOROCCAN_CITIES
export const BUSINESS_CATEGORIES_LIST = BUSINESS_CATEGORIES
