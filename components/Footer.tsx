import Link from 'next/link'
import { Leaf } from 'lucide-react'

const CATEGORIES = [
  { label: 'Healthy Recipes', slug: 'healthy-recipes' },
  { label: 'Meal Plans', slug: 'meal-plans' },
  { label: 'Healthy Foods', slug: 'healthy-foods' },
  { label: 'Workout Plans', slug: 'workout-plans' },
  { label: 'Workouts', slug: 'workouts' },
  { label: 'Workout Gear', slug: 'workout-gear' },
]

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <Leaf className="w-4 h-4 text-primary" />
              </div>
              <span className="font-serif text-xl font-bold text-primary-foreground">Healthy Worm</span>
            </Link>
            <p className="text-sm leading-relaxed text-primary-foreground/70">
              Your trusted resource for healthy recipes, meal plans, workout guides, and the best fitness gear. Live healthier, one day at a time.
            </p>
            <p className="text-xs text-primary-foreground/50">
              Disclosure: Some links on this site are affiliate links. We may earn a commission at no extra cost to you.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-serif text-base font-semibold mb-4 text-primary-foreground">Categories</h3>
            <ul className="flex flex-col gap-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-serif text-base font-semibold mb-4 text-primary-foreground">More</h3>
            <ul className="flex flex-col gap-2">
              {[
                { label: 'About', href: '/about' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Affiliate Disclosure', href: '/affiliate-disclosure' },
                { label: 'Contact', href: '/contact' },
                { label: 'Search Articles', href: '/search' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-primary-foreground/50">
            &copy; {new Date().getFullYear()} Healthy Worm. All rights reserved.
          </p>
          <p className="text-xs text-primary-foreground/50">
            Made with care for healthy living.
          </p>
        </div>
      </div>
    </footer>
  )
}
