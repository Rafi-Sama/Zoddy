export type WidgetType =
  | 'revenue'
  | 'orders'
  | 'conversion-rate'
  | 'sales-category'
  | 'pending-payments'
  | 'low-stock'
  | 'insights'
  | 'revenue-chart'
  | 'recent-activity'
  | 'cash-flow'
  | 'top-product'
  | 'time-saved'
  | 'best-customer'
  | 'retention-alert'
  | 'quick-actions'
  | 'custom';

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  description?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  static?: boolean;
  isDraggable?: boolean;
  data?: {
    title?: string;
    description?: string;
    content?: string;
    [key: string]: unknown;
  };
}

export interface DashboardLayout {
  widgets: Widget[];
  cols: number;
  rowHeight: number;
}

export const WIDGET_DEFINITIONS: Record<WidgetType, Partial<Widget>> = {
  revenue: {
    title: 'Total Revenue',
    w: 3,
    h: 2
  },
  orders: {
    title: 'Orders',
    w: 3,
    h: 2
  },
  'conversion-rate': {
    title: 'Conversion Rate',
    w: 2,
    h: 2
  },
  'sales-category': {
    title: 'Sales by Category',
    w: 3,
    h: 3
  },
  'pending-payments': {
    title: 'Pending Payments',
    w: 3,
    h: 2
  },
  'low-stock': {
    title: 'Low Stock Alert',
    w: 3,
    h: 2
  },
  insights: {
    title: 'Business Insights',
    description: 'Your day-1 ROI dashboard',
    w: 6,
    h: 3
  },
  'revenue-chart': {
    title: 'Revenue Trend',
    description: 'Daily revenue for the last 30 days',
    w: 6,
    h: 4
  },
  'recent-activity': {
    title: 'Recent Activity',
    description: 'Last 5 orders',
    w: 3,
    h: 4
  },
  'cash-flow': {
    title: 'Cash Flow Forecast',
    description: 'Your real wealth calculation',
    w: 3,
    h: 3
  },
  'top-product': {
    title: 'Top Product',
    w: 3,
    h: 2
  },
  'time-saved': {
    title: 'Time Saved',
    w: 3,
    h: 2
  },
  'best-customer': {
    title: 'Best Customer',
    w: 3,
    h: 2
  },
  'retention-alert': {
    title: 'Customer Retention Alert',
    w: 6,
    h: 2
  },
  'quick-actions': {
    title: 'Quick Actions',
    w: 12,
    h: 1,
    static: true
  },
  custom: {
    title: 'Custom Widget',
    w: 3,
    h: 3
  }
};