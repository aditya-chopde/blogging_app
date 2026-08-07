import Link from 'next/link'
import { Salad, CalendarDays, Apple, Dumbbell, Zap, ShoppingBag } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const CATEGORIES: {
  slug: string
  label: string
  description: string
  icon: LucideIcon
  bg: string
  border: string
  iconColor: string
  text: string
  hover: string
}[] = [
  {
    slug: 'healthy-recipes',
    label: 'Healthy Recipes',
    description: 'Nutritious meals for every taste',
    icon: Salad,
    bg: 'bg-green-50',
    border: 'border-green-200',
    iconColor: 'text-green-700',
    text: 'text-green-800',
    hover: 'hover:bg-green-100',
  },
  {
    slug: 'meal-plans',
    label: 'Meal Plans',
    description: 'Structured weekly eating guides',
    icon: CalendarDays,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconColor: 'text-blue-600',
    text: 'text-blue-800',
    hover: 'hover:bg-blue-100',
  },
  {
    slug: 'healthy-foods',
    label: 'Healthy Foods',
    description: 'Superfoods, nutrients & benefits',
    icon: Apple,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    iconColor: 'text-amber-700',
    text: 'text-amber-800',
    hover: 'hover:bg-amber-100',
  },
  {
    slug: 'workout-plans',
    label: 'Workout Plans',
    description: 'Structured training programs',
    icon: Dumbbell,
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    iconColor: 'text-purple-700',
    text: 'text-purple-800',
    hover: 'hover:bg-purple-100',
  },
  {
    slug: 'workouts',
    label: 'Workouts',
    description: 'Exercises for every goal',
    icon: Zap,
    bg: 'bg-red-50',
    border: 'border-red-200',
    iconColor: 'text-red-700',
    text: 'text-red-800',
    hover: 'hover:bg-red-100',
  },
  {
    slug: 'workout-gear',
    label: 'Workout Gear',
    description: 'Best equipment reviewed & ranked',
    icon: ShoppingBag,
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    iconColor: 'text-slate-600',
    text: 'text-slate-700',
    hover: 'hover:bg-slate-100',
  },
]

export default function CategoryGrid() {
  return (
    <section aria-labelledby="categories-heading" className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 id="categories-heading" className="font-serif text-3xl font-bold text-foreground">
            Explore Topics
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">Find exactly what you are looking for</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${cat.bg} ${cat.border} ${cat.hover} transition-all duration-200 group text-center`}
              >
                <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${cat.bg}`}>
                  <Icon className={`w-6 h-6 ${cat.iconColor}`} aria-hidden="true" />
                </div>
                <span className={`text-sm font-semibold leading-snug ${cat.text}`}>{cat.label}</span>
                <span className="text-xs text-muted-foreground leading-snug hidden sm:block">{cat.description}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
