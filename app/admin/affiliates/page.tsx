import { getAllAffiliates } from '@/lib/affiliates'
import AffiliatesClient from './AffiliatesClient'

export default async function AdminAffiliatesPage() {
  const affiliates = getAllAffiliates()
  return <AffiliatesClient initialAffiliates={affiliates} />
}
