import { NextRequest, NextResponse } from 'next/server'
import {
  createOrUpdateSubscriber,
  isValidEmail,
  normalizeEmail,
  updateSubscriberDeliveryStatus,
} from '@/lib/subscribers'
import { checkRateLimit } from '@/lib/rateLimit'
import { sendEbookDeliveryEmail, syncMarketingList } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting by client IP
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'unknown-ip'

    const rateCheck = checkRateLimit(`subscribe:${clientIp}`, 8, 600000)
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please wait a few minutes before trying again.',
        },
        { status: 429 }
      )
    }

    // 2. Parse & sanitize body
    const body = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
    }

    const { email, firstName, marketingConsent, source } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 })
    }

    const cleanEmail = normalizeEmail(email)

    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    // Basic bot protection: reject if first name is suspiciously long or contains html/urls
    const cleanFirstName =
      typeof firstName === 'string' ? firstName.trim().slice(0, 50) : undefined

    if (cleanFirstName && /<[^>]*>|https?:\/\//i.test(cleanFirstName)) {
      return NextResponse.json({ error: 'Invalid input provided.' }, { status: 400 })
    }

    const cleanSource =
      typeof source === 'string' ? source.trim().slice(0, 50) : 'website'
    const hasMarketingConsent = Boolean(marketingConsent)

    // 3. Database persistence (Atomic & Idempotent)
    const { subscriber } = createOrUpdateSubscriber({
      email: cleanEmail,
      firstName: cleanFirstName,
      marketingConsent: hasMarketingConsent,
      source: cleanSource,
    })

    // 4. Synchronize with email marketing list ONLY if explicit marketing consent is provided
    if (hasMarketingConsent) {
      try {
        await syncMarketingList({ subscriber })
      } catch (syncErr) {
        console.error('[API Subscribe] Marketing list sync non-blocking error:', syncErr)
      }
    }

    // 5. Send Transactional Ebook Delivery Email
    const siteUrl = req.nextUrl.origin || process.env.NEXT_PUBLIC_SITE_URL || 'https://healthyworm.com'

    try {
      const emailResult = await sendEbookDeliveryEmail({
        subscriber,
        siteUrl,
      })

      if (emailResult.success) {
        updateSubscriberDeliveryStatus(subscriber.id, 'delivered')
      } else {
        updateSubscriberDeliveryStatus(
          subscriber.id,
          'failed',
          emailResult.error || 'Failed to dispatch email'
        )
      }
    } catch (emailErr: unknown) {
      const errMsg = emailErr instanceof Error ? emailErr.message : 'Unknown email error'
      console.error('[API Subscribe] Error sending delivery email:', errMsg)
      updateSubscriberDeliveryStatus(subscriber.id, 'failed', errMsg)
    }

    // 6. Safe Success Response
    return NextResponse.json({
      success: true,
      message: 'Your free recipe guide is on its way to your inbox!',
    })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error'
    console.error('[API Subscribe] Server error:', errorMsg)
    return NextResponse.json(
      { error: 'Something went wrong processing your request. Please try again later.' },
      { status: 500 }
    )
  }
}
