import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import CategoryGrid from '@/components/CategoryGrid'
import ArticleCard from '@/components/ArticleCard'
import NewsletterSection from '@/components/NewsletterSection'
import { getFeaturedPosts, getLatestPosts, getTrendingPosts } from '@/lib/posts'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'

export default function HomePage() {
  const featured = getFeaturedPosts(6)
  const latest = getLatestPosts(9)
  const trending = getTrendingPosts(5)
  const heroPost = featured[0] ?? latest[0]

  return (
    <>
      <Navbar />
      <main>
        {heroPost && <HeroSection featuredPost={heroPost} />}

        <CategoryGrid />

        {featured.length > 1 && (
          <section aria-labelledby="featured-heading" className="py-10 bg-secondary/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 id="featured-heading" className="font-serif text-3xl font-bold text-foreground">
                    Featured Articles
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">Our most popular guides, hand-picked for you</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featured.slice(1, 7).map((post) => (
                  <ArticleCard key={post.slug} post={post} variant="featured" />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-2xl font-bold text-foreground">Latest Articles</h2>
                  <Link
                    href="/search"
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {latest.slice(0, 8).map((post) => (
                    <ArticleCard key={post.slug} post={post} />
                  ))}
                </div>
              </div>

              <aside aria-label="Trending articles">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Trending Now</h2>
                <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-5">
                  {trending.map((post, i) => (
                    <div key={post.slug} className="flex gap-3 items-start">
                      <span className="text-3xl font-serif font-bold text-border leading-none w-8 flex-shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-muted-foreground capitalize">
                          {post.category.replace(/-/g, ' ')}
                        </span>
                        <Link href={`/blog/${post.slug}`}>
                          <h3 className="text-sm font-semibold text-foreground leading-snug mt-0.5 hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                        </Link>
                        <span className="text-xs text-muted-foreground">{post.readingTime}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="font-serif text-lg font-bold text-foreground mb-4">Browse by Category</h3>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: 'Healthy Recipes', slug: 'healthy-recipes' },
                      { label: 'Meal Plans', slug: 'meal-plans' },
                      { label: 'Healthy Foods', slug: 'healthy-foods' },
                      { label: 'Workout Plans', slug: 'workout-plans' },
                      { label: 'Workouts', slug: 'workouts' },
                      { label: 'Workout Gear', slug: 'workout-gear' },
                    ].map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-secondary/60 hover:bg-accent/60 text-sm font-medium text-foreground transition-colors group"
                      >
                        {cat.label}
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Promotional Ebook Lead Magnet Banner */}
        <section aria-label="Free Recipe Ebook Promo" className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="bg-gradient-to-r from-[#2E5A44] to-[#1E3B2C] text-white rounded-3xl p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl space-y-3 text-center md:text-left">
                <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  Free Digital Guide
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                  10 Healthy High-Protein Recipes You&apos;ll Actually Want to Eat
                </h2>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                  Discover delicious, easy-to-make recipes with simple ingredients, complete macros, and a grocery shopping checklist.
                </p>
              </div>

              <div className="flex-shrink-0">
                <Link
                  href="/free-recipes"
                  className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-sm sm:text-base px-7 py-3.5 rounded-full transition-all duration-200 shadow-md hover:scale-105"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Get My Free Ebook</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <NewsletterSection />
      </main>
      <Footer />
    </>
  )
}
