'use client'

import { Link2 } from 'lucide-react'
import { useState } from 'react'

interface ShareButtonsProps {
  url: string
  title: string
  imageUrl?: string
}

export default function ShareButtons({ url, title, imageUrl }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const fullUrl = `https://healthyworm.com${url}`

  const copyLink = () => {
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
      '_blank',
      'width=550,height=420',
    )
  }

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
      '_blank',
      'width=580,height=520',
    )
  }

  const savePinterest = () => {
    const img = imageUrl ?? ''
    window.open(
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(fullUrl)}&media=${encodeURIComponent(img)}&description=${encodeURIComponent(title)}`,
      '_blank',
      'width=750,height=550',
    )
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium text-muted-foreground">Share:</span>

      <button
        onClick={shareFacebook}
        aria-label="Share on Facebook"
        suppressHydrationWarning
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full bg-[#1877F2] text-white hover:bg-[#1877F2]/90 transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        Facebook
      </button>

      <button
        onClick={shareTwitter}
        aria-label="Share on X (Twitter)"
        suppressHydrationWarning
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full bg-black text-white hover:bg-black/80 transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        X
      </button>

      <button
        onClick={savePinterest}
        aria-label="Save to Pinterest"
        suppressHydrationWarning
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full bg-[#E60023] text-white hover:bg-[#E60023]/90 transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
        </svg>
        Pinterest
      </button>

      <button
        onClick={copyLink}
        aria-label="Copy link"
        suppressHydrationWarning
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full bg-secondary hover:bg-accent/60 text-foreground transition-colors"
      >
        <Link2 className="w-3.5 h-3.5" />
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  )
}
