import { NextRequest, NextResponse } from 'next/server'
import {
  getAllSubscribers,
  updateSubscriberDeliveryStatus,
} from '@/lib/subscribers'
import { sendEbookDeliveryEmail } from '@/lib/email'

function isAuthorized(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  return Boolean(token && token === process.env.ADMIN_PASSWORD)
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const subscribers = getAllSubscribers().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return NextResponse.json({ subscribers })
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { action, subscriberId } = await req.json()

    if (action === 'retry-delivery' && subscriberId) {
      const subscribers = getAllSubscribers()
      const subscriber = subscribers.find((s) => s.id === subscriberId)

      if (!subscriber) {
        return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 })
      }

      const siteUrl =
        req.nextUrl.origin || process.env.NEXT_PUBLIC_SITE_URL || 'https://healthyworm.com'

      const emailResult = await sendEbookDeliveryEmail({
        subscriber,
        siteUrl,
      })

      if (emailResult.success) {
        updateSubscriberDeliveryStatus(subscriber.id, 'delivered')
        return NextResponse.json({ success: true, message: 'Delivery resent successfully' })
      } else {
        updateSubscriberDeliveryStatus(subscriber.id, 'failed', emailResult.error)
        return NextResponse.json(
          { error: emailResult.error || 'Failed to resend delivery' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ error: errorMsg }, { status: 500 })
  }
}
