import { Suspense } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EbookSignupForm from '@/components/EbookSignupForm'
import {
  CheckCircle2,
  BookOpen,
  Sparkles,
  ShoppingBag,
  Flame,
  Clock,
  Heart,
  ChevronRight,
} from 'lucide-react'

export const metadata: Metadata = {
  title: '10 Healthy High-Protein Recipes (Free PDF Ebook) — Healthy Worm',
  description:
    'Download our free recipe guide: 10 Healthy High-Protein Recipes with step-by-step instructions, macros, meal prep tips, and a complete shopping checklist.',
  alternates: {
    canonical: 'https://healthyworm.com/free-recipes',
  },
  openGraph: {
    title: "10 Healthy High-Protein Recipes You'll Actually Want to Eat",
    description:
      'A Simple Guide to Delicious, Balanced Meals for Everyday Life. Free instant PDF download from Healthy Worm.',
    url: 'https://healthyworm.com/free-recipes',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: '10 Healthy High-Protein Recipes Ebook Cover',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Ebook: 10 Healthy High-Protein Recipes',
    description: '10 delicious high-protein recipes with macros, tips, and shopping list.',
  },
}

export default function FreeRecipesLandingPage() {
  const benefits = [
    {
      title: '10 practical recipe ideas',
      desc: 'Tested for real life — straightforward, nutritious recipes that don’t require professional chef skills.',
    },
    {
      title: 'Simple ingredients & step-by-step instructions',
      desc: 'Pantry-friendly staples you can buy at any local supermarket without hunting down obscure items.',
    },
    {
      title: 'Preparation tips & approximate nutrition information',
      desc: 'Accurate macronutrient breakdowns (protein, carbs, fat, calories) so you can easily hit your wellness goals.',
    },
    {
      title: 'A grocery shopping checklist',
      desc: 'A ready-to-print shopping list categorized by produce, lean meats, and pantry grains to save time.',
    },
    {
      title: 'Meal-preparation inspiration',
      desc: 'Batch cooking schedules and smart storage guidelines to keep healthy food ready for busy weeknights.',
    },
  ]

  const recipeTeasers = [
    {
      title: 'Greek Lemon Herb Chicken & Quinoa',
      protein: '42g Protein',
      time: '25 Mins',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
    },
    {
      title: 'High-Protein Strawberry Overnight Oats',
      protein: '34g Protein',
      time: '5 Mins',
      image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=600&q=80',
    },
    {
      title: 'Sesame Ginger Glazed Salmon & Edamame',
      protein: '38g Protein',
      time: '20 Mins',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80',
    },
    {
      title: 'Spicy Ground Turkey & Sweet Potato Skillet',
      protein: '36g Protein',
      time: '30 Mins',
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80',
    },
  ]

  return (
    <>
      <Navbar />

      <main className="pt-20 bg-background text-foreground">
        {/* Breadcrumb Header */}
        <div className="bg-secondary/30 border-b border-border/60 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium">Free High-Protein Recipe Ebook</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section aria-labelledby="ebook-headline" className="py-12 sm:py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Headline, Copy & Book Mockup */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Free Instant PDF Download</span>
                </div>

                <h1
                  id="ebook-headline"
                  className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.15] text-balance"
                >
                  10 Healthy High-Protein Recipes You&apos;ll Actually Want to Eat
                </h1>

                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  Discover delicious, easy-to-make recipes with simple ingredients to help you bring more variety to your everyday meals.
                </p>

                {/* 3D Ebook Mockup & Visual Highlight */}
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-8 bg-card border border-border/80 rounded-3xl p-6 shadow-sm">
                  {/* Book 3D Container */}
                  <div className="relative group perspective-800 flex-shrink-0">
                    <div className="w-44 h-60 bg-gradient-to-br from-[#2E5A44] to-[#1E3B2C] rounded-r-xl rounded-l-sm shadow-2xl p-4 flex flex-col justify-between text-white border-l-4 border-[#162B20] relative transform -rotate-3 group-hover:rotate-0 transition-transform duration-300">
                      <div className="absolute top-2 right-2 bg-amber-400 text-stone-900 font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                        10 Recipes
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-200">
                          Healthy Worm
                        </span>
                        <h3 className="font-serif text-base font-bold leading-tight mt-1">
                          10 Healthy High-Protein Recipes
                        </h3>
                        <p className="text-[10px] text-white/80 mt-1">
                          A Simple Guide for Everyday Life
                        </p>
                      </div>
                      <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[9px] text-white/70">
                        <span>Full Macros</span>
                        <span>PDF Edition</span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Summary */}
                  <div className="space-y-2 text-sm">
                    <h4 className="font-serif font-bold text-base text-foreground">
                      Inside your free guide:
                    </h4>
                    <div className="space-y-1.5 text-muted-foreground text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>28g – 42g protein per single serving</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Quick prep (5 to 30 minutes max)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Printable 1-page grocery checklist</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Easy calorie & macro tracking</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Prominent Lead Capture Form */}
              <div className="lg:col-span-5">
                <div className="relative">
                  <div className="absolute -top-3 -right-3 z-10 hidden sm:block bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wide">
                    100% Free
                  </div>
                  <Suspense fallback={<div className="p-8 text-center bg-card rounded-3xl">Loading form…</div>}>
                    <EbookSignupForm defaultSource="free-recipes-landing" />
                  </Suspense>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section aria-labelledby="benefits-heading" className="py-16 bg-secondary/30 border-y border-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs uppercase font-bold tracking-widest text-primary">Why You&apos;ll Love It</span>
              <h2 id="benefits-heading" className="font-serif text-3xl font-bold text-foreground mt-2">
                Everything You Need for Effortless Nutrition
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mt-2">
                No strict dieting rules or bland boiled meals — just satisfying, high-protein foods designed for your daily routine.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((b, idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm hover:shadow transition-shadow flex flex-col gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent text-primary flex items-center justify-center flex-shrink-0 font-bold font-serif">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-foreground mb-1.5 capitalize">
                      {b.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}

              {/* 6th Card: Free Printable Checklist Feature */}
              <div className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center flex-shrink-0 mb-3">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white mb-1.5">
                    Ready-to-Use Grocery Checklist
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Skip the grocery store overwhelm with our pre-categorized master shopping list for lean proteins and staples.
                  </p>
                </div>
                <div className="pt-4 text-xs text-white/60 font-semibold tracking-wider uppercase">
                  Included in PDF
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sneak Peek: Recipe Preview Teasers */}
        <section aria-labelledby="sneak-peek-heading" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-primary">Sneak Peek</span>
                <h2 id="sneak-peek-heading" className="font-serif text-3xl font-bold text-foreground mt-1">
                  A Taste of What&apos;s Inside
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Here are 4 of the 10 featured recipes waiting in your digital guide:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recipeTeasers.map((recipe, i) => (
                <div
                  key={i}
                  className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-sm group hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400" />
                      <span>{recipe.protein}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
                      <Clock className="w-3 h-3" />
                      <span>{recipe.time}</span>
                    </div>
                    <h3 className="font-serif font-bold text-base text-foreground leading-snug">
                      {recipe.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Call to Action strip */}
            <div className="mt-12 bg-accent rounded-3xl p-8 sm:p-10 text-center max-w-3xl mx-auto">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                Ready to make high-protein eating effortless?
              </h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-lg mx-auto">
                Join our community and get your instant copy sent right to your email address.
              </p>
              <a
                href="#ebook-headline"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm px-8 py-3 rounded-full transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Claim Your Free Ebook Now
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}
