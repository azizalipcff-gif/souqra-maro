// Simple in-memory rate limiter
// In production, use Redis or similar for distributed systems

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

export function rateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  // Clean up expired entries
  if (entry && entry.resetTime < now) {
    rateLimitStore.delete(identifier)
  }

  const currentEntry = rateLimitStore.get(identifier) || {
    count: 0,
    resetTime: now + windowMs,
  }

  if (currentEntry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: currentEntry.resetTime,
    }
  }

  currentEntry.count++
  rateLimitStore.set(identifier, currentEntry)

  return {
    allowed: true,
    remaining: limit - currentEntry.count,
    resetTime: currentEntry.resetTime,
  }
}

export function rateLimitByIp(ip: string, limit = 100, windowMs = 60000) {
  return rateLimit(ip, limit, windowMs)
}

export function rateLimitByUserId(userId: string, limit = 50, windowMs = 60000) {
  return rateLimit(userId, limit, windowMs)
}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean up every minute
