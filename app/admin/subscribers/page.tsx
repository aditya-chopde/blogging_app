import { getAllSubscribers } from '@/lib/subscribers'
import AdminSubscribersClient from './AdminSubscribersClient'

export const metadata = {
  title: 'Ebook Leads & Subscribers — Admin Dashboard',
}

export default async function AdminSubscribersPage() {
  const subscribers = getAllSubscribers().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return <AdminSubscribersClient initialSubscribers={subscribers} />
}
