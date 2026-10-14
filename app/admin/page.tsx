import { getAllPosts, getAllCategories, CATEGORY_META } from '@/lib/posts'
import { getAllSubscribers } from '@/lib/subscribers'
import Link from 'next/link'
import {
  PenSquare,
  FileText,
  ShoppingBag,
  TrendingUp,
  ArrowRight,
  Clock,
  Users,
  Download,
  MailCheck,
  CheckCircle2,
  FileCheck,
  ExternalLink,
} from 'lucide-react'

export default function AdminDashboardPage() {
  const posts = getAllPosts()
  const categories = getAllCategories()
  const subscribers = getAllSubscribers().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const totalPosts = posts.length
  const featuredCount = posts.filter((p) => p.featured).length
  const categoryCounts = categories.map((cat) => ({
    ...CATEGORY_META[cat],
    slug: cat,
    count: posts.filter((p) => p.category === cat).length,
  }))

  const recentPosts = posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const totalLeads = subscribers.length
  const deliveredEbooks = subscribers.filter((s) => s.ebookDeliveryStatus === 'delivered').length
  const totalDownloads = subscribers.reduce((acc, s) => acc + (s.downloadCount || 0), 0)
  const consentedCount = subscribers.filter((s) => s.marketingConsent && !s.unsubscribedAt).length

  const stats = [
    { label: 'Total Articles', value: totalPosts, icon: FileText, color: 'bg-blue-50 text-blue-700' },
    { label: 'Ebook Leads', value: totalLeads, icon: Users, color: 'bg-emerald-50 text-emerald-700' },
    { label: 'PDFs Delivered', value: deliveredEbooks, icon: MailCheck, color: 'bg-amber-50 text-amber-700' },
    { label: 'PDF Downloads', value: totalDownloads, icon: Download, color: 'bg-purple-50 text-purple-700' },
  ]

  // Recent ebook leads
  const recentLeads = subscribers.slice(0, 10)

  return (
    <div className="p-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Overview of your Healthy Worm blog and lead generation</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/free-recipes"
            target="_blank"
            className="flex items-center gap-2 bg-card border border-border hover:bg-muted text-foreground font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-emerald-600" />
            <span>View Landing Page</span>
          </Link>
          <Link
            href="/admin/editor"
            className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
          >
            <PenSquare className="w-4 h-4" />
            <span>New Post</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 shadow-2xs">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold font-serif text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground font-medium">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* PROMINENT SECTION: Users Who Added Email & Got Ebook PDF */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-border gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-foreground">
                Users Who Added Email &amp; Received Ebook PDF
              </h2>
              <p className="text-xs text-muted-foreground">
                Real-time log of visitors who signed up for the 10 Healthy High-Protein Recipes guide.
              </p>
            </div>
          </div>

          <Link
            href="/admin/subscribers"
            className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>Manage All ({totalLeads})</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/30 border-b border-border text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-6">User / Email</th>
                <th className="py-3 px-4">Ebook PDF Status</th>
                <th className="py-3 px-4">Download Activity</th>
                <th className="py-3 px-4">Marketing Consent</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-6 text-right">Requested At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-muted-foreground text-sm">
                    No ebook requests recorded yet. Visitors who submit the form on{' '}
                    <Link href="/free-recipes" className="text-primary underline">
                      /free-recipes
                    </Link>{' '}
                    will appear here automatically!
                  </td>
                </tr>
              ) : (
                recentLeads.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted/20 transition-colors">
                    {/* User */}
                    <td className="py-3.5 px-6">
                      <div className="font-semibold text-foreground">{sub.email}</div>
                      {sub.firstName ? (
                        <div className="text-xs text-muted-foreground">{sub.firstName}</div>
                      ) : (
                        <div className="text-xs text-muted-foreground/60 italic">No name provided</div>
                      )}
                    </td>

                    {/* Ebook Delivery Status */}
                    <td className="py-3.5 px-4">
                      {sub.ebookDeliveryStatus === 'delivered' ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Delivered (PDF Attached)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          <span>Pending</span>
                        </span>
                      )}
                    </td>

                    {/* Download Activity */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Download className="w-3.5 h-3.5 text-purple-600" />
                        {sub.downloadCount > 0 ? (
                          <span className="font-semibold text-foreground">
                            Downloaded {sub.downloadCount}x
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Sent in Email</span>
                        )}
                      </div>
                    </td>

                    {/* Marketing Consent */}
                    <td className="py-3.5 px-4">
                      {sub.unsubscribedAt ? (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          Unsubscribed
                        </span>
                      ) : sub.marketingConsent ? (
                        <span className="text-xs font-medium text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                          Yes (Opt-in)
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          Ebook Only
                        </span>
                      )}
                    </td>

                    {/* Source */}
                    <td className="py-3.5 px-4">
                      <span className="text-xs bg-secondary/80 text-foreground px-2 py-0.5 rounded font-mono">
                        {sub.source}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-6 text-right text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Recent Articles & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent posts */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden shadow-2xs">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Recent Blog Articles</h2>
            <Link href="/admin/posts" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentPosts.map((post) => (
              <div key={post.slug} className="flex items-center justify-between px-6 py-3 hover:bg-muted/40 transition-colors group">
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
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xs">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Posts by Category</h2>
          </div>
          <div className="p-6 flex flex-col gap-3.5">
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
