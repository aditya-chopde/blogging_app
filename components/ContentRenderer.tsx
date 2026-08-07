import type { ContentBlock, AffiliateProduct } from '@/lib/posts'
import AffiliateCard from './AffiliateCard'
import Image from 'next/image'
import { Info, Lightbulb, AlertTriangle, CheckCircle, ChevronDown } from 'lucide-react'

interface ContentRendererProps {
  blocks: ContentBlock[]
  affiliatesMap: Record<string, AffiliateProduct>
}

const CALLOUT_STYLES = {
  info: {
    bg: 'bg-blue-50 border-blue-200',
    icon: <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />,
    text: 'text-blue-900',
  },
  tip: {
    bg: 'bg-green-50 border-green-200',
    icon: <Lightbulb className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5" />,
    text: 'text-green-900',
  },
  warning: {
    bg: 'bg-amber-50 border-amber-200',
    icon: <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />,
    text: 'text-amber-900',
  },
  success: {
    bg: 'bg-emerald-50 border-emerald-200',
    icon: <CheckCircle className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />,
    text: 'text-emerald-900',
  },
}

export default function ContentRenderer({ blocks, affiliatesMap }: ContentRendererProps) {
  return (
    <div className="prose-content">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p key={idx} className="text-base text-foreground leading-relaxed mb-5">
                {block.text}
              </p>
            )

          case 'heading': {
            const level = block.level ?? 2
            const classes =
              level === 2
                ? 'font-serif text-2xl sm:text-3xl font-bold text-foreground mt-10 mb-4'
                : level === 3
                ? 'font-serif text-xl font-bold text-foreground mt-8 mb-3'
                : 'font-serif text-lg font-semibold text-foreground mt-6 mb-2'
            if (level === 2)
              return <h2 key={idx} className={classes}>{block.text}</h2>
            if (level === 3)
              return <h3 key={idx} className={classes}>{block.text}</h3>
            return <h4 key={idx} className={classes}>{block.text}</h4>
          }

          case 'list': {
            const Tag = block.style === 'ol' ? 'ol' : 'ul'
            const listClass =
              block.style === 'ol'
                ? 'list-decimal list-outside ml-5 mb-5 flex flex-col gap-1.5'
                : 'list-disc list-outside ml-5 mb-5 flex flex-col gap-1.5'
            const items = (block.items ?? []) as string[]
            return (
              <Tag key={idx} className={listClass}>
                {items.map((item, i) => (
                  <li key={i} className="text-base text-foreground leading-relaxed pl-1">
                    {item}
                  </li>
                ))}
              </Tag>
            )
          }

          case 'callout': {
            const style = (block.variant && CALLOUT_STYLES[block.variant as keyof typeof CALLOUT_STYLES]) ?? CALLOUT_STYLES.info
            return (
              <div
                key={idx}
                className={`flex gap-3 items-start border rounded-xl px-4 py-3.5 mb-5 ${style.bg}`}
              >
                {style.icon}
                <p className={`text-sm leading-relaxed ${style.text}`}>{block.text}</p>
              </div>
            )
          }

          case 'affiliate_card': {
            if (!block.productId) return null
            const product = affiliatesMap[block.productId]
            if (!product) return null
            return <AffiliateCard key={idx} product={product} />
          }

          case 'faq': {
            const faqs = (block.items ?? []) as { question: string; answer: string }[]
            if (!faqs.length) return null
            return (
              <div key={idx} className="my-8">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
                <div className="border border-border rounded-2xl overflow-hidden divide-y divide-border">
                  {faqs.map((faq, i) => (
                    <details key={i} className="group">
                      <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none select-none hover:bg-muted/50 transition-colors">
                        <span className="font-medium text-foreground text-sm leading-snug pr-4">{faq.question}</span>
                        <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="px-5 pb-4 pt-1">
                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )
          }

          case 'image':
            if (!block.src) return null
            return (
              <figure key={idx} className="my-6">
                <div className="relative rounded-xl overflow-hidden aspect-video bg-muted">
                  <Image
                    src={block.src}
                    alt={block.alt ?? ''}
                    fill
                    sizes="(max-width: 768px) 100vw, 700px"
                    className="object-cover"
                  />
                </div>
                {block.caption && (
                  <figcaption className="text-xs text-muted-foreground text-center mt-2">{block.caption}</figcaption>
                )}
              </figure>
            )

          case 'youtube':
            if (!block.videoId) return null
            return (
              <div key={idx} className="my-6 aspect-video rounded-xl overflow-hidden bg-muted">
                <iframe
                  src={`https://www.youtube.com/embed/${block.videoId}`}
                  title={block.caption ?? 'Video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            )

          default:
            return null
        }
      })}
    </div>
  )
}
