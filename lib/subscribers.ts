import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

export interface Subscriber {
  id: string
  email: string
  firstName?: string
  marketingConsent: boolean
  consentTimestamp: string | null
  source: string
  ebookDeliveryStatus: 'pending' | 'delivered' | 'failed'
  ebookDeliveredAt: string | null
  downloadToken: string
  downloadTokenExpiresAt: number // epoch ms
  downloadCount: number
  unsubscribeToken: string
  createdAt: string
  updatedAt: string
  unsubscribedAt: string | null
  lastDeliveryError?: string
}

export interface CreateSubscriberInput {
  email: string
  firstName?: string
  marketingConsent?: boolean
  source?: string
}

const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'subscribers.json')
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

function ensureFileExists() {
  const dir = path.dirname(SUBSCRIBERS_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(SUBSCRIBERS_FILE)) {
    fs.writeFileSync(SUBSCRIBERS_FILE, '[]', 'utf-8')
  }
}

export function getAllSubscribers(): Subscriber[] {
  ensureFileExists()
  try {
    const raw = fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8').trim()
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Subscriber[]) : []
  } catch (err) {
    console.error('Error reading subscribers file:', err)
    return []
  }
}

function writeAllSubscribers(subscribers: Subscriber[]): void {
  ensureFileExists()
  try {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), 'utf-8')
  } catch (err) {
    console.error('Error writing subscribers file:', err)
  }
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  return re.test(email)
}

export function getSubscriberByEmail(email: string): Subscriber | null {
  const normalized = normalizeEmail(email)
  const subscribers = getAllSubscribers()
  return subscribers.find((s) => s.email === normalized) ?? null
}

export function getSubscriberByDownloadToken(token: string): Subscriber | null {
  if (!token) return null
  const subscribers = getAllSubscribers()
  return subscribers.find((s) => s.downloadToken === token) ?? null
}

export function getSubscriberByUnsubscribeToken(token: string): Subscriber | null {
  if (!token) return null
  const subscribers = getAllSubscribers()
  return subscribers.find((s) => s.unsubscribeToken === token) ?? null
}

export function createOrUpdateSubscriber(input: CreateSubscriberInput): {
  subscriber: Subscriber
  isNew: boolean
} {
  const normalized = normalizeEmail(input.email)
  const subscribers = getAllSubscribers()
  const existingIdx = subscribers.findIndex((s) => s.email === normalized)
  const now = new Date().toISOString()
  const nowMs = Date.now()

  const safeFirstName = input.firstName ? input.firstName.trim().slice(0, 50) : undefined
  const hasConsent = Boolean(input.marketingConsent)
  const source = (input.source || 'website').trim().slice(0, 50)

  if (existingIdx >= 0) {
    const existing = subscribers[existingIdx]

    // Refresh download token with new validity
    const updatedDownloadToken = crypto.randomBytes(24).toString('hex')
    const updatedDownloadExpires = nowMs + TOKEN_TTL_MS

    const updated: Subscriber = {
      ...existing,
      firstName: safeFirstName ?? existing.firstName,
      // If user provided consent now, record consent timestamp
      marketingConsent: hasConsent || existing.marketingConsent,
      consentTimestamp: hasConsent ? (existing.consentTimestamp ?? now) : existing.consentTimestamp,
      // If previously unsubscribed, keep unsubscribed unless user explicitly opted into marketing now
      unsubscribedAt: hasConsent ? null : existing.unsubscribedAt,
      downloadToken: updatedDownloadToken,
      downloadTokenExpiresAt: updatedDownloadExpires,
      updatedAt: now,
      source: existing.source || source,
      ebookDeliveryStatus: 'pending',
    }

    subscribers[existingIdx] = updated
    writeAllSubscribers(subscribers)
    return { subscriber: updated, isNew: false }
  }

  // Create new subscriber
  const newSubscriber: Subscriber = {
    id: crypto.randomUUID(),
    email: normalized,
    firstName: safeFirstName,
    marketingConsent: hasConsent,
    consentTimestamp: hasConsent ? now : null,
    source,
    ebookDeliveryStatus: 'pending',
    ebookDeliveredAt: null,
    downloadToken: crypto.randomBytes(24).toString('hex'),
    downloadTokenExpiresAt: nowMs + TOKEN_TTL_MS,
    downloadCount: 0,
    unsubscribeToken: crypto.randomBytes(24).toString('hex'),
    createdAt: now,
    updatedAt: now,
    unsubscribedAt: null,
  }

  subscribers.push(newSubscriber)
  writeAllSubscribers(subscribers)
  return { subscriber: newSubscriber, isNew: true }
}

export function updateSubscriberDeliveryStatus(
  id: string,
  status: 'delivered' | 'failed',
  error?: string
): void {
  const subscribers = getAllSubscribers()
  const idx = subscribers.findIndex((s) => s.id === id)
  if (idx === -1) return

  const now = new Date().toISOString()
  subscribers[idx] = {
    ...subscribers[idx],
    ebookDeliveryStatus: status,
    ebookDeliveredAt: status === 'delivered' ? now : subscribers[idx].ebookDeliveredAt,
    lastDeliveryError: error,
    updatedAt: now,
  }

  writeAllSubscribers(subscribers)
}

export function recordDownload(token: string): boolean {
  const subscribers = getAllSubscribers()
  const idx = subscribers.findIndex((s) => s.downloadToken === token)
  if (idx === -1) return false

  const now = Date.now()
  if (subscribers[idx].downloadTokenExpiresAt < now) {
    return false // Expired
  }

  subscribers[idx] = {
    ...subscribers[idx],
    downloadCount: (subscribers[idx].downloadCount || 0) + 1,
    updatedAt: new Date().toISOString(),
  }

  writeAllSubscribers(subscribers)
  return true
}

export function unsubscribeByToken(token: string): { success: boolean; email?: string } {
  const subscribers = getAllSubscribers()
  const idx = subscribers.findIndex((s) => s.unsubscribeToken === token)
  if (idx === -1) return { success: false }

  const now = new Date().toISOString()
  subscribers[idx] = {
    ...subscribers[idx],
    marketingConsent: false,
    unsubscribedAt: now,
    updatedAt: now,
  }

  writeAllSubscribers(subscribers)
  return { success: true, email: subscribers[idx].email }
}

export function unsubscribeByEmail(email: string): boolean {
  const normalized = normalizeEmail(email)
  const subscribers = getAllSubscribers()
  const idx = subscribers.findIndex((s) => s.email === normalized)
  if (idx === -1) return false

  const now = new Date().toISOString()
  subscribers[idx] = {
    ...subscribers[idx],
    marketingConsent: false,
    unsubscribedAt: now,
    updatedAt: now,
  }

  writeAllSubscribers(subscribers)
  return true
}
