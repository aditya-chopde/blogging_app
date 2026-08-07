'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { AffiliateProduct } from '@/lib/posts'
import { Plus, Trash2, Save, Edit2, X, Star, ExternalLink, Check } from 'lucide-react'

function emptyProduct(): AffiliateProduct {
  return {
    id: '',
    name: '',
    image: '',
    description: '',
    benefits: [''],
    pros: [''],
    rating: 4.5,
    price: '',
    button: 'Check Price on Amazon',
    affiliate: '',
  }
}

function ProductForm({
  product,
  onChange,
  onSave,
  onCancel,
  saving,
}: {
  product: AffiliateProduct
  onChange: (p: AffiliateProduct) => void
  onSave: () => void
  onCancel: () => void
  saving: boolean
}) {
  const updateList = (field: 'benefits' | 'pros', idx: number, val: string) => {
    const arr = [...(product[field] ?? [])]
    arr[idx] = val
    onChange({ ...product, [field]: arr })
  }
  const addItem = (field: 'benefits' | 'pros') =>
    onChange({ ...product, [field]: [...(product[field] ?? []), ''] })
  const removeItem = (field: 'benefits' | 'pros', idx: number) =>
    onChange({ ...product, [field]: (product[field] ?? []).filter((_, j) => j !== idx) })

  const field = (label: string, key: keyof AffiliateProduct, type = 'text', placeholder = '') => (
    <div>
      <label className="text-xs font-medium text-muted-foreground block mb-1">{label}</label>
      <input
        type={type}
        value={String(product[key] ?? '')}
        onChange={(e) => onChange({ ...product, [key]: type === 'number' ? parseFloat(e.target.value) : e.target.value })}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  )

  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field('Product ID *', 'id', 'text', 'e.g. optimum-whey')}
        {field('Product Name *', 'name', 'text', 'e.g. Optimum Nutrition Gold Standard Whey')}
        {field('Image URL *', 'image', 'text', 'https://...')}
        {field('Price *', 'price', 'text', 'e.g. $54.99')}
        {field('Rating (0–5)', 'rating', 'number', '4.5')}
        {field('Button Text', 'button', 'text', 'Check Price on Amazon')}
        {field('Affiliate Link *', 'affiliate', 'url', 'https://amazon.com/dp/...')}
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1">Description</label>
        <textarea
          value={product.description ?? ''}
          onChange={(e) => onChange({ ...product, description: e.target.value })}
          placeholder="Short product description…"
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Benefits */}
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-2">Benefits (shown as checklist)</label>
        <div className="flex flex-col gap-2">
          {(product.benefits ?? []).map((b, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={b}
                onChange={(e) => updateList('benefits', i, e.target.value)}
                placeholder={`Benefit ${i + 1}`}
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button onClick={() => removeItem('benefits', i)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button onClick={() => addItem('benefits')} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 self-start transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add benefit
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-border">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving…' : 'Save Product'}
        </button>
        <button onClick={onCancel} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-xl hover:bg-muted transition-colors">
          <X className="w-4 h-4" /> Cancel
        </button>
      </div>
    </div>
  )
}

export default function AffiliatesClient({ initialAffiliates }: { initialAffiliates: AffiliateProduct[] }) {
  const [affiliates, setAffiliates] = useState(initialAffiliates)
  const [editing, setEditing] = useState<string | null>(null)
  const [editData, setEditData] = useState<AffiliateProduct | null>(null)
  const [adding, setAdding] = useState(false)
  const [newProduct, setNewProduct] = useState<AffiliateProduct>(emptyProduct())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const saveAll = async (updated: AffiliateProduct[]) => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/save-affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error ?? 'Save failed.')
      } else {
        setAffiliates(updated)
      }
    } catch {
      setError('Network error.')
    } finally {
      setSaving(false)
    }
  }

  const handleAdd = async () => {
    if (!newProduct.id || !newProduct.name) { setError('ID and Name are required.'); return }
    if (affiliates.find((a) => a.id === newProduct.id)) { setError('A product with this ID already exists.'); return }
    await saveAll([...affiliates, newProduct])
    setAdding(false)
    setNewProduct(emptyProduct())
  }

  const handleEdit = async () => {
    if (!editData) return
    const updated = affiliates.map((a) => (a.id === editData.id ? editData : a))
    await saveAll(updated)
    setEditing(null)
    setEditData(null)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    const updated = affiliates.filter((a) => a.id !== id)
    await saveAll(updated)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Affiliate Products</h1>
          <p className="text-muted-foreground text-sm mt-1">{affiliates.length} products in your catalog</p>
        </div>
        {!adding && (
          <button
            onClick={() => { setAdding(true); setEditing(null) }}
            className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-destructive/10 text-destructive text-sm rounded-xl">{error}</div>
      )}

      {/* Add new product form */}
      {adding && (
        <div className="mb-6">
          <h2 className="font-semibold text-foreground mb-3">New Product</h2>
          <ProductForm
            product={newProduct}
            onChange={setNewProduct}
            onSave={handleAdd}
            onCancel={() => { setAdding(false); setNewProduct(emptyProduct()) }}
            saving={saving}
          />
        </div>
      )}

      {/* Products list */}
      <div className="grid grid-cols-1 gap-4">
        {affiliates.map((product) => (
          <div key={product.id}>
            {editing === product.id && editData ? (
              <ProductForm
                product={editData}
                onChange={setEditData}
                onSave={handleEdit}
                onCancel={() => { setEditing(null); setEditData(null) }}
                saving={saving}
              />
            ) : (
              <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 group">
                {/* Thumbnail */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
                  {product.image ? (
                    <Image src={product.image} alt={product.name} fill sizes="64px" className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No img</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap">
                    <span className="font-semibold text-foreground text-sm">{product.name}</span>
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-mono">{product.id}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm font-bold text-foreground">{product.price}</span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">{product.rating}</span>
                    </div>
                    {product.benefits.length > 0 && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        {product.benefits.length} benefits
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {product.affiliate && (
                    <a
                      href={product.affiliate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      aria-label="Open affiliate link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => { setEditing(product.id); setEditData({ ...product }); setAdding(false) }}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    aria-label="Edit product"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    disabled={saving}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                    aria-label="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
