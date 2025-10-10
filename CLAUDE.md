# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zoddy is a business progress and growth tracking system for small online businesses in Bangladesh, specifically targeting sellers who operate through WhatsApp, Facebook, and other social media platforms. Built with Next.js 15, TypeScript, and Supabase.

## Development Commands

```bash
# Navigate to frontend first - all work happens in Front-end directory
cd Front-end

# Install dependencies
npm install

# Run development server (localhost:3000)
npm run dev

# Build for production (runs ESLint before building)
npm run build

# Start production server
npm start

# Run linting only
npm run lint
```

## Architecture Overview

### Tech Stack
- **Next.js 15.5.4** with App Router (NOT Pages Router)
- **React 19.1.0** with Server Components by default
- **TypeScript 5** with strict mode
- **Tailwind CSS v4** (new PostCSS plugin architecture)
- **WorkOS AuthKit** for authentication
- **Supabase** for database and backend
- **shadcn/ui** components built on Radix UI

### Authentication (WorkOS AuthKit)
- **Middleware Protection**: All routes protected by default via `middleware.ts`
- **Public Routes**: Only `/`, `/benefits`, `/pricing`, `/contact` are public
- **Auth Flow**:
  - `/login` → Redirects to WorkOS OAuth
  - `/callback` → Handles OAuth return, syncs user to Supabase, redirects to `/dashboard`
  - `/signout` → Clears session
- **User Sync**: `lib/sync-user.ts` syncs WorkOS users to Supabase on first login

### Database (Supabase) - Dual Client Pattern
```typescript
// Server-side (uses WorkOS access token)
import { createClient } from '@/lib/supabase'
const supabase = await createClient()

// Client-side (uses apiClient abstraction)
import { apiClient } from '@/lib/api-client'
const { data, error } = await apiClient.fetchWithAuth('orders', accessToken)
```

### Dashboard Widget System
- **Widget Components**: `components/dashboard/widgets/`
- **Widget Factory**: `components/dashboard/widget-factory.tsx` renders widget by type
- **Grid Layout**: Uses `react-grid-layout` for drag-and-drop
- **Overlap Resolution**: `lib/dashboard-utils.ts` handles smart positioning
- **Persistence**: Layouts saved to localStorage

### State Management
- **Global Contexts**:
  - `contexts/notifications-context.tsx` - App-wide notifications
  - `contexts/calendar-context.tsx` - Reminders and calendar events
- **Form State**: Custom `useForm` hook with Zod validation
- **Data Fetching**: `useDataFetch` hook with caching and retry logic
- **Storage**: `lib/storage.ts` wraps localStorage with expiration

## Key Patterns & Code Examples

### Creating Protected Pages
```typescript
// All routes are protected by default. For public routes, update middleware.ts
// app/new-feature/page.tsx
import { MainLayout } from '@/components/layout/main-layout'

export default function NewFeaturePage() {
  return (
    <MainLayout title="New Feature">
      {/* Page content */}
    </MainLayout>
  )
}
```

### Adding Dashboard Widgets
1. Create component in `components/dashboard/widgets/new-widget.tsx`
2. Add type to `types/dashboard.ts`:
   ```typescript
   export type WidgetType = 'revenue' | 'orders' | 'new-widget' | ...
   ```
3. Register in `components/dashboard/widget-factory.tsx`:
   ```typescript
   case 'new-widget':
     return <NewWidget {...props} />
   ```

### Form Handling Pattern
```typescript
// Uses custom useForm hook with Zod validation
import { useForm } from '@/hooks/use-form'
import { validators } from '@/lib/validation'

const form = useForm({
  initialValues: { email: '', phone: '' },
  validationRules: {
    email: validators.email(),
    phone: validators.phoneNumber() // Bangladesh format
  },
  onSubmit: async (data) => {
    // Handle submission
  }
})
```

### Bangladesh-Specific Helpers
```typescript
// Currency formatting (lib/helpers.ts)
formatCurrency(1000) // Returns "৳1,000"

// Phone validation (lib/validation.ts)
validators.phoneNumber() // Validates +880 and 01X-XXXX-XXXX formats

// Payment methods in constants
PAYMENT_METHODS: ['bkash', 'nagad', 'rocket', 'bank_transfer', 'cash']
```

### API Operations Pattern
```typescript
// Client-side data fetching with retry and auth
const { data, loading, error, refetch } = useDataFetch(
  'orders',
  async () => {
    const accessToken = await getAccessToken()
    return apiClient.fetchWithAuth('orders', accessToken, {
      filter: { status: 'pending' },
      orderBy: { column: 'created_at', ascending: false }
    })
  },
  { cacheTime: 5 * 60 * 1000, retryCount: 3 }
)
```

## Important Implementation Details

### Routing Rules
- App Router with Server Components by default
- Mark interactive components with `"use client"` directive
- API routes go in `app/api/[endpoint]/route.ts`
- Dynamic routes use `[param]` folders

### Styling Guidelines
- Use Tailwind CSS classes, not inline styles
- Theme colors via CSS variables: `--primary`, `--secondary`, `--accent`
- Dark mode class: `dark:` prefix on Tailwind classes
- Component variants with CVA (Class Variance Authority)

### Performance Optimizations
- Images: Use Next.js Image with AVIF/WebP formats
- Lazy loading: Use `lib/lazy-load.tsx` for heavy components
- Debouncing: Use `useDebounce` hook for search/filter inputs
- Caching: `useDataFetch` includes built-in cache management

### Error Handling
- API client includes automatic retry logic (3 attempts)
- Toast notifications via `useToast()` hook
- Form validation shows inline errors

## Environment Variables

Required in `.env.local`:
```
# WorkOS Authentication
WORKOS_API_KEY=sk_test_...
WORKOS_CLIENT_ID=client_...
NEXT_PUBLIC_WORKOS_CLIENT_ID=client_...
WORKOS_COOKIE_PASSWORD=[32+ character secret]
NEXT_PUBLIC_WORKOS_REDIRECT_URI=http://localhost:3000/callback

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## Business Context

Target Users: Small online sellers in Bangladesh using WhatsApp/Facebook for sales

Key Features:
- Multi-channel order tracking (WhatsApp, Facebook, phone)
- Customer relationship management
- Inventory tracking with low stock alerts
- Payment tracking (bKash, Nagad, Rocket, bank, cash)
- Analytics dashboard with customizable widgets
- Team collaboration with role-based access

Subscription Tiers:
- Free: 50 orders/month
- Starter: 500 orders/month, ৳500/month
- Professional: Unlimited, API access, ৳1,500/month
- Enterprise: Custom solutions