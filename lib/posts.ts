import fs from 'fs'
import path from 'path'

export interface AffiliateProduct {
  id: string
  name: string
  image: string
  description: string
  benefits: string[]
  pros: string[]
  rating: number
  price: string
  button: string
  affiliate: string
}

export interface ContentBlock {
  type:
    | 'heading'
    | 'paragraph'
    | 'image'
    | 'quote'
    | 'list'
    | 'callout'
    | 'faq'
    | 'affiliate_card'
    | 'youtube'
    | 'divider'
  level?: number
  text?: string
  author?: string
  src?: string
  alt?: string
  caption?: string
  style?: 'ul' | 'ol'
  items?: string[] | { question: string; answer: string }[]
  variant?: 'info' | 'warning' | 'tip' | 'success'
  productId?: string
  videoId?: string
}

export type PostMeta = Omit<Post, 'content' | 'affiliateProducts'>

export interface Post {
  title: string
  slug: string
  description: string
  coverImage: string
  category: string
  date: string
  author: string
  readingTime: string
  tags: string[]
  featured: boolean
  seo: { title: string; description: string }
  pinterest: { title: string; description: string }
  content: ContentBlock[]
  affiliateProducts: AffiliateProduct[]
  relatedSlugs: string[]
}

const BLOGS_DIR = path.join(process.cwd(), 'data', 'blogs')

export function getAllPosts(): Post[] {
  if (!fs.existsSync(BLOGS_DIR)) return []
  const files = fs.readdirSync(BLOGS_DIR).filter((f) => f.endsWith('.json'))
  return files
    .map((file) => {
      try {
        const raw = fs.readFileSync(path.join(BLOGS_DIR, file), 'utf-8')
        return JSON.parse(raw) as Post
      } catch {
        return null
      }
    })
    .filter(Boolean) as Post[]
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(BLOGS_DIR, `${slug}.json`)
  if (!fs.existsSync(filePath)) return null
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw) as Post
  } catch {
    return null
  }
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((p) => p.category === category)
}

export function getFeaturedPosts(limit = 6): Post[] {
  return getAllPosts()
    .filter((p) => p.featured)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

export function getLatestPosts(limit = 12): Post[] {
  return getAllPosts()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOGS_DIR)) return []
  return fs
    .readdirSync(BLOGS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace('.json', ''))
}

export function getAllCategories(): string[] {
  return [
    'healthy-recipes',
    'meal-plans',
    'healthy-foods',
    'workout-plans',
    'workouts',
    'workout-gear',
  ]
}

export const CATEGORY_META: Record<
  string,
  { label: string; description: string; color: string; icon: string }
> = {
  'healthy-recipes': {
    label: 'Healthy Recipes',
    description: 'Delicious, nutritious recipes for every meal of the day.',
    color: '#A8C5A0',
    icon: '🥗',
  },
  'meal-plans': {
    label: 'Meal Plans',
    description: 'Structured weekly meal plans to reach your health goals.',
    color: '#C4A882',
    icon: '📋',
  },
  'healthy-foods': {
    label: 'Healthy Foods',
    description: 'Discover the best superfoods and nutrient-dense ingredients.',
    color: '#E8A87C',
    icon: '🥦',
  },
  'workout-plans': {
    label: 'Workout Plans',
    description: 'Step-by-step training programs for every fitness level.',
    color: '#8FB8D4',
    icon: '🏋️',
  },
  workouts: {
    label: 'Workouts',
    description: 'Individual exercises and routines to build strength and burn fat.',
    color: '#D4A8C4',
    icon: '💪',
  },
  'workout-gear': {
    label: 'Workout Gear',
    description: 'Reviews of the best fitness equipment and accessories.',
    color: '#B8C4A8',
    icon: '🎽',
  },
}

export function getTrendingPosts(limit = 5): Post[] {
  return getAllPosts()
    .filter((p) => !p.featured)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

export function getRelatedPosts(slugs: string[]): Post[] {
  return slugs
    .map((slug) => getPostBySlug(slug))
    .filter(Boolean) as Post[]
}

export function searchPosts(query: string): Post[] {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  return getAllPosts().filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q),
  )
}
