'use client'

import { useState } from 'react'
import { Leaf } from 'lucide-react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
    }
  }

  return (
    <section aria-labelledby="newsletter-heading" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-accent rounded-3xl p-8 sm:p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Leaf className="w-6 h-6 text-primary" />
          </div>
          <h2 id="newsletter-heading" className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3 text-balance">
            Get Healthy Tips Every Week
          </h2>
          <p className="text-muted-foreground text-base mb-8 max-w-md mx-auto">
            Join 12,000+ readers who get our best recipes, meal plans, and workout guides delivered every Tuesday.
          </p>

          {submitted ? (
            <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium">
              You&apos;re subscribed! Check your inbox.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                suppressHydrationWarning
                className="flex-1 px-4 py-3 rounded-full border border-border bg-white text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                suppressHydrationWarning
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm px-6 py-3 rounded-full transition-colors whitespace-nowrap"
              >
                Subscribe Free
              </button>
            </form>
          )}
          <p className="text-xs text-muted-foreground mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  )
}
