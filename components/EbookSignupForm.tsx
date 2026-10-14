'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Loader2, AlertCircle, ShieldCheck } from 'lucide-react'

interface EbookSignupFormProps {
  defaultSource?: string
  className?: string
}

export default function EbookSignupForm({
  defaultSource = 'website',
  className = '',
}: EbookSignupFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [source, setSource] = useState(defaultSource)

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const urlSource = searchParams?.get('source')
    if (urlSource) {
      setSource(urlSource)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/ebook/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          firstName: firstName.trim() || undefined,
          marketingConsent,
          source,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit request.')
      }

      // Success -> Redirect to success page
      router.push('/free-recipes/success')
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'A network error occurred. Please check your connection and try again.'
      setErrorMessage(msg)
      setLoading(false)
    }
  }

  return (
    <div className={`bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm ${className}`}>
      {errorMessage && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 p-4 bg-red-50/80 border border-red-200 text-red-900 rounded-2xl text-sm leading-relaxed"
        >
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Optional First Name */}
        <div>
          <label
            htmlFor="ebook-firstname"
            className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
          >
            First Name <span className="text-muted-foreground/60 font-normal lowercase">(optional)</span>
          </label>
          <input
            id="ebook-firstname"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="e.g. Sarah"
            disabled={loading}
            maxLength={50}
            className="w-full px-4 py-3 rounded-xl border border-border bg-white text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all disabled:opacity-60"
          />
        </div>

        {/* Required Email */}
        <div>
          <label
            htmlFor="ebook-email"
            className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
          >
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="ebook-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sarah@example.com"
            disabled={loading}
            maxLength={254}
            className="w-full px-4 py-3 rounded-xl border border-border bg-white text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all disabled:opacity-60"
          />
        </div>

        {/* Separate, unchecked marketing consent */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              id="ebook-consent"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              disabled={loading}
              className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/40 cursor-pointer accent-primary"
            />
            <span className="text-xs text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors select-none">
              Yes, I would also like to receive future high-protein recipes, weekly meal-planning tips, and healthy wellness updates from Healthy Worm. (Optional)
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base py-3.5 px-6 rounded-full shadow-sm hover:shadow transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Preparing Your Free Ebook…</span>
              </>
            ) : (
              <>
                <span>Get My Free Ebook</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>

        {/* Supporting Copy & Privacy Link */}
        <p className="text-xs text-muted-foreground text-center leading-relaxed pt-2">
          Enter your email to receive your free recipe guide. You can choose separately whether you&apos;d also like to receive future recipes, cooking tips, and updates.{' '}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-foreground transition-colors inline-flex items-center gap-0.5"
          >
            Privacy Policy
          </Link>
          . No spam, ever.
        </p>
      </form>

      <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Instant PDF Access • 100% Free • Unsubscribe Anytime</span>
      </div>
    </div>
  )
}
