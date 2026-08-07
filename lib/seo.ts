import type { Metadata } from 'next'
import type { Post } from './posts'

const SITE_URL = 'https://healthyworm.com'
const SITE_NAME = 'Healthy Worm'
const DEFAULT_IMAGE = '/images/og-default.jpg'

export function postToMetadata(post: Post): Metadata {
  const title = post.seo?.title || post.title
  const description = post.seo?.description || post.description
  const url = `${SITE_URL}/blog/${post.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: SITE_NAME,
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: post.coverImage || DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [post.coverImage || DEFAULT_IMAGE],
    },
    other: {
      'pinterest-rich-pin': 'true',
    },
  }
}

export function categoryToMetadata(category: string, label: string, description: string): Metadata {
  const url = `${SITE_URL}/category/${category}`
  const title = `${label} — Tips, Guides & More`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: SITE_NAME,
    },
  }
}

export function buildBlogSchema(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.coverImage,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
  }
}

export function buildFAQSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}
