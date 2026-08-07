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

  const affiliates = await req.json()

  if (!Array.isArray(affiliates)) {
    return NextResponse.json({ error: 'Expected an array' }, { status: 400 })
  }

  const filePath = path.join(process.cwd(), 'data', 'affiliates.json')
  fs.writeFileSync(filePath, JSON.stringify(affiliates, null, 2), 'utf-8')

  return NextResponse.json({ success: true })
}
