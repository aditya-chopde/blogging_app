import Link from 'next/link'
import Image from 'next/image'
import { Clock, BookOpen } from 'lucide-react'
import type { PostMeta } from '@/lib/posts'
import PinterestSaveButton from './PinterestSaveButton'

const CATEGORY_LABELS: Record<string, string> = {
  'healthy-recipes': 'Healthy Recipes',
  'meal-plans': 'Meal Plans',
  'healthy-foods': 'Healthy Foods',
  'workout-plans': 'Workout Plans',
  'workouts': 'Workouts',
  'workout-gear': 'Workout Gear',
}

const CATEGORY_COLORS: Record<string, string> = {
  'healthy-recipes': 'bg-green-100 text-green-800',
  'meal-plans': 'bg-blue-100 text-blue-800',
  'healthy-foods': 'bg-amber-100 text-amber-800',
  'workout-plans': 'bg-purple-100 text-purple-800',
  'workouts': 'bg-red-100 text-red-800',
  'workout-gear': 'bg-slate-100 text-slate-700',
}

interface ArticleCardProps {
  post: PostMeta
  variant?: 'default' | 'featured' | 'compact'
}

export default function ArticleCard({ post, variant = 'default' }: ArticleCardProps) {
  const categoryLabel = CATEGORY_LABELS[post.category] ?? post.category
  const categoryColor = CATEGORY_COLORS[post.category] ?? 'bg-muted text-muted-foreground'

  if (variant === 'featured') {
    return (
      <article className="group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border">
        <Link href={`/blog/${post.slug}`} className="block">
          <div className="relative h-64 sm:h-72 overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute top-3 left-3">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColor}`}>
                {categoryLabel}
              </span>
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <h2 className="font-serif text-xl font-bold text-white leading-snug text-balance line-clamp-2">
                {post.title}
              </h2>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{post.description}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readingTime}
              </span>
              <span>{post.author}</span>
            </div>
          </div>
        </Link>
        <div className="absolute top-3 right-3">
          <PinterestSaveButton
            url={`https://healthyworm.com/blog/${post.slug}`}
            imageUrl={post.coverImage}
            description={post.title}
          />
        </div>
      </article>
    )
  }

  if (variant === 'compact') {
    return (
      <article className="group flex gap-3 items-start">
        <Link href={`/blog/${post.slug}`} className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-muted">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="80px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <span className="text-xs text-muted-foreground">{categoryLabel}</span>
          <Link href={`/blog/${post.slug}`}>
            <h3 className="text-sm font-semibold text-foreground leading-snug mt-0.5 line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
          </Link>
          <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3" />
            {post.readingTime}
          </span>
        </div>
      </article>
    )
  }

  // default
  return (
    <article className="group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border flex flex-col">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColor}`}>
              {categoryLabel}
            </span>
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col gap-2">
          <h2 className="font-serif text-base font-bold text-foreground leading-snug text-balance line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">{post.description}</p>
          <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readingTime}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {post.author}
            </span>
          </div>
        </div>
      </Link>
      <div className="absolute top-3 right-3">
        <PinterestSaveButton
          url={`https://healthyworm.com/blog/${post.slug}`}
          imageUrl={post.coverImage}
          description={post.title}
        />
      </div>
    </article>
  )
}
