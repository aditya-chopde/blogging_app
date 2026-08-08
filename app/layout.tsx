import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Healthy Worm — Healthy Recipes, Meal Plans & Workout Guides',
    template: '%s | Healthy Worm',
  },
  description:
    'Healthy Worm is your go-to resource for healthy recipes, meal plans, workout guides, and the best fitness gear. Live healthier, one day at a time.',
  metadataBase: new URL('https://healthy-worm.vercel.app'),
  openGraph: {
    type: 'website',
    siteName: 'Healthy Worm',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@healthyworm',
  },
  robots: { index: true, follow: true },
  verification: {
    google: "Qoe_egrVfSgHH9TkOjOIpm195-Let32OH5ckhoz8G14",
    other: {
      "p:domain_verify": "1654fb3a8717651d3b708efba0ed4ffa",
    }
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#F3EFD0',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable} bg-background`}>
      <body className="antialiased font-sans" suppressHydrationWarning>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
