'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ArticleCard from '@/components/ArticleCard'
import type { Post } from '@/lib/posts'
import { Search, X } from 'lucide-react'

interface SearchClientProps {
  allPosts: Post[]
}

export default function SearchClient({ allPosts }: SearchClientProps) {
  const searchParams = useSearchParams()
  const initialQ = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(initialQ)

  useEffect(() => {
    const q = searchParams.get('q')
    if (q !== null) {
      setQuery(q)
    }
  }, [searchParams])

  const results = useMemo(() => {
    if (!query.trim()) return allPosts
    const q = query.toLowerCase()
    return allPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.category.replace(/-/g, ' ').toLowerCase().includes(q),
    )
  }, [query, allPosts])

  return (
    <>
      {/* Search input */}
      <div className="relative max-w-xl mx-auto mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search healthy recipes, workouts, meal plans…"
          className="w-full pl-12 pr-10 py-3.5 rounded-full border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring shadow-sm"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Result count */}
      <p className="text-sm text-muted-foreground mb-6 text-center">
        {query.trim()
          ? `${results.length} result${results.length !== 1 ? 's' : ''} for &ldquo;${query}&rdquo;`
          : `Showing all ${results.length} articles`}
      </p>

      {/* Results grid */}
      {results.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">No articles found for &ldquo;{query}&rdquo;</p>
          <button
            onClick={() => setQuery('')}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </>
  )
}
