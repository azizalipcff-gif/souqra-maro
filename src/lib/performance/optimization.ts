// Performance optimization utilities for SOUQORA

export function lazyLoadComponent<T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
) {
  return React.lazy(componentImport)
}

export function preloadImage(src: string) {
  if (typeof window === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = src
  document.head.appendChild(link)
}

export function preloadImages(srcs: string[]) {
  srcs.forEach((src) => preloadImage(src))
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string

      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (width > maxWidth) {
          height = (maxWidth / width) * height
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to compress image'))
            }
          },
          file.type,
          quality
        )
      }

      img.onerror = () => reject(new Error('Failed to load image'))
    }

    reader.onerror = () => reject(new Error('Failed to read file'))
  })
}

export function generatePlaceholder(width: number, height: number, color = '#e5e7eb'): string {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect fill='${encodeURIComponent(color)}' width='${width}' height='${height}'/%3E%3C/svg%3E`
}

export function getOptimizedImageUrl(
  url: string,
  width?: number,
  height?: number,
  quality = 80
): string {
  // This would integrate with Cloudinary or similar image optimization service
  // For now, return the original URL
  return url
}

export function prefetchRoute(path: string) {
  if (typeof window === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = path
  document.head.appendChild(link)
}

export function prefetchRoutes(paths: string[]) {
  paths.forEach((path) => prefetchRoute(path))
}

export function measurePerformance(name: string, fn: () => void) {
  if (typeof performance === 'undefined') {
    fn()
    return
  }

  const start = performance.now()
  fn()
  const end = performance.now()

  console.log(`${name} took ${(end - start).toFixed(2)}ms`)
}

export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver {
  if (typeof window === 'undefined') {
    // Return a mock observer for SSR
    return {
      observe: () => {},
      unobserve: () => {},
      disconnect: () => {},
    } as any
  }

  return new IntersectionObserver(callback, options)
}

export function isInViewport(element: HTMLElement): boolean {
  if (typeof window === 'undefined') return false

  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

export function smoothScrollTo(element: HTMLElement, offset = 0) {
  if (typeof window === 'undefined') return

  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
  const offsetPosition = elementPosition - offset

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  })
}
