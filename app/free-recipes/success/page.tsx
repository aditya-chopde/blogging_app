import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { MailCheck, ArrowRight, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Your Ebook Is On Its Way! — Healthy Worm',
  description: 'Your free high-protein recipe guide has been dispatched to your inbox.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function FreeRecipesSuccessPage() {
  return (
    <>
      <Navbar />

      <main className="pt-24 pb-20 min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="max-w-xl w-full bg-card border border-border/80 rounded-3xl p-8 sm:p-12 text-center shadow-sm">
          
          {/* Animated/Glowing Check Icon */}
          <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-200">
            <MailCheck className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Success</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Your ebook is on its way!
          </h1>

          <p className="text-muted-foreground text-base leading-relaxed mb-6">
            Please check your inbox for the download link. If you don&apos;t see the email shortly, check your spam or promotions folder.
          </p>

          {/* Quick Tips Box */}
          <div className="bg-secondary/40 border border-border/60 rounded-2xl p-5 mb-8 text-left space-y-2.5">
            <h3 className="font-serif font-bold text-sm text-foreground">
              What happens next?
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>An email from <strong>Healthy Worm</strong> contains your secure 7-day download link.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Click the button in your email to instantly download the PDF on phone or computer.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Mark the email as &quot;Important&quot; so you never miss new recipes.</span>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm px-6 py-3 rounded-full transition-colors"
            >
              <span>Back to Blog Homepage</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/category/healthy-recipes"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground hover:bg-accent/80 font-semibold text-sm px-6 py-3 rounded-full transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Healthy Recipes</span>
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </>
  )
}
