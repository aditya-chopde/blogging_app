import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Unsubscribe — Healthy Worm',
  description: 'Manage your email preferences and unsubscribe from Healthy Worm updates.',
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 sm:p-10 text-center shadow-sm">
          {status === 'success' ? (
            <>
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
                You&apos;re Unsubscribed
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                Your email preferences have been updated. You will no longer receive marketing emails or weekly newsletters from Healthy Worm.
              </p>
            </>
          ) : status === 'invalid' ? (
            <>
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-5">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Link Expired or Invalid
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                The unsubscribe link provided is invalid or has already been used. If you still wish to manage your preferences, please contact our team.
              </p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 bg-accent text-primary rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Email Preferences
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                You can manage your subscription anytime using the links at the bottom of our emails.
              </p>
            </>
          )}

          <div className="pt-4 border-t border-border flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Healthy Worm
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
