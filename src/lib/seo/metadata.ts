// SEO and Metadata utilities for SOUQORA

export interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  noIndex?: boolean
  canonical?: string
}

const defaultTitle = 'SOUQORA - Moroccan Marketplace Platform'
const defaultDescription = 'Discover amazing products and services from sellers across Morocco. Buy, sell, and connect with local businesses on SOUQORA.'
const defaultKeywords = ['Morocco', 'marketplace', 'ecommerce', 'buy', 'sell', 'services', 'local business']
const defaultImage = '/og-image.png'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://souqora.ma'

export function generateMetadata(props: SEOProps = {}) {
  const {
    title = defaultTitle,
    description = defaultDescription,
    keywords = defaultKeywords,
    image = defaultImage,
    url = siteUrl,
    noIndex = false,
    canonical,
  } = props

  const fullTitle = title === defaultTitle ? title : `${title} | SOUQORA`
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    canonical: canonical || fullUrl,
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: 'SOUQORA',
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImage],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      } as any,
    },
    alternates: {
      canonical: canonical || fullUrl,
      languages: {
        'en-US': fullUrl,
        'ar-MA': `${fullUrl}/ar`,
        'fr-MA': `${fullUrl}/fr`,
      },
    },
  }
}

export function generateProductMetadata(product: {
  title: string
  description?: string
  price: number
  images: string[]
  category?: string
  location?: string
}) {
  const title = product.title
  const description = product.description || `Buy ${product.title} at ${product.price} MAD. ${product.category ? `Category: ${product.category}.` : ''} ${product.location ? `Located in ${product.location}.` : ''}`
  const image = product.images[0] || defaultImage
  const keywords = [
    ...defaultKeywords,
    product.title,
    product.category || '',
    product.location || '',
    'buy',
    'shop',
  ].filter(Boolean)

  return generateMetadata({
    title,
    description,
    keywords,
    image,
    url: `/products/${product.title.toLowerCase().replace(/\s+/g, '-')}`,
  })
}

export function generateServiceMetadata(service: {
  title: string
  description?: string
  price: number
  images: string[]
  category?: string
  location?: string
}) {
  const title = service.title
  const description = service.description || `Professional ${service.title} service starting at ${service.price} MAD. ${service.category ? `Category: ${service.category}.` : ''} ${service.location ? `Available in ${service.location}.` : ''}`
  const image = service.images[0] || defaultImage
  const keywords = [
    ...defaultKeywords,
    service.title,
    service.category || '',
    service.location || '',
    'service',
    'professional',
  ].filter(Boolean)

  return generateMetadata({
    title,
    description,
    keywords,
    image,
    url: `/services/${service.title.toLowerCase().replace(/\s+/g, '-')}`,
  })
}

export function generateStoreMetadata(store: {
  name: string
  description?: string
  location?: string
  logo?: string
}) {
  const title = `${store.name} Store`
  const description = store.description || `Shop from ${store.name} on SOUQORA. ${store.location ? `Located in ${store.location}.` : ''} Browse their products and services.`
  const image = store.logo || defaultImage
  const keywords = [
    ...defaultKeywords,
    store.name,
    store.location || '',
    'store',
    'shop',
  ].filter(Boolean)

  return generateMetadata({
    title,
    description,
    keywords,
    image,
    url: `/stores/${store.name.toLowerCase().replace(/\s+/g, '-')}`,
  })
}

export function generateCategoryMetadata(category: {
  name: string
  description?: string
}) {
  const title = `${category.name} - SOUQORA`
  const description = category.description || `Browse all ${category.name} products and services on SOUQORA. Find the best deals from sellers across Morocco.`
  const keywords = [
    ...defaultKeywords,
    category.name,
    'category',
    'browse',
  ]

  return generateMetadata({
    title,
    description,
    keywords,
    url: `/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`,
  })
}
