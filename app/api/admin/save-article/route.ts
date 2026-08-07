import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

function isAuthorized(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  return token && token === process.env.ADMIN_PASSWORD
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const article = await req.json()

  if (!article.slug || typeof article.slug !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid slug' }, { status: 400 })
  }

  // Basic slug sanitization
  const slug = article.slug.replace(/[^a-z0-9-]/g, '')
  const dir = path.join(process.cwd(), 'data', 'blogs')
  const filePath = path.join(dir, `${slug}.json`)

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  fs.writeFileSync(filePath, JSON.stringify({ ...article, slug }, null, 2), 'utf-8')

  return NextResponse.json({ success: true, slug })
}
