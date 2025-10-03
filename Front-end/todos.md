# Zoddy Frontend Development Checklist

## 🎨 Design System Setup

### Color Palette Implementation
- [ ] Define color system in `tailwind.config.ts`

```typescript
colors: {
  primary: '#3d5a80',      // Deep blue (primary actions, headers)
  secondary: '#98c1d9',     // Light blue (secondary elements, backgrounds)
  accent: '#ee6c4d',        // Coral (CTAs, alerts, highlights)
  dark: '#293241',          // Charcoal (text, dark mode primary)
  light: '#f4f1de',         // Cream (backgrounds, cards)
}
```

- [ ] Create CSS custom properties for theme switching
- [ ] Set up dark/light mode toggle with context provider
- [ ] Define semantic color tokens (success, warning, error, info)

### Typography Setup

- [ ] Import Google Fonts: Shantell Sans, Inter, DM Sans
- [ ] Configure font families in Tailwind
  - **Shantell Sans**: Headings, playful elements, gamification
  - **Inter**: Body text, tables, data-heavy sections
  - **DM Sans**: UI elements, buttons, forms
- [ ] Define typography scale (h1-h6, body, caption, etc.)
- [ ] Set responsive font sizes

### Component Library Foundation

- [ ] Button variants (primary, secondary, ghost, danger)
- [ ] Input fields (text, number, select, textarea, date)
- [ ] Card component with variants
- [ ] Modal/Dialog system
- [ ] Toast notification system
- [ ] Badge/Tag components
- [ ] Loading states (skeleton, spinner, progress)
- [ ] Empty states illustrations
- [ ] Icon system setup (lucide-react)

## 📱 Page Structure & Features

### 1. Authentication Pages

**`/login` & `/signup`**

- [ ] Clean split-screen layout (left: branding, right: form)
- [ ] Social auth buttons (Google, Facebook)
- [ ] Phone number + OTP option
- [ ] "Remember me" checkbox
- [ ] Password strength indicator (signup)
- [ ] Terms & privacy policy links
- [ ] Loading states during auth
- [ ] Error handling with friendly messages
- [ ] Redirect to onboarding after first signup

**`/forgot-password`**

- [ ] Email/phone input
- [ ] OTP verification
- [ ] Password reset form

### 2. Onboarding Flow (Critical for retention)

**`/onboarding/welcome`**

- [ ] Animated welcome screen with Zoddy branding
- [ ] "What do you sell?" category selection (Fashion, Food, Crafts, etc.)
- [ ] Business name input
- [ ] Currency selection (BDT default)
- [ ] Skip option (but encourage completion)

**`/onboarding/import-data`**

- [ ] Excel/CSV file upload with drag-drop
- [ ] Screenshot/image upload for order parsing
- [ ] WhatsApp chat export parser
- [ ] Sample data templates download
- [ ] "Start fresh" option
- [ ] Progress indicator (Step 2 of 4)
- [ ] Preview parsed data before import

**`/onboarding/quick-setup`**

- [ ] Add 3-5 products quickly (name, price, stock)
- [ ] Add 2-3 customers (name, phone)
- [ ] Product categories setup
- [ ] Payment methods setup (Bkash, Cash, etc.)

**`/onboarding/connect-channels`**

- [ ] WhatsApp bot setup instructions
- [ ] Telegram bot connection
- [ ] Social media page links (optional)
- [ ] "Finish Setup" CTA

### 3. Dashboard (`/dashboard`)

**The money-maker page - must show ROI immediately**

**Top Stats Row (Hero Cards)**

- [ ] Total Revenue (today, week, month tabs)
  - Large number with trend indicator (↑15%)
  - Sparkline chart
- [ ] Orders Count (pending, completed, cancelled badges)
- [ ] Pending Payments amount (clickable to payment reminders)
- [ ] Low Stock Alert count (clickable)

**Quick Actions Bar**

- [ ] "New Order" button (prominent, accent color)
- [ ] "Add Product" quick button
- [ ] "Send Message" to customers
- [ ] Search bar (orders, customers, products)

**Insights Section (Day 1 ROI)**

- [ ] "You've saved X hours this month" counter
- [ ] Best customer card (name, total orders, revenue)
- [ ] Top selling product with image
- [ ] "Customers not ordered in 30 days" alert

**Revenue Chart**

- [ ] Line/bar chart toggle
- [ ] Time range selector (7d, 30d, 90d, 1y)
- [ ] Revenue vs. Expenses comparison
- [ ] Hover tooltips with daily breakdown

**Recent Activity Feed**

- [ ] Last 5 orders (compact list)
- [ ] Payment status indicators
- [ ] Quick actions (view, edit, mark paid)

**Cash Flow Forecast Card**

