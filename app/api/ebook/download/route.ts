import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getSubscriberByDownloadToken, recordDownload } from '@/lib/subscribers'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!token) {
    return new Response(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Invalid Download Link — Healthy Worm</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #FDFBF5; color: #2D2519; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; text-align: center; }
    .card { background: white; border: 1px solid #E5E0D5; border-radius: 20px; padding: 40px; max-width: 480px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
    h1 { font-family: serif; font-size: 26px; margin-bottom: 12px; }
    p { color: #666; font-size: 15px; line-height: 1.5; margin-bottom: 24px; }
    .btn { display: inline-block; background: #2E5A44; color: white; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Missing Download Link</h1>
    <p>No valid security token was supplied with your download request.</p>
    <a href="/free-recipes" class="btn">Get Ebook Link</a>
  </div>
</body>
</html>`,
      { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 400 }
    )
  }

  const subscriber = getSubscriberByDownloadToken(token)

  if (!subscriber) {
    return new Response(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Invalid Token — Healthy Worm</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #FDFBF5; color: #2D2519; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; text-align: center; }
    .card { background: white; border: 1px solid #E5E0D5; border-radius: 20px; padding: 40px; max-width: 480px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
    h1 { font-family: serif; font-size: 26px; margin-bottom: 12px; }
    p { color: #666; font-size: 15px; line-height: 1.5; margin-bottom: 24px; }
    .btn { display: inline-block; background: #2E5A44; color: white; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Invalid or Expired Link</h1>
    <p>This download link has expired or is no longer valid. Enter your email again to receive a fresh, instant download link.</p>
    <a href="/free-recipes" class="btn">Request New Link</a>
  </div>
</body>
</html>`,
      { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 403 }
    )
  }

  const now = Date.now()
  if (subscriber.downloadTokenExpiresAt < now) {
    return new Response(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Expired Download Link — Healthy Worm</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #FDFBF5; color: #2D2519; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; text-align: center; }
    .card { background: white; border: 1px solid #E5E0D5; border-radius: 20px; padding: 40px; max-width: 480px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
    h1 { font-family: serif; font-size: 26px; margin-bottom: 12px; }
    p { color: #666; font-size: 15px; line-height: 1.5; margin-bottom: 24px; }
    .btn { display: inline-block; background: #2E5A44; color: white; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Link Expired</h1>
    <p>Security links expire after 7 days. Please request a fresh copy of your free recipe guide.</p>
    <a href="/free-recipes" class="btn">Send Me a Fresh Copy</a>
  </div>
</body>
</html>`,
      { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 410 }
    )
  }

  // Record successful download
  recordDownload(token)

  // If external download URL is configured, redirect securely
  if (process.env.EBOOK_DOWNLOAD_URL) {
    return NextResponse.redirect(process.env.EBOOK_DOWNLOAD_URL)
  }

  // Stream local PDF file
  const pdfPath = path.join(process.cwd(), 'data', 'ebooks', '10-healthy-high-protein-recipes.pdf')

  if (!fs.existsSync(pdfPath)) {
    return new Response('Ebook file temporarily unavailable.', { status: 404 })
  }

  const fileBuffer = fs.readFileSync(pdfPath)

  return new Response(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="10-Healthy-High-Protein-Recipes-HealthyWorm.pdf"',
      'Content-Length': fileBuffer.length.toString(),
      'Cache-Control': 'private, no-cache, no-store, must-revalidate',
    },
  })
}
