import { NextRequest, NextResponse } from 'next/server'
import { unsubscribeByToken, unsubscribeByEmail } from '@/lib/subscribers'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/unsubscribe?status=missing', req.url))
  }

  const result = unsubscribeByToken(token)

  if (!result.success) {
    return NextResponse.redirect(new URL('/unsubscribe?status=invalid', req.url))
  }

  return NextResponse.redirect(new URL('/unsubscribe?status=success', req.url))
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token, email } = body

    if (token) {
      const res = unsubscribeByToken(token)
      if (res.success && res.email) {
        return NextResponse.json({ success: true, message: 'Unsubscribed successfully' })
      }
    } else if (email) {
      const res = unsubscribeByEmail(email)
      if (res) {
        return NextResponse.json({ success: true, message: 'Unsubscribed successfully' })
      }
    }

    return NextResponse.json({ error: 'Subscriber not found or invalid token' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
