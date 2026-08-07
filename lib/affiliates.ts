import fs from 'fs'
import path from 'path'
import type { AffiliateProduct } from './posts'

const AFFILIATES_FILE = path.join(process.cwd(), 'data', 'affiliates.json')

export function getAllAffiliates(): AffiliateProduct[] {
  if (!fs.existsSync(AFFILIATES_FILE)) return []
  try {
    const raw = fs.readFileSync(AFFILIATES_FILE, 'utf-8')
    return JSON.parse(raw) as AffiliateProduct[]
  } catch {
    return []
  }
}

export function getAffiliateById(id: string): AffiliateProduct | null {
  return getAllAffiliates().find((a) => a.id === id) ?? null
}
