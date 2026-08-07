import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import type { PostMeta } from '@/lib/posts'

interface HeroSectionProps {
  featuredPost: PostMeta
}

export default function HeroSection({ featuredPost }: HeroSectionProps) {
  return (
    <section aria-label="Featured article" className="pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden min-h-[480px] sm:min-h-[560px] flex items-end">
          {/* Background image */}
          <Image
            src={featuredPost.coverImage}
            alt={featuredPost.title}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Content */}
          <div className="relative z-10 p-6 sm:p-10 w-full">
            <div className="max-w-2xl">
              <span className="inline-block bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full mb-4">
                Featured
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight text-balance mb-4">
                {featuredPost.title}
              </h1>
              <p className="text-white/80 text-base leading-relaxed mb-6 line-clamp-2 hidden sm:block">
                {featuredPost.description}
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-sm px-5 py-2.5 rounded-full transition-all duration-200 hover:gap-3"
                >
                  Read Article
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-white/60 text-sm">{featuredPost.readingTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
