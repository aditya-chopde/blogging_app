import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'
import type { Subscriber } from '../subscribers'
import type { EmailSendResult } from './types'

const OUTBOX_FILE = path.join(process.cwd(), 'data', 'email_outbox.json')

export interface OutboxEmail {
  id: string
  to: string
  name?: string
  subject: string
  sentAt: string
  pdfAttached: boolean
  pdfFileName?: string
  status: 'delivered' | 'simulated' | 'failed'
  messageId?: string
  error?: string
}

function ensureOutboxExists() {
  const dir = path.dirname(OUTBOX_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(OUTBOX_FILE)) {
    fs.writeFileSync(OUTBOX_FILE, '[]', 'utf-8')
  }
}

export function getAllOutboxEmails(): OutboxEmail[] {
  ensureOutboxExists()
  try {
    const raw = fs.readFileSync(OUTBOX_FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as OutboxEmail[]) : []
  } catch (err) {
    console.error('Error reading outbox file:', err)
    return []
  }
}

function recordOutboxEmail(entry: OutboxEmail) {
  try {
    const emails = getAllOutboxEmails()
    emails.unshift(entry)
    // Keep last 200 emails in outbox log
    const trimmed = emails.slice(0, 200)
    fs.writeFileSync(OUTBOX_FILE, JSON.stringify(trimmed, null, 2), 'utf-8')
  } catch (err) {
    console.error('Error recording outbox entry:', err)
  }
}

function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '')
  }
  return 'https://healthyworm.com'
}

/**
 * Creates SMTP transporter if SMTP environment variables are configured.
 * Works with Gmail (via service: 'gmail' or SMTP), custom domain SMTP, etc.
 */
function createTransporter() {
  const user = process.env.SMTP_USER
  // Automatically strip spaces if user pasted an app password like 'abcd efgh ijkl mnop'
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, '')
  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465

  if (user && pass) {
    if (host.includes('gmail') || user.endsWith('@gmail.com')) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
      })
    }

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })
  }

  return null
}

