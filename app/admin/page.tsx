import { getAllPosts, getAllCategories, CATEGORY_META } from '@/lib/posts'
import Link from 'next/link'
import { PenSquare, FileText, ShoppingBag, TrendingUp, ArrowRight, Clock } from 'lucide-react'

export default function AdminDashboardPage() {
  const posts = getAllPosts()
  const categories = getAllCategories()

  const totalPosts = posts.length
  const featuredCount = posts.filter((p) => p.featured).length
  const categoryCounts = categories.map((cat) => ({
    ...CATEGORY_META[cat],
    slug: cat,
    count: posts.filter((p) => p.category === cat).length,
  }))

  const recentPosts = posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8)

  const stats = [
    { label: 'Total Articles', value: totalPosts, icon: FileText, color: 'bg-blue-50 text-blue-700' },
    { label: 'Featured', value: featuredCount, icon: TrendingUp, color: 'bg-amber-50 text-amber-700' },
    { label: 'Categories', value: categories.length, icon: ShoppingBag, color: 'bg-green-50 text-green-700' },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Overview of your Healthy Worm blog</p>
        </div>
        <Link
          href="/admin/editor"
          className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
        >
          <PenSquare className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold font-serif text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent posts */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Recent Posts</h2>
            <Link href="/admin/posts" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentPosts.map((post) => (
              <div key={post.slug} className="flex items-center justify-between px-5 py-3 hover:bg-muted/40 transition-colors group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{post.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground capitalize">{post.category.replace(/-/g, ' ')}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {post.featured && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">Featured</span>
                    )}
                  </div>
                </div>
                <Link
                  href={`/admin/editor?slug=${post.slug}`}
                  className="ml-3 text-xs text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1"
                >
                  Edit <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Posts by Category</h2>
          </div>
          <div className="p-5 flex flex-col gap-3">
            {categoryCounts.map((cat) => (
              <div key={cat.slug} className="flex items-center gap-3">
                <span className="text-xl" role="img" aria-hidden="true">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-foreground">{cat.label}</span>
                    <span className="text-xs text-muted-foreground">{cat.count}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/40 rounded-full transition-all"
                      style={{ width: `${totalPosts ? (cat.count / totalPosts) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
