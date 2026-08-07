import { getAllPosts } from '@/lib/posts'
import AdminPostsClient from './AdminPostsClient'

export default function AdminPostsPage() {
  const posts = getAllPosts().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
  return <AdminPostsClient posts={posts} />
}
