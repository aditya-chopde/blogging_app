'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Post, ContentBlock, AffiliateProduct } from '@/lib/posts'
import {
  Save, Plus, Trash2, GripVertical, ChevronDown, ChevronUp,
  Type, AlignLeft, List, Quote, AlertCircle, HelpCircle, ShoppingCart, Video, Image as ImageIcon
} from 'lucide-react'

const CATEGORIES = [
  { value: 'healthy-recipes', label: 'Healthy Recipes' },
  { value: 'meal-plans', label: 'Meal Plans' },
  { value: 'healthy-foods', label: 'Healthy Foods' },
  { value: 'workout-plans', label: 'Workout Plans' },
  { value: 'workouts', label: 'Workouts' },
  { value: 'workout-gear', label: 'Workout Gear' },
]

const BLOCK_TYPES = [
  { type: 'paragraph', label: 'Paragraph', icon: AlignLeft },
  { type: 'heading', label: 'Heading', icon: Type },
  { type: 'list', label: 'List', icon: List },
  { type: 'callout', label: 'Callout', icon: AlertCircle },
  { type: 'faq', label: 'FAQ', icon: HelpCircle },
  { type: 'affiliate_card', label: 'Affiliate', icon: ShoppingCart },
  { type: 'image', label: 'Image', icon: ImageIcon },
  { type: 'youtube', label: 'YouTube', icon: Video },
] as const

function emptyBlock(type: ContentBlock['type']): ContentBlock {
  switch (type) {
    case 'paragraph': return { type: 'paragraph', text: '' }
    case 'heading': return { type: 'heading', level: 2, text: '' }
    case 'list': return { type: 'list', style: 'ul', items: [''] }
    case 'callout': return { type: 'callout', variant: 'info', text: '' }
    case 'faq': return { type: 'faq', items: [{ question: '', answer: '' }] }
    case 'affiliate_card': return { type: 'affiliate_card', productId: '' }
    case 'image': return { type: 'image', src: '', alt: '', caption: '' }
    case 'youtube': return { type: 'youtube', videoId: '', caption: '' }
    default: return { type: 'paragraph', text: '' }
  }
}

function defaultPost(): Partial<Post> {
  return {
    title: '',
    slug: '',
    description: '',
    coverImage: '',
    category: 'healthy-recipes',
    date: new Date().toISOString().split('T')[0],
    author: 'Dr. Emma Torres',
    readingTime: '5 min read',
    tags: [],
    featured: false,
    seo: { title: '', description: '' },
    pinterest: { title: '', description: '' },
    content: [],
    affiliateProducts: [],
    relatedSlugs: [],
  }
}

interface AdminEditorClientProps {
  existingPost: Post | null
  affiliates: AffiliateProduct[]
}

// ---- Block Editors ----

function ParagraphBlock({ block, onChange }: { block: ContentBlock; onChange: (b: ContentBlock) => void }) {
  return (
    <textarea
      value={block.text ?? ''}
      onChange={(e) => onChange({ ...block, text: e.target.value })}
      placeholder="Write your paragraph…"
      rows={4}
      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-ring"
    />
  )
}

function HeadingBlock({ block, onChange }: { block: ContentBlock; onChange: (b: ContentBlock) => void }) {
  return (
    <div className="flex gap-2">
      <select
        value={block.level ?? 2}
        onChange={(e) => onChange({ ...block, level: Number(e.target.value) })}
        className="px-2 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none"
      >
        <option value={2}>H2</option>
        <option value={3}>H3</option>
        <option value={4}>H4</option>
      </select>
      <input
        value={block.text ?? ''}
        onChange={(e) => onChange({ ...block, text: e.target.value })}
        placeholder="Heading text…"
        className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  )
}

