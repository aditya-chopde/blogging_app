import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata = {
  title: 'Admin — Healthy Worm',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}
