import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SearchClient from './SearchClient'
import { getAllPosts } from '@/lib/posts'

export const metadata = {
  title: 'Search Articles — Healthy Worm',
  description: 'Search all healthy recipes, meal plans, workout guides, and fitness gear reviews on Healthy Worm.',
}

export default function SearchPage() {
  const allPosts = getAllPosts().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl font-bold text-foreground mb-3">Search Articles</h1>
            <p className="text-muted-foreground">Find recipes, meal plans, workouts, and more</p>
          </div>
          <Suspense fallback={<div className="text-center py-10 text-muted-foreground">Loading search…</div>}>
            <SearchClient allPosts={allPosts} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
