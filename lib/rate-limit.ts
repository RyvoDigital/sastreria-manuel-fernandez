type RateLimitStore = Map<string, { count: number; resetAt: number }>

const stores: Record<string, RateLimitStore> = {}

function getStore(name: string): RateLimitStore {
  if (!stores[name]) stores[name] = new Map()
  return stores[name]
}

function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  return 'unknown'
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

export function rateLimit({
  name,
  maxRequests,
  windowMs,
}: {
  name: string
  maxRequests: number
  windowMs: number
}): (req: Request) => RateLimitResult {
  const store = getStore(name)

  return (req: Request): RateLimitResult => {
    const ip = getClientIp(req)
    const now = Date.now()
    const reset = now + windowMs

    const record = store.get(ip)

    if (!record || record.resetAt < now) {
      store.set(ip, { count: 1, resetAt: reset })
      return { success: true, limit: maxRequests, remaining: maxRequests - 1, reset }
    }

    if (record.count >= maxRequests) {
      return { success: false, limit: maxRequests, remaining: 0, reset: record.resetAt }
    }

    record.count += 1
    return { success: true, limit: maxRequests, remaining: maxRequests - record.count, reset: record.resetAt }
  }
}
