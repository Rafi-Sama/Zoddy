// User & Authentication Types
export interface User {
  id: string;
  email: string;
  email_verified: boolean;
  profile_picture_url?: string;
  organization_id?: string;
  role?: 'owner' | 'admin' | 'member';
  created_at: string;
  updated_at: string;
  // Deprecated fields - kept for backward compatibility
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  organizationId?: string;
  iat?: number;
  exp?: number;
}

// Order Types
export interface OrderItem {
  id?: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  user_id: string;
  organization_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address: string;
  items: OrderItem[];
  total_amount: number;
  discount?: number;
  delivery_charge?: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  payment_status: 'pending' | 'paid' | 'partial' | 'failed' | 'refunded';
  payment_method: 'cash' | 'bkash' | 'nagad' | 'rocket' | 'bank' | 'card';
  delivery_type: 'standard' | 'express' | 'pickup';
  channel?: 'whatsapp' | 'facebook' | 'instagram' | 'phone' | 'website' | 'manual';
  notes?: string;
  delivery_tracking_id?: string;
  delivery_provider?: 'ecourier' | 'redx' | 'pathao';
  created_at: string;
  updated_at: string;
}

// Customer Types
export interface Customer {
  id: string;
  user_id: string;
  organization_id?: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  status: 'vip' | 'regular' | 'new' | 'inactive';
  favorite_category?: string;
  total_orders: number;
  total_spent: number;
  average_order_value: number;
  last_order_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Product/Inventory Types
export interface Product {
  id: string;
  user_id: string;
  organization_id?: string;
  name: string;
  description?: string;
  sku: string;
  category: string;
  brand?: string;
  unit?: string;
  current_stock: number;
  reorder_level: number;
  min_order_quantity?: number;
  max_order_quantity?: number;
  cost_price: number;
  selling_price: number;
  discount_price?: number;
  supplier?: string;
  supplier_phone?: string;
  barcode?: string;
  tags?: string[];
  location?: string;
  image_url?: string;
  status: 'active' | 'inactive' | 'discontinued';
  expiry_date?: string;
  manufacturing_date?: string;
  warranty?: string;
  weight?: string;
  dimensions?: string;
  color?: string;
  size?: string;
  bestseller: boolean;
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: string;
  product_id: string;
  user_id: string;
  organization_id?: string;
  type: 'in' | 'out' | 'adjustment' | 'return';
  quantity: number;
  reason?: string;
  reference_type?: 'order' | 'purchase' | 'manual';
  reference_id?: string;
  notes?: string;
  created_at: string;
}

// Team Types
export interface TeamMember {
  id: string;
  organization_id: string;
  user_id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  avatar?: string;
  status: 'active' | 'invited' | 'inactive';
  permissions: TeamPermissions;
  joined_at: string;
  last_active: string;
  created_at: string;
  updated_at: string;
}

export interface TeamPermissions {
  canManageTeam: boolean;
  canAssignTasks: boolean;
  canViewAnalytics: boolean;
  canManageInventory: boolean;
  canManageOrders: boolean;
  canManageCustomers: boolean;
}

export interface TeamTask {
  id: string;
  organization_id: string;
  title: string;
  description: string;
  assigned_to: string[];
  created_by: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  due_date?: string;
  completed_at?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  organization_id?: string;
  title: string;
  description: string;
  type: 'order' | 'payment' | 'stock' | 'info' | 'warning' | 'team';
  read: boolean;
  archived: boolean;
  metadata?: Record<string, any>;
  created_at: string;
}

// Reminder Types
export interface Reminder {
  id: string;
  user_id: string;
  organization_id?: string;
  date: string;
  time: string;
  title: string;
  description?: string;
  type: 'reminder' | 'note' | 'event';
  completed: boolean;
  created_at: string;
  updated_at: string;
}

// Subscription & Billing Types
export interface Subscription {
  id: string;
  user_id: string;
  organization_id?: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'paused';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  canceled_at?: string;
  trial_end?: string;
  created_at: string;
  updated_at: string;
}

// Analytics Types
export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  topProducts: Array<{
    product_id: string;
    product_name: string;
    total_sold: number;
    revenue: number;
  }>;
  topCustomers: Array<{
    customer_id: string;
    customer_name: string;
    total_orders: number;
    total_spent: number;
  }>;
  salesByCategory: Record<string, number>;
  revenueByDate: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

// Delivery Service Types
export interface DeliveryBooking {
  id: string;
  order_id: string;
  provider: 'ecourier' | 'redx' | 'pathao';
  tracking_id: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'delivered' | 'failed' | 'cancelled';
  pickup_address: string;
  delivery_address: string;
  recipient_name: string;
  recipient_phone: string;
  package_description: string;
  package_value: number;
  delivery_charge: number;
  estimated_delivery?: string;
  actual_delivery?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// AI Processing Types
export interface AIProcessingRequest {
  id: string;
  user_id: string;
  organization_id?: string;
  type: 'order_extraction' | 'image_ocr' | 'xml_parsing';
  input_data: string | object;
  output_data?: object;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  created_at: string;
  updated_at: string;
}

// Request/Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  metadata?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}
