export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'monthly' | 'yearly'
  features: string[]
  limits: {
    orders?: number
    customers?: number
    products?: number
    team_members?: number
    storage?: string
    api_calls?: number
  }
  popular?: boolean
  badge?: string
}

export interface Subscription {
  id: string
  user_id: string
  plan_id: string
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'paused'
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  canceled_at?: string
  trial_end?: string
  created_at: string
  updated_at: string
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'bkash' | 'nagad' | 'rocket' | 'bank_transfer'
  last4?: string
  brand?: string
  phone?: string
  bank_name?: string
  is_default: boolean
  created_at: string
}

export interface Invoice {
  id: string
  invoice_number: string
  subscription_id: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'failed' | 'refunded'
  due_date: string
  paid_at?: string
  payment_method_id?: string
  items: InvoiceItem[]
  created_at: string
}

export interface InvoiceItem {
  description: string
  quantity: number
  unit_amount: number
  amount: number
}

export interface BillingHistory {
  id: string
  type: 'payment' | 'refund' | 'subscription_change'
  description: string
  amount: number
  status: 'success' | 'failed' | 'pending'
  date: string
  invoice_id?: string
}

export interface UsageStats {
  orders: number
  customers: number
  products: number
  team_members: number
  storage_used: string
  api_calls: number
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    price: 0,
    currency: 'BDT',
    interval: 'monthly',
    features: [
      'Up to 50 orders/month',
      '100 customer records',
      '50 products',
      'Basic analytics',
      'WhatsApp notifications',
      'Mobile app access',
      'Community support'
    ],
    limits: {
      orders: 50,
      customers: 100,
      products: 50,
      team_members: 1,
      storage: '500MB',
      api_calls: 1000
    }
  },
  {
    id: 'starter',
    name: 'Starter',
    description: 'For growing businesses',
    price: 500,
    currency: 'BDT',
    interval: 'monthly',
    features: [
      'Up to 500 orders/month',
      '1,000 customer records',
      'Unlimited products',
      'Advanced analytics',
      'WhatsApp + SMS notifications',
      'Payment reminders',
      'Priority support',
      '2 team members',
      'Custom branding'
    ],
    limits: {
      orders: 500,
      customers: 1000,
      products: -1, // unlimited
      team_members: 2,
      storage: '5GB',
      api_calls: 10000
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For established businesses',
    price: 1500,
    currency: 'BDT',
    interval: 'monthly',
    features: [
      'Unlimited orders',
      'Unlimited customers',
      'Unlimited products',
      'Advanced analytics & insights',
      'All notification channels',
      'Automated marketing tools',
      'API access',
      '5 team members',
      'Custom branding',
      'Priority support 24/7',
      'Data export & backup'
    ],
    limits: {
      orders: -1,
      customers: -1,
      products: -1,
      team_members: 5,
      storage: '25GB',
      api_calls: 50000
    },
    popular: true,
    badge: 'Most Popular'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solutions for large businesses',
    price: 0, // Custom pricing
    currency: 'BDT',
    interval: 'monthly',
    features: [
      'Everything in Professional',
      'Unlimited team members',
      'Unlimited storage',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
      'On-premise deployment option',
      'Custom training',
      'White-label solution'
    ],
    limits: {
      orders: -1,
      customers: -1,
      products: -1,
      team_members: -1,
      storage: 'Unlimited',
      api_calls: -1
    },
    badge: 'Contact Sales'
  }
]

// Payment methods available in Bangladesh
export const PAYMENT_METHODS = {
  bkash: {
    name: 'bKash',
    icon: '📱',
    description: 'Pay with bKash mobile wallet'
  },
  nagad: {
    name: 'Nagad',
    icon: '📲',
    description: 'Pay with Nagad mobile wallet'
  },
  rocket: {
    name: 'Rocket',
    icon: '🚀',
    description: 'Pay with Dutch-Bangla Rocket'
  },
  card: {
    name: 'Credit/Debit Card',
    icon: '💳',
    description: 'Visa, MasterCard, AMEX'
  },
  bank: {
    name: 'Bank Transfer',
    icon: '🏦',
    description: 'Direct bank transfer'
  }
}