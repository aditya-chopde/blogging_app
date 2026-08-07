import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

function isAuthorized(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  return token && token === process.env.ADMIN_PASSWORD
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await req.json()
  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
  }

  const filePath = path.join(process.cwd(), 'data', 'blogs', `${slug}.json`)

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 })
  }

  fs.unlinkSync(filePath)
  return NextResponse.json({ success: true })
}
