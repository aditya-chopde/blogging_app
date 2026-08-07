import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, User, Tag, ChevronRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ReadingProgress from '@/components/ReadingProgress'
import ContentRenderer from '@/components/ContentRenderer'
import ArticleCard from '@/components/ArticleCard'
import NewsletterSection from '@/components/NewsletterSection'
import ShareButtons from '@/components/ShareButtons'
import PinterestSaveButton from '@/components/PinterestSaveButton'
import { getPostBySlug, getAllSlugs, getRelatedPosts } from '@/lib/posts'
import { getAllAffiliates } from '@/lib/affiliates'
import { buildBlogSchema, buildFAQSchema } from '@/lib/seo'

const CATEGORY_LABELS: Record<string, string> = {
  'healthy-recipes': 'Healthy Recipes',
  'meal-plans': 'Meal Plans',
  'healthy-foods': 'Healthy Foods',
  'workout-plans': 'Workout Plans',
  'workouts': 'Workouts',
  'workout-gear': 'Workout Gear',
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.seo?.title ?? post.title,
    description: post.seo?.description ?? post.description,
    openGraph: {
      title: post.seo?.title ?? post.title,
      description: post.seo?.description ?? post.description,
      images: [{ url: post.coverImage }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo?.title ?? post.title,
      description: post.seo?.description ?? post.description,
      images: [post.coverImage],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const affiliates = getAllAffiliates()
  const affiliatesMap = Object.fromEntries(affiliates.map((a) => [a.id, a]))
  const relatedPosts = getRelatedPosts(post.relatedSlugs ?? [])
  const categoryLabel = CATEGORY_LABELS[post.category] ?? post.category

  const blogSchema = buildBlogSchema(post)
  const faqBlock = post.content.find((b) => b.type === 'faq')
  const faqSchema =
    faqBlock && faqBlock.items && faqBlock.items.length > 0
      ? buildFAQSchema(faqBlock.items as { question: string; answer: string }[])
      : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <ReadingProgress />
      <Navbar />
      <main className="pt-20">
        {/* Hero image */}
        <div className="relative h-64 sm:h-96 w-full overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Article layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
            {/* Main article */}
            <article>
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-5 flex-wrap">
                <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/category/${post.category}`} className="hover:text-foreground transition-colors capitalize">
                  {categoryLabel}
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-foreground line-clamp-1">{post.title}</span>
              </nav>

              {/* Category + meta */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Link
                  href={`/category/${post.category}`}
                  className="text-xs font-semibold px-3 py-1 rounded-full bg-accent text-accent-foreground hover:bg-accent/80 transition-colors"
                >
                  {categoryLabel}
                </Link>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" /> {post.readingTime}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="w-3 h-3" /> {post.author}
                </span>
                <time dateTime={post.date} className="text-xs text-muted-foreground">
                  {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight text-balance mb-4">
                {post.title}
              </h1>

              {/* Description */}
              <p className="text-base text-muted-foreground leading-relaxed mb-6 border-l-4 border-accent pl-4 italic">
                {post.description}
              </p>

              {/* Share top */}
              <div className="mb-8 pb-6 border-b border-border">
                <ShareButtons url={`/blog/${post.slug}`} title={post.title} imageUrl={post.coverImage} />
              </div>

              {/* Content */}
              <ContentRenderer blocks={post.content} affiliatesMap={affiliatesMap} />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/search?q=${encodeURIComponent(tag)}`}
                        className="text-xs px-3 py-1 rounded-full bg-secondary hover:bg-accent/60 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Share bottom */}
              <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <ShareButtons url={`/blog/${post.slug}`} title={post.title} imageUrl={post.coverImage} />
                <PinterestSaveButton
                  url={`https://healthyworm.com/blog/${post.slug}`}
                  imageUrl={post.coverImage}
                  description={post.pinterest?.description ?? post.title}
                />
              </div>
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 flex flex-col gap-6">
                {/* About */}
                <div className="bg-card border border-border rounded-2xl p-5">
                  <h3 className="font-serif text-base font-bold text-foreground mb-3">About {post.author}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Expert contributor at Healthy Worm. Passionate about evidence-based nutrition and fitness.
                  </p>
                </div>

                {/* Related in category */}
                {relatedPosts.length > 0 && (
                  <div className="bg-card border border-border rounded-2xl p-5">
                    <h3 className="font-serif text-base font-bold text-foreground mb-4">Related Articles</h3>
                    <div className="flex flex-col gap-4">
                      {relatedPosts.slice(0, 3).map((rp) => (
                        <ArticleCard key={rp.slug} post={rp} variant="compact" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Pinterest save */}
                <div className="bg-[#E60023]/5 border border-[#E60023]/20 rounded-2xl p-5 text-center">
                  <p className="text-sm font-medium text-foreground mb-3">Love this article?</p>
                  <PinterestSaveButton
                    url={`https://healthyworm.com/blog/${post.slug}`}
                    imageUrl={post.coverImage}
                    description={post.pinterest?.description ?? post.title}
                    className="w-full justify-center"
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Related posts grid */}
        {relatedPosts.length > 0 && (
          <section aria-labelledby="related-heading" className="bg-secondary/40 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <h2 id="related-heading" className="font-serif text-2xl font-bold text-foreground mb-6">
                You Might Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((rp) => (
                  <ArticleCard key={rp.slug} post={rp} />
                ))}
              </div>
            </div>
          </section>
        )}

        <NewsletterSection />
      </main>
      <Footer />
    </>
  )
}
