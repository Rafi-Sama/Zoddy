// Database type definitions matching supabase_schema.sql

// Define specific types for JSON fields
export type OrganizationSettings = Record<string, string | number | boolean | null>
export type UserPreferences = Record<string, string | number | boolean | null>
export type JsonMetadata = Record<string, string | number | boolean | null>

export interface Organization {
  id: string
  name: string
  slug?: string
  owner_id?: string
  subscription_plan: 'free' | 'starter' | 'professional' | 'enterprise'
  subscription_status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'paused'
  settings?: OrganizationSettings
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  email_verified: boolean
  profile_picture_url?: string
  organization_id?: string
  phone?: string
  role: 'owner' | 'admin' | 'member'
  preferences?: UserPreferences
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  organization_id: string
  name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  postal_code?: string
  country?: string
  notes?: string
  total_spent: number
  total_orders: number
  tags?: string[]
  metadata?: JsonMetadata
  created_at: string
  updated_at: string
  last_order_date?: string
}

export interface Product {
  id: string
  user_id?: string
  organization_id: string
  name: string
  description?: string
  sku: string
  category: string
  brand?: string
  unit?: string
  current_stock: number
  reorder_level: number
  min_order_quantity?: number
  max_order_quantity?: number
  cost_price: number
  selling_price: number
  discount_price?: number
  supplier?: string
  supplier_phone?: string
  barcode?: string
  tags?: string[]
  location?: string
  image_url?: string
  status: 'active' | 'inactive' | 'discontinued'
  expiry_date?: string
  manufacturing_date?: string
  warranty?: string
  weight?: string
  dimensions?: string
  color?: string
  size?: string
  bestseller?: boolean
  metadata?: JsonMetadata
  created_at: string
  updated_at: string
}

export interface ProductVariant {
  id?: string
  name: string
  sku?: string
  price: number
  quantity: number
  attributes?: JsonMetadata
}

export interface Order {
  id: string
  order_number: string
  organization_id: string
  customer_id?: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  shipping_address?: string
  billing_address?: string
  items: OrderItem[]
  subtotal: number
  tax_amount?: number
  shipping_amount?: number
  discount_amount?: number
  total_amount: number
  currency?: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
  payment_status: 'pending' | 'paid' | 'partial' | 'refunded' | 'failed'
  payment_method?: 'cash' | 'bkash' | 'nagad' | 'rocket' | 'bank' | 'card' | 'upay' | 'cellfin'
  delivery_provider?: 'ecourier' | 'redx' | 'pathao' | 'steadfast' | 'paperfly' | 'sundarban'
  tracking_number?: string
  source?: 'whatsapp' | 'facebook' | 'instagram' | 'website' | 'phone' | 'walk-in' | 'other'
  channel?: 'whatsapp' | 'facebook' | 'instagram' | 'phone' | 'website' | 'manual' | 'messenger' | 'telegram'
  notes?: string
  tags?: string[]
  metadata?: JsonMetadata
  created_at: string
  updated_at: string
  shipped_at?: string
  delivered_at?: string
}

export interface OrderItem {
  product_id?: string
  product_name: string
  product_sku?: string
  quantity: number
  price: number
  discount?: number
  total: number
  variant?: string
  metadata?: JsonMetadata
}

export interface TeamMember {
  id: string
  organization_id: string
  user_id: string
  role: 'owner' | 'admin' | 'sales' | 'inventory' | 'support' | 'viewer'
  permissions?: string[]
  department?: string
  joined_at: string
  status: 'active' | 'inactive' | 'invited'
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  organization_id: string
  user_id?: string
  title: string
  message: string
  type: 'order' | 'inventory' | 'customer' | 'team' | 'system' | 'payment'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  read: boolean
  action_url?: string
  metadata?: JsonMetadata
  created_at: string
  expires_at?: string
}

export interface Activity {
  id: string
  organization_id: string
  user_id: string
  action: string
  entity_type: string
  entity_id?: string
  description: string
  metadata?: JsonMetadata
  ip_address?: string
  user_agent?: string
  created_at: string
}

export interface BusinessSettings {
  id: string
  organization_id: string
  business_name?: string
  business_email?: string
  business_phone?: string
  business_address?: string
  business_logo?: string
  currency?: string
  timezone?: string
  tax_rate?: number
  invoice_prefix?: string
  invoice_next_number?: number
  payment_methods?: PaymentMethodSettings
  delivery_zones?: DeliveryZone[]
  notification_settings?: NotificationSettings
  integrations?: IntegrationSettings
  created_at: string
  updated_at: string
}

export interface PaymentMethodSettings {
  cash?: boolean
  bkash?: boolean
  nagad?: boolean
  rocket?: boolean
  bank?: boolean
  card?: boolean
  upay?: boolean
  cellfin?: boolean
  [key: string]: boolean | undefined
}

export interface DeliveryZone {
  id?: string
  name: string
  areas?: string[]
  fee: number
  minimum_order?: number
  estimated_days?: number
}

export interface NotificationSettings {
  email_notifications?: boolean
  sms_notifications?: boolean
  push_notifications?: boolean
  order_notifications?: boolean
  inventory_alerts?: boolean
  customer_notifications?: boolean
  [key: string]: boolean | undefined
}

export interface IntegrationSettings {
  whatsapp?: IntegrationConfig
  facebook?: IntegrationConfig
  google?: IntegrationConfig
  instagram?: IntegrationConfig
  [key: string]: IntegrationConfig | undefined
}

export interface IntegrationConfig {
  connected: boolean
  api_key?: string
  webhook_url?: string
  settings?: UserPreferences
}

// Analytics Types
export interface DashboardMetrics {
  revenue: {
    total: number
    trend: number
    period: string
  }
  orders: {
    total: number
    pending: number
    completed: number
    trend: number
  }
  customers: {
    total: number
    new: number
    returning: number
    retention_rate: number
  }
  products: {
    total: number
    low_stock: number
    out_of_stock: number
    top_selling: Product[]
  }
}

export interface ChartData {
  label: string
  value: number
  color?: string
}

export interface TimeSeriesData {
  date: string
  value: number
  label?: string
}