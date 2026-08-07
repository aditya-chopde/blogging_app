import Image from 'next/image'
import { Star, ExternalLink, Check } from 'lucide-react'
import type { AffiliateProduct } from '@/lib/posts'

interface AffiliateCardProps {
  product: AffiliateProduct
}

export default function AffiliateCard({ product }: AffiliateCardProps) {
  return (
    <div className="my-8 rounded-2xl border-2 border-accent bg-card overflow-hidden shadow-sm">
      {/* Header badge */}
      <div className="bg-accent px-4 py-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-accent-foreground uppercase tracking-wide">Our Top Pick</span>
        <span className="text-xs text-muted-foreground">Affiliate link — we may earn a commission</span>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Image */}
          <div className="relative w-full sm:w-36 h-36 flex-shrink-0 rounded-xl overflow-hidden bg-muted">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, 144px"
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <h3 className="font-serif text-lg font-bold text-foreground leading-snug">{product.name}</h3>
              <div className="flex items-center gap-1 flex-shrink-0">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-muted'}`}
                  />
                ))}
                <span className="text-sm font-semibold text-foreground ml-1">{product.rating}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mt-2">{product.description}</p>

            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1">
                {product.benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-xs text-foreground">
                    <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {/* Price + CTA */}
            <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
              <span className="text-xl font-bold text-foreground">{product.price}</span>
              <a
                href={product.affiliate}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm px-5 py-2.5 rounded-full transition-colors"
              >
                {product.button}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
