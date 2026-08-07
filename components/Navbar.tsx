'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Search, Leaf } from 'lucide-react'

const CATEGORIES = [
  { label: 'Healthy Recipes', slug: 'healthy-recipes' },
  { label: 'Meal Plans', slug: 'meal-plans' },
  { label: 'Healthy Foods', slug: 'healthy-foods' },
  { label: 'Workout Plans', slug: 'workout-plans' },
  { label: 'Workouts', slug: 'workouts' },
  { label: 'Workout Gear', slug: 'workout-gear' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <Leaf className="w-4 h-4 text-primary" />
            </div>
            <span className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              Healthy Worm
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60 rounded-lg transition-all duration-200 whitespace-nowrap"
              >
                {cat.label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border pb-4 pt-2">
            <nav className="flex flex-col gap-1">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60 rounded-lg transition-all"
                >
                  {cat.label}
                </Link>
              ))}
              <Link
                href="/search"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60 rounded-lg transition-all flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
