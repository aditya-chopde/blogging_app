'use client'

import { useState } from 'react'
import type { Subscriber } from '@/lib/subscribers'
import {
  Users,
  CheckCircle2,
  XCircle,
  Download,
  Search,
  RotateCw,
  Mail,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react'

interface AdminSubscribersClientProps {
  initialSubscribers: Subscriber[]
}

export default function AdminSubscribersClient({
  initialSubscribers,
}: AdminSubscribersClientProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'delivered' | 'consented' | 'unsubscribed' | 'failed'>('all')
  const [retryingId, setRetryingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const total = subscribers.length
  const consentedCount = subscribers.filter((s) => s.marketingConsent && !s.unsubscribedAt).length
  const consentRate = total > 0 ? Math.round((consentedCount / total) * 100) : 0
  const deliveredCount = subscribers.filter((s) => s.ebookDeliveryStatus === 'delivered').length
  const totalDownloads = subscribers.reduce((acc, s) => acc + (s.downloadCount || 0), 0)

  const filtered = subscribers.filter((s) => {
    const matchesSearch =
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.firstName && s.firstName.toLowerCase().includes(search.toLowerCase())) ||
      s.source.toLowerCase().includes(search.toLowerCase())

    if (!matchesSearch) return false

    if (filter === 'delivered') return s.ebookDeliveryStatus === 'delivered'
    if (filter === 'consented') return s.marketingConsent && !s.unsubscribedAt
    if (filter === 'unsubscribed') return Boolean(s.unsubscribedAt)
    if (filter === 'failed') return s.ebookDeliveryStatus === 'failed'
    return true
  })

  const handleRetry = async (subscriberId: string) => {
    setRetryingId(subscriberId)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'retry-delivery', subscriberId }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Retry failed')
      }

      setSubscribers((prev) =>
        prev.map((s) =>
          s.id === subscriberId
            ? { ...s, ebookDeliveryStatus: 'delivered', ebookDeliveredAt: new Date().toISOString() }
            : s
        )
      )
      setMessage({ type: 'success', text: 'Ebook delivery resent successfully!' })
    } catch (err: unknown) {
      const errText = err instanceof Error ? err.message : 'Error retrying delivery'
      setMessage({ type: 'error', text: errText })
    } finally {
      setRetryingId(null)
    }
  }

  const exportCsv = () => {
    const headers = [
      'Email',
      'First Name',
      'Marketing Consent',
      'Consent Timestamp',
      'Source',
      'Delivery Status',
      'Download Count',
      'Created At',
      'Unsubscribed At',
    ]

    const rows = filtered.map((s) => [
      `"${s.email}"`,
      `"${s.firstName || ''}"`,
      s.marketingConsent ? 'YES' : 'NO',
      `"${s.consentTimestamp || ''}"`,
      `"${s.source}"`,
      s.ebookDeliveryStatus,
      s.downloadCount,
      `"${s.createdAt}"`,
      `"${s.unsubscribedAt || ''}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `healthy-worm-leads-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Ebook Leads & Subscribers
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your recipe lead magnet subscribers, marketing consent, and automated delivery.
          </p>
        </div>

        <button
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="inline-flex items-center gap-2 bg-card border border-border hover:bg-muted text-foreground text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-xs disabled:opacity-50"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Export CSV</span>
        </button>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm flex items-center gap-2 border ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold font-serif text-foreground">{total}</div>
            <div className="text-xs text-muted-foreground">Total Ebook Requests</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold font-serif text-foreground">
              {consentedCount} <span className="text-sm font-sans font-normal text-muted-foreground">({consentRate}%)</span>
            </div>
            <div className="text-xs text-muted-foreground">Marketing Opt-ins</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold font-serif text-foreground">{deliveredCount}</div>
            <div className="text-xs text-muted-foreground">Emails Dispatched</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold font-serif text-foreground">{totalDownloads}</div>
            <div className="text-xs text-muted-foreground">PDF Ebook Downloads</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs mb-6">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted'
              }`}
            >
              All ({total})
            </button>
            <button
              onClick={() => setFilter('delivered')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'delivered'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted'
              }`}
            >
              PDF Delivered ({deliveredCount})
            </button>
            <button
              onClick={() => setFilter('consented')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'consented'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted'
              }`}
            >
              Marketing List ({consentedCount})
            </button>
            <button
              onClick={() => setFilter('failed')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'failed'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted'
              }`}
            >
              Failed Deliveries ({subscribers.filter((s) => s.ebookDeliveryStatus === 'failed').length})
            </button>
            <button
              onClick={() => setFilter('unsubscribed')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'unsubscribed'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted'
              }`}
            >
              Unsubscribed ({subscribers.filter((s) => Boolean(s.unsubscribedAt)).length})
            </button>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email, name, source…"
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

        </div>

        {/* Subscribers Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/30 border-b border-border text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5">Subscriber</th>
                <th className="py-3 px-4">Marketing Consent</th>
                <th className="py-3 px-4">Delivery Status</th>
                <th className="py-3 px-4">Downloads</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                    No subscribers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-medium text-foreground">{s.email}</div>
                      {s.firstName && (
                        <div className="text-xs text-muted-foreground">{s.firstName}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {s.unsubscribedAt ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full">
                          Unsubscribed
                        </span>
                      ) : s.marketingConsent ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          Consented
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full">
                          Ebook Only
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {s.ebookDeliveryStatus === 'delivered' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Sent
                        </span>
                      ) : s.ebookDeliveryStatus === 'failed' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600">
                          <XCircle className="w-3.5 h-3.5" />
                          Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{s.downloadCount || 0}</span> times
                    </td>

                    <td className="py-3.5 px-4 text-xs text-muted-foreground capitalize">
                      <span className="bg-secondary px-2 py-0.5 rounded-md text-foreground text-[11px]">
                        {s.source}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(s.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleRetry(s.id)}
                        disabled={retryingId === s.id}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-semibold p-1 hover:bg-accent/40 rounded transition-colors disabled:opacity-50"
                        title="Resend Ebook Delivery Email"
                      >
                        <RotateCw
                          className={`w-3.5 h-3.5 ${retryingId === s.id ? 'animate-spin' : ''}`}
                        />
                        <span>Resend</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