function ListBlock({ block, onChange }: { block: ContentBlock; onChange: (b: ContentBlock) => void }) {
  const items = (block.items ?? []) as string[]
  const updateItem = (i: number, val: string) => {
    const next = [...items]; next[i] = val; onChange({ ...block, items: next })
  }
  const addItem = () => onChange({ ...block, items: [...items, ''] })
  const removeItem = (i: number) => onChange({ ...block, items: items.filter((_, j) => j !== i) })

  return (
    <div className="flex flex-col gap-2">
      <select
        value={block.style ?? 'ul'}
        onChange={(e) => onChange({ ...block, style: e.target.value as 'ul' | 'ol' })}
        className="w-24 px-2 py-1.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none"
      >
        <option value="ul">Bullet</option>
        <option value="ol">Numbered</option>
      </select>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={item}
            onChange={(e) => updateItem(i, e.target.value)}
            placeholder={`Item ${i + 1}`}
            className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button onClick={() => removeItem(i)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button onClick={addItem} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors self-start">
        <Plus className="w-3.5 h-3.5" /> Add item
      </button>
    </div>
  )
}

function CalloutBlock({ block, onChange }: { block: ContentBlock; onChange: (b: ContentBlock) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <select
        value={block.variant ?? 'info'}
        onChange={(e) => onChange({ ...block, variant: e.target.value as ContentBlock['variant'] })}
        className="w-28 px-2 py-1.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none"
      >
        <option value="info">Info</option>
        <option value="tip">Tip</option>
        <option value="warning">Warning</option>
      </select>
      <textarea
        value={block.text ?? ''}
        onChange={(e) => onChange({ ...block, text: e.target.value })}
        placeholder="Callout text…"
        rows={3}
        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  )
}

function FaqBlock({ block, onChange }: { block: ContentBlock; onChange: (b: ContentBlock) => void }) {
  const items = (block.items ?? []) as { question: string; answer: string }[]
  const update = (i: number, field: 'question' | 'answer', val: string) => {
    const next = items.map((item, j) => j === i ? { ...item, [field]: val } : item)
    onChange({ ...block, items: next })
  }
  const addFaq = () => onChange({ ...block, items: [...items, { question: '', answer: '' }] })
  const removeFaq = (i: number) => onChange({ ...block, items: items.filter((_, j) => j !== i) })

  return (
    <div className="flex flex-col gap-4">
      {items.map((faq, i) => (
        <div key={i} className="border border-border rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">FAQ {i + 1}</span>
            <button onClick={() => removeFaq(i)} className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <input
            value={faq.question}
            onChange={(e) => update(i, 'question', e.target.value)}
            placeholder="Question"
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <textarea
            value={faq.answer}
            onChange={(e) => update(i, 'answer', e.target.value)}
            placeholder="Answer"
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      ))}
      <button onClick={addFaq} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors self-start">
        <Plus className="w-3.5 h-3.5" /> Add FAQ
      </button>
    </div>
  )
}

function AffiliateBlock({ block, onChange, affiliates }: { block: ContentBlock; onChange: (b: ContentBlock) => void; affiliates: AffiliateProduct[] }) {
  return (
    <select
      value={block.productId ?? ''}
      onChange={(e) => onChange({ ...block, productId: e.target.value })}
      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
    >
      <option value="">Select affiliate product…</option>
      {affiliates.map((a) => (
        <option key={a.id} value={a.id}>{a.name}</option>
      ))}
    </select>
  )
}

function ImageBlock({ block, onChange }: { block: ContentBlock; onChange: (b: ContentBlock) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <input value={block.src ?? ''} onChange={(e) => onChange({ ...block, src: e.target.value })} placeholder="Image URL" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
      <input value={block.alt ?? ''} onChange={(e) => onChange({ ...block, alt: e.target.value })} placeholder="Alt text (accessibility)" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
      <input value={block.caption ?? ''} onChange={(e) => onChange({ ...block, caption: e.target.value })} placeholder="Caption (optional)" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
    </div>
  )
}

function YouTubeBlock({ block, onChange }: { block: ContentBlock; onChange: (b: ContentBlock) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <input value={block.videoId ?? ''} onChange={(e) => onChange({ ...block, videoId: e.target.value })} placeholder="YouTube Video ID (e.g. dQw4w9WgXcQ)" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
      <input value={block.caption ?? ''} onChange={(e) => onChange({ ...block, caption: e.target.value })} placeholder="Caption (optional)" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
    </div>
  )
}

// ---- Main Block Item ----
function BlockItem({
  block, index, total, affiliates,
  onUpdate, onRemove, onMoveUp, onMoveDown
}: {
  block: ContentBlock; index: number; total: number; affiliates: AffiliateProduct[]
  onUpdate: (b: ContentBlock) => void; onRemove: () => void; onMoveUp: () => void; onMoveDown: () => void
}) {
  const [collapsed, setCollapsed] = useState(false)
  const Icon = BLOCK_TYPES.find((t) => t.type === block.type)?.icon ?? AlignLeft

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/30 border-b border-border">
        <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs font-medium text-foreground capitalize flex-1">{block.type.replace('_', ' ')}</span>
        <div className="flex items-center gap-1">
          <button disabled={index === 0} onClick={onMoveUp} className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"><ChevronUp className="w-3.5 h-3.5" /></button>
          <button disabled={index === total - 1} onClick={onMoveDown} className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"><ChevronDown className="w-3.5 h-3.5" /></button>
          <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors">
            {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
          <button onClick={onRemove} className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      </div>
      {!collapsed && (
        <div className="p-3">
          {block.type === 'paragraph' && <ParagraphBlock block={block} onChange={onUpdate} />}
          {block.type === 'heading' && <HeadingBlock block={block} onChange={onUpdate} />}
          {block.type === 'list' && <ListBlock block={block} onChange={onUpdate} />}
          {block.type === 'callout' && <CalloutBlock block={block} onChange={onUpdate} />}
          {block.type === 'faq' && <FaqBlock block={block} onChange={onUpdate} />}
          {block.type === 'affiliate_card' && <AffiliateBlock block={block} onChange={onUpdate} affiliates={affiliates} />}
          {block.type === 'image' && <ImageBlock block={block} onChange={onUpdate} />}
          {block.type === 'youtube' && <YouTubeBlock block={block} onChange={onUpdate} />}
        </div>
      )}
    </div>
  )
}

// ---- Main Editor ----
export default function AdminEditorClient({ existingPost, affiliates }: AdminEditorClientProps) {
  const router = useRouter()
  const [post, setPost] = useState<Partial<Post>>(existingPost ?? defaultPost())
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'content' | 'meta' | 'json'>('content')
  const [tagInput, setTagInput] = useState('')

  const isNew = !existingPost

  const update = useCallback((field: string, value: unknown) => {
    setPost((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }, [])

  const updateContent = useCallback((blocks: ContentBlock[]) => {
    setPost((prev) => ({ ...prev, content: blocks }))
    setSaved(false)
  }, [])

  const addBlock = (type: ContentBlock['type']) => {
    const blocks = [...(post.content ?? []), emptyBlock(type)]
    updateContent(blocks)
  }

  const updateBlock = (i: number, block: ContentBlock) => {
    const blocks = [...(post.content ?? [])]
    blocks[i] = block
    updateContent(blocks)
  }

  const removeBlock = (i: number) => {
    const blocks = (post.content ?? []).filter((_, j) => j !== i)
    updateContent(blocks)
  }

  const moveBlock = (i: number, dir: -1 | 1) => {
    const blocks = [...(post.content ?? [])]
    const j = i + dir
    if (j < 0 || j >= blocks.length) return
    ;[blocks[i], blocks[j]] = [blocks[j], blocks[i]]
    updateContent(blocks)
  }

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (!tag) return
    const existing = post.tags ?? []
    if (!existing.includes(tag)) {
      update('tags', [...existing, tag])
    }
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    update('tags', (post.tags ?? []).filter((t) => t !== tag))
  }

  const generateSlug = () => {
    const slug = (post.title ?? '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
    update('slug', slug)
  }

  const handleSave = async () => {
    if (!post.title || !post.slug || !post.category) {
      setError('Title, slug, and category are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/save-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      })
      if (res.ok) {
        setSaved(true)
        if (isNew) router.push(`/admin/editor?slug=${post.slug}`)
        else router.refresh()
      } else {
        const data = await res.json()
        setError(data.error ?? 'Save failed.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            {isNew ? 'New Post' : 'Edit Post'}
          </h1>
          {post.slug && (
            <p className="text-xs text-muted-foreground mt-0.5">/{post.slug}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {post.slug && !isNew && (
            <a href={`/blog/${post.slug}`} target="_blank" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Preview →
            </a>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Post'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-destructive/10 text-destructive text-sm rounded-xl">{error}</div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-6">
        {(['content', 'meta', 'json'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'json' ? 'JSON Editor' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* === CONTENT TAB === */}
      {activeTab === 'content' && (
        <div className="flex flex-col gap-6">
          {/* Basic fields */}
          <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Title *</label>
              <input
                value={post.title ?? ''}
                onChange={(e) => update('title', e.target.value)}
                onBlur={() => { if (isNew && post.title && !post.slug) generateSlug() }}
                placeholder="Article title"
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground block mb-1.5">Slug *</label>
                <div className="flex gap-2">
                  <input
                    value={post.slug ?? ''}
                    onChange={(e) => update('slug', e.target.value)}
                    placeholder="url-slug-here"
                    className="flex-1 px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button onClick={generateSlug} className="text-xs px-3 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors">
                    Auto
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Category *</label>
                <select
                  value={post.category ?? 'healthy-recipes'}
                  onChange={(e) => update('category', e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Description</label>
              <textarea
                value={post.description ?? ''}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Brief description of the article"
                rows={2}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-foreground block mb-1.5">Cover Image URL</label>
                <input
                  value={post.coverImage ?? ''}
                  onChange={(e) => update('coverImage', e.target.value)}
                  placeholder="https://…"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Date</label>
                <input
                  type="date"
                  value={post.date ?? ''}
                  onChange={(e) => update('date', e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Reading Time</label>
                <input
                  value={post.readingTime ?? ''}
                  onChange={(e) => update('readingTime', e.target.value)}
                  placeholder="5 min read"
                  className="w-28 px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={post.featured ?? false}
                  onChange={(e) => update('featured', e.target.checked)}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm font-medium text-foreground">Featured article</span>
              </label>
            </div>
          </div>

          {/* Content builder */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Content Blocks</h2>
              <span className="text-xs text-muted-foreground">{(post.content ?? []).length} blocks</span>
            </div>

            <div className="flex flex-col gap-3 mb-4">
              {(post.content ?? []).map((block, i) => (
                <BlockItem
                  key={i}
                  block={block}
                  index={i}
                  total={(post.content ?? []).length}
                  affiliates={affiliates}
                  onUpdate={(b) => updateBlock(i, b)}
                  onRemove={() => removeBlock(i)}
                  onMoveUp={() => moveBlock(i, -1)}
                  onMoveDown={() => moveBlock(i, 1)}
                />
              ))}
            </div>

            {/* Add block buttons */}
            <div className="border-2 border-dashed border-border rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-3 text-center">Add a content block</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {BLOCK_TYPES.map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => addBlock(type)}
                    className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-border bg-card hover:bg-accent/60 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === META TAB === */}
      {activeTab === 'meta' && (
        <div className="flex flex-col gap-5">
          {/* SEO */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-semibold text-foreground mb-4">SEO Meta</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">SEO Title</label>
                <input
                  value={post.seo?.title ?? ''}
                  onChange={(e) => update('seo', { ...post.seo, title: e.target.value })}
                  placeholder="Optimized title for search engines"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Meta Description</label>
                <textarea
                  value={post.seo?.description ?? ''}
                  onChange={(e) => update('seo', { ...post.seo, description: e.target.value })}
                  placeholder="150–160 character description for Google"
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-xs text-muted-foreground mt-1">{(post.seo?.description ?? '').length}/160</p>
              </div>
            </div>
          </div>

          {/* Pinterest */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-semibold text-foreground mb-4">Pinterest</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Pin Title</label>
                <input
                  value={post.pinterest?.title ?? ''}
                  onChange={(e) => update('pinterest', { ...post.pinterest, title: e.target.value })}
                  placeholder="Pinterest pin title"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Pin Description</label>
                <textarea
                  value={post.pinterest?.description ?? ''}
                  onChange={(e) => update('pinterest', { ...post.pinterest, description: e.target.value })}
                  placeholder="Description shown when pinning this article"
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          {/* Author + Tags */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-semibold text-foreground mb-4">Author & Tags</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Author</label>
                <input
                  value={post.author ?? ''}
                  onChange={(e) => update('author', e.target.value)}
                  placeholder="Author name"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(post.tags ?? []).map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-xs bg-accent px-2.5 py-1 rounded-full text-accent-foreground">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-destructive transition-colors">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                    placeholder="Add tag and press Enter"
                    className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button onClick={addTag} className="px-3 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Related Article Slugs</label>
                <input
                  value={(post.relatedSlugs ?? []).join(', ')}
                  onChange={(e) => update('relatedSlugs', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                  placeholder="slug-one, slug-two, slug-three"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === JSON TAB === */}
      {activeTab === 'json' && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Edit the raw JSON directly. Changes here will overwrite the visual editor fields on save.
          </p>
          <textarea
            value={JSON.stringify(post, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value)
                setPost(parsed)
                setSaved(false)
              } catch {
                // allow partial edits without crashing
              }
            }}
            rows={30}
            spellCheck={false}
            className="w-full px-4 py-3 rounded-xl border border-border bg-muted font-mono text-xs text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      )}

      {/* Bottom save */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm px-6 py-3 rounded-xl transition-colors disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Post'}
        </button>
      </div>
    </div>
  )
}
