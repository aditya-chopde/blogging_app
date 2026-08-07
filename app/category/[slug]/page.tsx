import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'
import NewsletterSection from '@/components/NewsletterSection'
import { getPostsByCategory, getAllCategories, CATEGORY_META } from '@/lib/posts'

export async function generateStaticParams() {
  return getAllCategories().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const meta = CATEGORY_META[slug]
  if (!meta) return {}
  return {
    title: `${meta.label} — Healthy Worm`,
    description: meta.description,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const meta = CATEGORY_META[slug]
  if (!meta) notFound()

  const posts = getPostsByCategory(slug).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Category hero */}
        <div className="bg-accent/40 border-b border-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground">{meta.label}</span>
            </nav>
            <div className="flex items-center gap-4">
              <span className="text-5xl" role="img" aria-hidden="true">{meta.icon}</span>
              <div>
                <h1 className="font-serif text-4xl font-bold text-foreground">{meta.label}</h1>
                <p className="text-muted-foreground mt-1">{meta.description}</p>
                <p className="text-xs text-muted-foreground mt-2">{posts.length} article{posts.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No articles yet in this category.</p>
              <Link href="/" className="mt-4 inline-block text-sm text-primary hover:underline">Back to Home</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <ArticleCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>

        <NewsletterSection />
      </main>
      <Footer />
    </>
  )
}
