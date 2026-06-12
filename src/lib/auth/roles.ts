export type AppRole = 'user' | 'seller' | 'business' | 'admin'

const ROLE_ALIASES: Record<string, AppRole> = {
  user: 'user',
  customer: 'user',
  client: 'user',
  seller: 'seller',
  business: 'business',
  business_owner: 'business',
  admin: 'admin',
}

export function normalizeRole(value?: string | null): AppRole {
  if (!value) return 'user'
  return ROLE_ALIASES[value.toLowerCase()] ?? 'user'
}

export function getProfileRole(value?: string | null): string {
  return normalizeRole(value) === 'user' ? 'client' : normalizeRole(value) === 'business' ? 'business_owner' : normalizeRole(value)
}
