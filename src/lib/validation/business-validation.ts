// Production-grade validation utilities for business data

export interface BusinessFormData {
  name: string
  shortDescription: string
  fullDescription: string
  category: string
  tags: string[]
  city: string
  neighborhood: string
  address: string
  phone: string
  whatsapp: string
  email: string
  website: string
  instagram: string
  facebook: string
}

export interface Service {
  id: string
  name: string
  description: string
  price: string
}

export interface ValidationError {
  field: string
  message: string
}

export class BusinessValidator {
  private errors: ValidationError[] = []

  validate(formData: BusinessFormData, services: Service[], images: any): ValidationError[] {
    this.errors = []
    
    this.validateBusinessName(formData.name)
    this.validateShortDescription(formData.shortDescription)
    this.validateFullDescription(formData.fullDescription)
    this.validateCategory(formData.category)
    this.validateTags(formData.tags)
    this.validateCity(formData.city)
    this.validatePhone(formData.phone)
    this.validateWhatsApp(formData.whatsapp)
    this.validateEmail(formData.email)
    this.validateWebsite(formData.website)
    this.validateSocialMedia(formData.instagram, formData.facebook)
    this.validateServices(services)
    this.validateImages(images)

    return this.errors
  }

  private validateBusinessName(name: string) {
    if (!name || name.trim().length === 0) {
      this.errors.push({ field: 'name', message: 'Business name is required' })
      return
    }

    if (name.trim().length < 3) {
      this.errors.push({ field: 'name', message: 'Business name must be at least 3 characters' })
    }

    if (name.trim().length > 255) {
      this.errors.push({ field: 'name', message: 'Business name must be less than 255 characters' })
    }
  }

  private validateShortDescription(description: string) {
    if (!description || description.trim().length === 0) {
      this.errors.push({ field: 'shortDescription', message: 'Short description is required' })
      return
    }

    if (description.trim().length < 10) {
      this.errors.push({ field: 'shortDescription', message: 'Short description must be at least 10 characters' })
    }

    if (description.trim().length > 500) {
      this.errors.push({ field: 'shortDescription', message: 'Short description must be less than 500 characters' })
    }
  }

  private validateFullDescription(description: string) {
    if (description && description.length > 5000) {
      this.errors.push({ field: 'fullDescription', message: 'Full description must be less than 5000 characters' })
    }
  }

  private validateCategory(category: string) {
    if (!category || category.trim().length === 0) {
      this.errors.push({ field: 'category', message: 'Category is required' })
    }
  }

  private validateTags(tags: string[]) {
    if (tags.length > 10) {
      this.errors.push({ field: 'tags', message: 'Maximum 10 tags allowed' })
    }

    tags.forEach((tag, index) => {
      if (tag.length > 50) {
        this.errors.push({ field: 'tags', message: `Tag ${index + 1} must be less than 50 characters` })
      }
    })
  }

  private validateCity(city: string) {
    if (!city || city.trim().length === 0) {
      this.errors.push({ field: 'city', message: 'City is required' })
    }
  }

  private validatePhone(phone: string) {
    if (!phone || phone.trim().length === 0) {
      this.errors.push({ field: 'phone', message: 'Phone number is required' })
      return
    }

    // Moroccan phone format validation
    const phoneRegex = /^(\+212|0)?[6-7]\d{8}$/
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      this.errors.push({ field: 'phone', message: 'Invalid Moroccan phone number format. Use format: +212 6XX XXX XXX or 06XX XXX XXX' })
    }
  }

  private validateWhatsApp(whatsapp: string) {
    if (whatsapp && whatsapp.trim().length > 0) {
      const phoneRegex = /^(\+212|0)?[6-7]\d{8}$/
      if (!phoneRegex.test(whatsapp.replace(/\s/g, ''))) {
        this.errors.push({ field: 'whatsapp', message: 'Invalid WhatsApp number format' })
      }
    }
  }

  private validateEmail(email: string) {
    if (!email || email.trim().length === 0) {
      this.errors.push({ field: 'email', message: 'Email is required' })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      this.errors.push({ field: 'email', message: 'Invalid email format' })
    }

    if (email.length > 255) {
      this.errors.push({ field: 'email', message: 'Email must be less than 255 characters' })
    }
  }

  private validateWebsite(website: string) {
    if (website && website.trim().length > 0) {
      try {
        new URL(website)
      } catch {
        this.errors.push({ field: 'website', message: 'Invalid website URL format' })
      }
    }
  }

  private validateSocialMedia(instagram: string, facebook: string) {
    if (instagram && instagram.trim().length > 0) {
      if (instagram.length > 255) {
        this.errors.push({ field: 'instagram', message: 'Instagram handle must be less than 255 characters' })
      }
    }

    if (facebook && facebook.trim().length > 0) {
      if (facebook.length > 255) {
        this.errors.push({ field: 'facebook', message: 'Facebook URL must be less than 255 characters' })
      }
    }
  }

  private validateServices(services: Service[]) {
    if (services.length > 20) {
      this.errors.push({ field: 'services', message: 'Maximum 20 services allowed' })
    }

    services.forEach((service, index) => {
      if (!service.name || service.name.trim().length === 0) {
        this.errors.push({ field: 'services', message: `Service ${index + 1} name is required` })
      }

      if (service.name && service.name.length > 255) {
        this.errors.push({ field: 'services', message: `Service ${index + 1} name must be less than 255 characters` })
      }

      if (service.description && service.description.length > 1000) {
        this.errors.push({ field: 'services', message: `Service ${index + 1} description must be less than 1000 characters` })
      }

      if (service.price && service.price.length > 50) {
        this.errors.push({ field: 'services', message: `Service ${index + 1} price must be less than 50 characters` })
      }
    })
  }

  private validateImages(images: any) {
    if (!images.logo) {
      this.errors.push({ field: 'logo', message: 'Business logo is required' })
    }

    if (images.gallery && images.gallery.length > 10) {
      this.errors.push({ field: 'gallery', message: 'Maximum 10 gallery images allowed' })
    }
  }

  isValid(): boolean {
    return this.errors.length === 0
  }

  getErrors(): ValidationError[] {
    return this.errors
  }
}

export const validateBusinessData = (
  formData: BusinessFormData,
  services: Service[],
  images: any
): { isValid: boolean; errors: ValidationError[] } => {
  const validator = new BusinessValidator()
  const errors = validator.validate(formData, services, images)
  
  return {
    isValid: validator.isValid(),
    errors,
  }
}
