import { getPostBySlug } from '@/lib/posts'
import { getAllAffiliates } from '@/lib/affiliates'
import AdminEditorClient from './AdminEditorClient'

export default async function AdminEditorPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>
}) {
  const { slug } = await searchParams
  const post = slug ? getPostBySlug(slug) : null
  const affiliates = getAllAffiliates()
  return <AdminEditorClient existingPost={post} affiliates={affiliates} />
}
