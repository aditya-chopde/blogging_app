// In-memory sliding-window rate limiter

interface RateLimitRecord {
  timestamps: number[]
}

const store = new Map<string, RateLimitRecord>()

// Clean up stale entries every 10 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of store.entries()) {
    record.timestamps = record.timestamps.filter((ts) => now - ts < 600000)
    if (record.timestamps.length === 0) {
      store.delete(key)
    }
  }
}, 600000).unref?.()

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetMs: number
}

export function checkRateLimit(
  identifier: string,
  limit = 5,
  windowMs = 600000 // 10 minutes
): RateLimitResult {
  const now = Date.now()
  let record = store.get(identifier)

  if (!record) {
    record = { timestamps: [] }
    store.set(identifier, record)
  }

  // Remove timestamps outside window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs)

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0]
    const resetMs = Math.max(0, oldest + windowMs - now)
    return {
      success: false,
      remaining: 0,
      resetMs,
    }
  }

  record.timestamps.push(now)
  return {
    success: true,
    remaining: limit - record.timestamps.length,
    resetMs: windowMs,
  }
}