- [ ] Pending payments total
- [ ] Inventory value estimate
- [ ] "Incoming money" projection
- [ ] Visual progress bar

### 4. Orders Page (`/orders`)

**Powerful but simple order management**

**Filter & Search Bar**

- [ ] Search by customer name, order ID, phone
- [ ] Status filter chips (All, Pending, Confirmed, Delivered, Cancelled)
- [ ] Date range picker
- [ ] Payment status filter (Paid, Pending, Partial)
- [ ] Export to Excel button

**Orders Table/Cards View Toggle**

- [ ] Table view (desktop): ID, Customer, Date, Items, Amount, Status, Actions
- [ ] Card view (mobile): Compact cards with key info
- [ ] Pagination or infinite scroll
- [ ] Bulk actions (mark paid, update status)
- [ ] Quick edit inline

**Order Details Sidebar/Modal**

- [ ] Customer info (name, phone, address)
- [ ] Order items list with images
- [ ] Payment breakdown (subtotal, delivery, discount)
- [ ] Status timeline (ordered → confirmed → packed → delivered)
- [ ] Edit button for each field
- [ ] Print receipt button
- [ ] Send tracking link button
- [ ] Add note/comment section

**New Order Form (`/orders/new`)**

- [ ] Customer autocomplete (or quick add)
- [ ] Product search & add (with stock check)
- [ ] Quantity adjustment
- [ ] Price override option
- [ ] Discount input
- [ ] Delivery fee
- [ ] Payment method selection
- [ ] Payment status toggle
- [ ] Delivery date picker
- [ ] Customer note field
- [ ] Save as draft option

### 5. Products Page (`/products`)

**Product Grid/List View**

- [ ] Grid view with product images
- [ ] List view with detailed info
- [ ] Search & filter (category, stock status, price range)
- [ ] Sort options (name, price, stock, best-selling)
- [ ] Low stock badges
- [ ] Out of stock overlay

**Product Card (Grid)**

- [ ] Product image (placeholder if none)
- [ ] Product name
- [ ] Price
- [ ] Stock count with color coding (green >10, yellow 5-10, red <5)
- [ ] Quick edit icon
- [ ] Quick action buttons (duplicate, archive)

**Add/Edit Product Form (`/products/new`, `/products/:id/edit`)**

- [ ] Image upload (multiple images, drag-drop)
- [ ] Product name
- [ ] Description (rich text editor, optional)
- [ ] Category dropdown (with add new option)
- [ ] Price input
- [ ] Cost price (optional, for profit tracking)
- [ ] Stock quantity
- [ ] SKU (auto-generated option)
- [ ] Variants support (size, color) - optional
- [ ] Save & add another button

**Bulk Actions**

- [ ] Import products (Excel/CSV)
- [ ] Update prices in bulk
- [ ] Update stock in bulk
- [ ] Export products

### 6. Customers Page (`/customers`)

**Customer List**

- [ ] Search by name, phone, email
- [ ] Filter by order count, total spent
- [ ] Sort by recent order, total revenue
- [ ] Card view with avatar/initials

**Customer Card**

- [ ] Customer name & contact info
- [ ] Total orders count
- [ ] Total revenue
- [ ] Last order date
- [ ] "Send message" quick action
- [ ] "View orders" link

**Customer Details Page (`/customers/:id`)**

- [ ] Customer info section (editable)
- [ ] Order history list
- [ ] Total spent & average order value
- [ ] Favorite products
- [ ] Notes section
- [ ] Activity timeline
- [ ] "Customer hasn't ordered in X days" alert
- [ ] Quick reorder button

**Customer Insights**

- [ ] Top 10 customers by revenue (leaderboard style)
- [ ] Inactive customers list (30+ days)
- [ ] Send broadcast message feature
- [ ] Customer segments (VIP, Regular, New)

### 7. Inventory Page (`/inventory`)

**Stock Overview Cards**

- [ ] Total inventory value
- [ ] Low stock items count
- [ ] Out of stock items count
- [ ] Overstocked items (optional)

**Stock Table**

- [ ] Product name with image
- [ ] Current stock
- [ ] Reorder level indicator
- [ ] Stock movements (in/out this week)
- [ ] Quick adjust stock button

**Stock Adjustment Form**

- [ ] Product selector
- [ ] Adjustment type (add, remove, set)
- [ ] Quantity input
- [ ] Reason/note field
- [ ] Log history

**Stock Alerts Settings**

- [ ] Set low stock threshold per product
- [ ] Enable/disable notifications
- [ ] Notification channels (app, email, SMS)

### 8. Analytics Page (`/analytics`)

**Data-driven insights without overwhelming**

**Revenue Analytics**

- [ ] Revenue over time chart (daily, weekly, monthly)
- [ ] Revenue by product category (pie/donut chart)
- [ ] Revenue by payment method
- [ ] Profit margin calculation (if cost price available)

