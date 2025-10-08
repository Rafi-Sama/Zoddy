import { Metadata } from 'next'
import { APP_NAME, APP_DESCRIPTION } from './constants'

interface PageMetadataOptions {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  noIndex?: boolean
}

const defaultKeywords = [
  'business tracker',
  'small business',
  'inventory management',
  'order management',
  'Bangladesh',
  'SME',
  'sales tracking',
  'customer management'
]

export function generateMetadata({
  title,
  description = APP_DESCRIPTION,
  keywords = defaultKeywords,
  image = '/og-image.png',
  noIndex = false
}: PageMetadataOptions = {}): Metadata {
  const pageTitle = title ? `${title} | ${APP_NAME}` : APP_NAME

  return {
    title: pageTitle,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title: pageTitle,
      description,
      type: 'website',
      siteName: APP_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: pageTitle
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [image]
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex
      }
    }
  }
}

// Page-specific metadata generators
export const pageMetadata = {
  dashboard: () => generateMetadata({
    title: 'Dashboard',
    description: 'View your business metrics and performance at a glance'
  }),

  orders: () => generateMetadata({
    title: 'Orders',
    description: 'Manage and track all your customer orders in one place'
  }),

  customers: () => generateMetadata({
    title: 'Customers',
    description: 'Manage your customer relationships and contact information'
  }),

  inventory: () => generateMetadata({
    title: 'Inventory',
    description: 'Track your product inventory and stock levels'
  }),

  analytics: () => generateMetadata({
    title: 'Analytics',
    description: 'Analyze your business performance with detailed reports'
  }),

  settings: () => generateMetadata({
    title: 'Settings',
    description: 'Configure your account and application preferences'
  }),

  account: () => generateMetadata({
    title: 'Account',
    description: 'Manage your account details and subscription',
    noIndex: true
  }),

  pricing: () => generateMetadata({
    title: 'Pricing',
    description: 'Choose the perfect plan for your business needs'
  }),

  benefits: () => generateMetadata({
    title: 'Benefits',
    description: 'Discover how Zoddy transforms your WhatsApp business into a profit-generating machine. Save 3+ hours daily, never lose orders, and grow 10x faster.'
  }),

  contact: () => generateMetadata({
    title: 'Contact',
    description: 'Get in touch with our support team for help and inquiries'
  })
}