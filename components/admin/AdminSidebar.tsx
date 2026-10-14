'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  PenSquare,
  ShoppingBag,
  LogOut,
  Leaf,
  ChevronRight,
  Users,
} from 'lucide-react'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/posts', label: 'All Posts', icon: FileText },
  { href: '/admin/editor', label: 'New Post', icon: PenSquare },
  { href: '/admin/affiliates', label: 'Affiliates', icon: ShoppingBag },
  { href: '/admin/subscribers', label: 'Ebook Leads', icon: Users },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname === '/admin/login') {
    return null
  }

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <aside className="w-60 min-h-screen bg-primary flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-primary-foreground/10">
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
          <Leaf className="w-4 h-4 text-primary" />
        </div>
        <div>
          <div className="font-serif text-sm font-bold text-primary-foreground leading-tight">Healthy Worm</div>
          <div className="text-xs text-primary-foreground/50">Admin Panel</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-accent/20 text-primary-foreground'
                  : 'text-primary-foreground/60 hover:bg-primary-foreground/5 hover:text-primary-foreground'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon className="w-4 h-4" />
                {label}
              </span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 border-t border-primary-foreground/10 pt-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-primary-foreground/60 hover:bg-primary-foreground/5 hover:text-primary-foreground transition-all mb-1"
        >
          <Leaf className="w-4 h-4" />
          View Site
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-primary-foreground/60 hover:bg-primary-foreground/5 hover:text-primary-foreground transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