**Sales Analytics**

- [ ] Top 10 products by quantity sold
- [ ] Top 10 products by revenue
- [ ] Sales by day of week (heatmap)
- [ ] Average order value trend

**Customer Analytics**

- [ ] New vs. returning customers
- [ ] Customer lifetime value
- [ ] Customer retention rate
- [ ] Order frequency distribution

**Delivery & Returns**

- [ ] On-time delivery rate
- [ ] Delivery time average
- [ ] Return rate by product
- [ ] Cancelled order reasons

**Benchmarking Section**

- [ ] "Sellers like you average X orders/month. You're at Y"
- [ ] Your growth rate vs. average
- [ ] Gamification badges earned

### 9. Payments & Cash Flow (`/payments`)

**Payment Overview**

- [ ] Total pending payments
- [ ] Payments received today/week/month
- [ ] Payment methods breakdown (pie chart)
- [ ] Late payments counter

**Pending Payments List**

- [ ] Customer name & order details
- [ ] Amount due
- [ ] Days overdue
- [ ] "Send reminder" button per row
- [ ] Mark as paid quick action
- [ ] Bulk reminder feature

**Payment Reminders Settings**

- [ ] Auto-reminder schedule (3 days, 7 days, etc.)
- [ ] WhatsApp reminder template editor
- [ ] SMS reminder (optional)

**Cash Flow Forecast**

- [ ] Expected income (pending payments + inventory value)
- [ ] Visual timeline (next 7/30 days)
- [ ] "Real wealth" calculation

### 10. Marketing Tools (`/marketing`)

**Customer Messaging**

- [ ] Broadcast message composer
- [ ] Customer segment selector (all, VIP, inactive, etc.)
- [ ] WhatsApp message preview
- [ ] Schedule sending
- [ ] Message templates library
- [ ] Track message sent/delivered/read

**Social Media Post Generator**

- [ ] Select products to feature
- [ ] AI-generated caption
- [ ] Image collage generator
- [ ] Platform selector (Facebook, Instagram, WhatsApp Status)
- [ ] Download/copy post

**Festive Campaign Templates**

- [ ] Pre-built templates (Eid, Pohela Boishakh, etc.)
- [ ] Customize message & discount
- [ ] Send to customer segments

**New Arrival Alerts**

- [ ] Auto-alert when new products added
- [ ] Customer selection based on past purchases
- [ ] One-click broadcast

### 11. Settings Page (`/settings`)

**Business Profile**

- [ ] Business name & logo upload
- [ ] Contact information
- [ ] Business address
- [ ] Business type/category
- [ ] Operating hours

**Preferences**

- [ ] Currency selection
- [ ] Date format (DD/MM/YYYY, etc.)
- [ ] Time zone
- [ ] Language (Bengali, English)
- [ ] Notification preferences

**Payment Methods**

- [ ] Enable/disable payment methods
- [ ] Add custom payment method
- [ ] Set default method
- [ ] Integration keys (Bkash, Stripe, etc.)

**Delivery Settings**

- [ ] Default delivery fee
- [ ] Free delivery threshold
- [ ] Delivery zones & fees
- [ ] Estimated delivery days

**Team Management**

- [ ] Add team members
- [ ] Assign roles (Admin, Manager, Staff)
- [ ] Permissions settings
- [ ] Activity log

**Data Management**

- [ ] Export all data (Excel, CSV, JSON)
- [ ] Backup data
- [ ] Delete account (with confirmation)

**Integrations**

- [ ] WhatsApp bot setup & status
- [ ] Telegram bot connection
- [ ] Social media page links
- [ ] API keys (for advanced users)

### 12. Customer-Facing Pages

**Order Tracking Page (`/track/:orderId`)**

- [ ] Public page (no login required)
- [ ] Branded header with seller name/logo
- [ ] Order status timeline (confirmed → packed → shipped → delivered)
- [ ] Estimated delivery date
- [ ] Customer service contact info
- [ ] "Order Again" button (if customer known)

**Customer Portal (`/portal/:customerId`)**

- [ ] Login with phone + OTP
- [ ] Order history
- [ ] Reorder past purchases (one-click)
- [ ] Track active orders
- [ ] Update delivery address
- [ ] Contact seller button

**Digital Receipt (`/receipt/:orderId`)**

- [ ] Printable/shareable design
- [ ] Seller branding
- [ ] Order details table
- [ ] Payment breakdown
- [ ] QR code for tracking link
- [ ] Social share buttons
- [ ] Download as PDF/image

### 13. Gamification Features (Sprinkled throughout)

**Achievements Page (`/achievements`)**

- [ ] Badge collection display
- [ ] Progress bars for next badges
- [ ] Streak counter (daily updates)
- [ ] Milestones (100 orders, 1000 products, etc.)
- [ ] Shareable achievement cards