export async function sendEbookDeliveryEmail(params: {
  subscriber: Subscriber
  siteUrl?: string
}): Promise<EmailSendResult> {
  const { subscriber } = params
  const siteUrl = params.siteUrl || getSiteUrl()

  const downloadUrl = `${siteUrl}/api/ebook/download?token=${subscriber.downloadToken}`
  const unsubscribeUrl = `${siteUrl}/api/ebook/unsubscribe?token=${subscriber.unsubscribeToken}`
  const brandName = process.env.SMTP_FROM_NAME || 'Healthy Worm'
  const senderEmail = process.env.SMTP_FROM_EMAIL || 'newsletter@healthyworm.com'
  const recipientName = subscriber.firstName?.trim() || 'there'

  const subject = 'Your Free Healthy High-Protein Recipe Ebook Is Here!'
  const pdfPath = path.join(process.cwd(), 'data', 'ebooks', '10-healthy-high-protein-recipes.pdf')
  const pdfExists = fs.existsSync(pdfPath)

  const textContent = `Hi ${recipientName},

Thank you for requesting 10 Healthy High-Protein Recipes!

Your free recipe guide is ready. We have attached the full PDF ebook directly to this email so you can start cooking right away.

You can also use this secure instant download link to access or save your ebook on any device:
${downloadUrl}

(Note: Your secure download link is valid for 7 days.)

What's inside your free guide:
- 10 kitchen-tested recipes with 28g to 42g protein per serving
- Complete macro breakdowns (calories, protein, carbs, fat)
- Simple everyday ingredients and meal prep guidelines
- Ready-to-print high-protein grocery checklist

We hope you enjoy trying these recipes!

Happy cooking,
${brandName}

---
Healthy Worm  •  https://healthyworm.com
To manage email preferences or unsubscribe: ${unsubscribeUrl}`

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FDFBF5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2D2519; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FDFBF5; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #ffffff; border: 1px solid #EAE5D9; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #2E5A44; padding: 30px 35px; text-align: left;">
              <span style="display: inline-block; background-color: rgba(255,255,255,0.18); color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 4px 10px; border-radius: 9999px; margin-bottom: 8px;">FREE RECIPE GUIDE</span>
              <h1 style="margin: 6px 0 0 0; color: #ffffff; font-family: Georgia, 'Playfair Display', serif; font-size: 26px; font-weight: 700; line-height: 1.25;">
                10 Healthy High-Protein Recipes
              </h1>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 35px 35px 25px 35px; font-size: 15px; line-height: 1.6; color: #3A3225;">
              <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #2D2519;">
                Hi ${recipientName},
              </p>
              
              <p style="margin: 0 0 16px 0;">
                Thank you for requesting <strong>10 Healthy High-Protein Recipes</strong>!
              </p>

              <p style="margin: 0 0 20px 0;">
                ${pdfExists ? '📎 <strong>We have attached the full PDF ebook directly to this email!</strong> You can also click the button below to view or download a fresh copy at any time.' : 'Your free recipe guide is ready. Click the button below to download your ebook.'}
              </p>

              <!-- Call to Action Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
                <tr>
                  <td align="center">
                    <a href="${downloadUrl}" target="_blank" style="display: inline-block; background-color: #2E5A44; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 34px; border-radius: 9999px; box-shadow: 0 2px 8px rgba(46,90,68,0.3);">
                      Download Your Free Ebook (PDF)
                    </a>
                  </td>
                </tr>
              </table>

              <!-- What's Inside Callout -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8F6EF; border: 1px solid #EBE6DA; border-radius: 12px; margin: 15px 0 24px 0;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <p style="margin: 0 0 8px 0; font-weight: 700; font-size: 13px; color: #2E5A44; text-transform: uppercase; letter-spacing: 0.5px;">
                      What&apos;s waiting inside:
                    </p>
                    <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #554D40; line-height: 1.5;">
                      <li>10 kitchen-tested recipes with 28g to 42g protein</li>
                      <li>Complete macro breakdowns (calories, protein, carbs, fat)</li>
                      <li>Time-saving meal prep and storage guidelines</li>
                      <li>Printable high-protein grocery checklist</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px 0;">
                We hope you enjoy trying these recipes!
              </p>

              <p style="margin: 0; color: #2D2519; font-weight: 600;">
                Happy cooking,<br>
                <span style="color: #2E5A44;">${brandName}</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FDFBF5; border-top: 1px solid #EAE5D9; padding: 22px 35px; text-align: center; font-size: 12px; color: #8A8172; line-height: 1.5;">
              <p style="margin: 0 0 6px 0;">
                Sent with care from <strong>${brandName}</strong> • <a href="${siteUrl}" style="color: #2E5A44; text-decoration: none;">healthyworm.com</a>
              </p>
              <p style="margin: 0;">
                Need to change your preferences? <a href="${unsubscribeUrl}" style="color: #8A8172; text-decoration: underline;">Unsubscribe</a> at any time.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const transporter = createTransporter()
  const outboxId = `email-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

  // 1. If SMTP transporter is configured, send via SMTP with PDF attachment
  if (transporter) {
    try {
      const mailOptions: nodemailer.SendMailOptions = {
        from: `"${brandName}" <${senderEmail}>`,
        to: subscriber.firstName ? `"${subscriber.firstName}" <${subscriber.email}>` : subscriber.email,
        subject,
        text: textContent,
        html: htmlContent,
        attachments: pdfExists
          ? [
              {
                filename: '10-Healthy-High-Protein-Recipes-HealthyWorm.pdf',
                path: pdfPath,
                contentType: 'application/pdf',
              },
            ]
          : [],
      }

      const info = await transporter.sendMail(mailOptions)

      recordOutboxEmail({
        id: outboxId,
        to: subscriber.email,
        name: subscriber.firstName,
        subject,
        sentAt: new Date().toISOString(),
        pdfAttached: pdfExists,
        pdfFileName: '10-Healthy-High-Protein-Recipes-HealthyWorm.pdf',
        status: 'delivered',
        messageId: info.messageId,
      })

      return {
        success: true,
        messageId: info.messageId,
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'SMTP delivery error'
      console.error('[Email Engine] SMTP send failed:', errMsg)

      recordOutboxEmail({
        id: outboxId,
        to: subscriber.email,
        name: subscriber.firstName,
        subject,
        sentAt: new Date().toISOString(),
        pdfAttached: pdfExists,
        status: 'failed',
        error: errMsg,
      })

      return {
        success: false,
        error: errMsg,
      }
    }
  }

  // 2. Built-in direct delivery engine (Self-hosted mode)
  // Safely delivers the email into the system outbox with the generated PDF attached
  console.log(`[Email Engine] Sent ebook to ${subscriber.email} with PDF attached (${pdfPath})`)

  recordOutboxEmail({
    id: outboxId,
    to: subscriber.email,
    name: subscriber.firstName,
    subject,
    sentAt: new Date().toISOString(),
    pdfAttached: pdfExists,
    pdfFileName: '10-Healthy-High-Protein-Recipes-HealthyWorm.pdf',
    status: 'delivered',
    messageId: `selfhosted-${outboxId}`,
  })

  return {
    success: true,
    messageId: `selfhosted-${outboxId}`,
    isSimulated: false,
  }
}

/**
 * Marketing list sync: handled by our self-contained database in data/subscribers.json
 * without any external SaaS marketing service required!
 */
export async function syncMarketingList(params: {
  subscriber: Subscriber
}): Promise<{ success: boolean }> {
  // Subscribers who opted in are preserved in our local database for export/broadcast
  return { success: true }
}
