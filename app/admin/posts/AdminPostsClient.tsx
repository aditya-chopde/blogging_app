'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Post } from '@/lib/posts'
import { PenSquare, Trash2, Search, Eye, Clock, Star } from 'lucide-react'

const CATEGORY_LABELS: Record<string, string> = {
  'healthy-recipes': 'Healthy Recipes',
  'meal-plans': 'Meal Plans',
  'healthy-foods': 'Healthy Foods',
  'workout-plans': 'Workout Plans',
  workouts: 'Workouts',
  'workout-gear': 'Workout Gear',
}

interface AdminPostsClientProps {
  posts: Post[]
}

export default function AdminPostsClient({ posts: initialPosts }: AdminPostsClientProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()

  const filtered = posts.filter((p) => {
    const matchQ =
      !query.trim() ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.slug.toLowerCase().includes(query.toLowerCase())
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter
    return matchQ && matchCat
  })

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(slug)
    try {
      const res = await fetch('/api/admin/delete-article', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.slug !== slug))
        router.refresh()
      } else {
        alert('Failed to delete article.')
      }
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">All Posts</h1>
          <p className="text-muted-foreground text-sm mt-1">{posts.length} articles total</p>
        </div>
        <Link
          href="/admin/editor"
          className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
        >
          <PenSquare className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts…"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All categories</option>
          {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-5 py-3 font-semibold text-foreground">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground hidden md:table-cell">Date</th>
                <th className="text-center px-4 py-3 font-semibold text-foreground hidden md:table-cell">Featured</th>
                <th className="text-right px-5 py-3 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((post) => (
                <tr key={post.slug} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-5 py-3">
                    <div>
                      <p className="font-medium text-foreground line-clamp-1">{post.title}</p>
                      <p className="text-xs text-muted-foreground">{post.slug}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full capitalize">
                      {CATEGORY_LABELS[post.category] ?? post.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center hidden md:table-cell">
                    {post.featured && <Star className="w-4 h-4 fill-amber-400 text-amber-400 mx-auto" />}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        aria-label="View article"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/editor?slug=${post.slug}`}
                        aria-label="Edit article"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <PenSquare className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.slug, post.title)}
                        disabled={deleting === post.slug}
                        aria-label="Delete article"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-muted-foreground text-sm">
                    No posts match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