**In-App Notifications**

- [ ] "5-day streak! 🔥" toast
- [ ] "Badge unlocked!" modal
- [ ] "Top 30% of sellers!" celebration

**Weekly Digest Email/Notification**

- [ ] Summary of week's performance
- [ ] Celebrate wins
- [ ] Motivational message
- [ ] Next week's goal suggestion

### 14. Mobile-First & Offline Features

**Progressive Web App (PWA) Setup**

- [ ] Service worker configuration
- [ ] Offline page design
- [ ] Cache strategy for critical pages
- [ ] Install prompt
- [ ] App icon & splash screen

**Offline Functionality**

- [ ] Queue actions when offline
- [ ] Sync when back online
- [ ] Offline indicator banner
- [ ] Local storage for draft orders

**Mobile Navigation**

- [ ] Bottom tab bar (Dashboard, Orders, Products, More)
- [ ] Swipe gestures (optional)
- [ ] Pull-to-refresh
- [ ] Haptic feedback (for supported devices)

### 15. Notifications & Alerts

**Notification Center**

- [ ] Bell icon with unread count
- [ ] Notification list (grouped by type)
- [ ] Mark as read/unread
- [ ] Clear all button
- [ ] Settings link

**Notification Types**

- [ ] New order received
- [ ] Payment received
- [ ] Low stock alert
- [ ] Customer message
- [ ] Milestone achieved
- [ ] Weekly digest reminder

**Notification Settings**

- [ ] Enable/disable per type
- [ ] Channel preference (in-app, email, SMS, push)
- [ ] Quiet hours

### 16. Help & Support

**Help Center (`/help`)**

- [ ] Searchable FAQ
- [ ] Video tutorials
- [ ] Getting started guide
- [ ] Feature walkthroughs

**Onboarding Tooltips**

- [ ] First-time user tooltips
- [ ] Feature highlights
- [ ] Skip/next buttons
- [ ] "Don't show again" option

**Support Widget**

- [ ] Chat bubble (bottom right)
- [ ] Contact form
- [ ] WhatsApp support link

## 🔧 Global UI/UX Components

**Navigation**

- [ ] Sidebar (desktop) - collapsible
- [ ] Top bar with search, notifications, profile
- [ ] Breadcrumbs for deep pages
- [ ] Context menus (right-click actions)

**Theme Switcher**

- [ ] Toggle in header (moon/sun icon)
- [ ] Smooth transition animation
- [ ] Persist preference in localStorage
- [ ] System preference detection

**Search**

- [ ] Global search (Cmd+K / Ctrl+K)
- [ ] Search across orders, products, customers
- [ ] Recent searches
- [ ] Quick actions from search

**Loading States**

- [ ] Page-level skeleton loaders
- [ ] Button loading spinners
- [ ] Progress bars for uploads
- [ ] Shimmer effects

**Error Handling**

- [ ] 404 page with navigation
- [ ] 500 error page
- [ ] Network error banner
- [ ] Form validation errors (inline)
- [ ] Retry buttons

**Accessibility**

- [ ] Keyboard navigation (Tab, Enter, Esc)
- [ ] ARIA labels
- [ ] Focus indicators
- [ ] Screen reader support
- [ ] Color contrast compliance (WCAG AA)

## 🎯 TypeScript Setup

- [ ] Configure tsconfig.json (strict mode)
- [ ] Define types for:
  - [ ] User
  - [ ] Order
  - [ ] Product
  - [ ] Customer
  - [ ] Payment
  - [ ] Analytics data
- [ ] API response types
- [ ] Form state types
- [ ] Component prop types
- [ ] Context types (Auth, Theme, Notifications)
- [ ] Utility types (Pagination, Filters, etc.)

## 🚀 Performance Optimization

- [ ] Lazy load routes with React.lazy()
- [ ] Image optimization (next/image)
- [ ] Code splitting per route
- [ ] Debounce search inputs
- [ ] Virtualize long lists (react-window)
- [ ] Memoize expensive calculations
- [ ] Optimize bundle size (analyze with webpack-bundle-analyzer)

## 🧪 Testing Checklist

- [ ] Unit tests for utilities
- [ ] Component tests (React Testing Library)
- [ ] E2E tests for critical flows (Playwright)
  - [ ] Order creation flow
  - [ ] Payment reminder flow
  - [ ] Product import flow
- [ ] Accessibility tests
- [ ] Mobile responsiveness tests

## 📦 Deployment Prep

- [ ] Environment variables setup
- [ ] Build optimization
- [ ] Meta tags for SEO
- [ ] OpenGraph tags for social sharing
- [ ] Analytics integration (optional)
- [ ] Error monitoring (Sentry, optional)
- [ ] Performance monitoring