# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zoddy is a business progress and growth tracking system for small online businesses, particularly targeting sellers in Bangladesh who operate through social media platforms. The system provides order management, customer data collection, analytics visualization, inventory tracking, and sales insights.

## Development Commands

```bash
# Navigate to the frontend directory first
cd Front-end

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (runs linting first)
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run a specific test (if tests are added)
# npm test -- path/to/test.spec.ts
```

## Architecture Overview

### Authentication Flow (WorkOS AuthKit)
- **Middleware Protection**: All routes protected by default via `middleware.ts`
- **Public Routes**: Only `/`, `/about`, `/pricing`, `/contact` are public
- **Auth Endpoints**:
  - `/login` - Redirects to WorkOS sign-in
  - `/callback` - OAuth callback, redirects to `/dashboard`
  - `/signout` - Clears session
- **User Sync**: WorkOS users are synced to Supabase via `lib/sync-user.ts`

### Database Integration (Supabase)
The project uses a dual-client pattern for Supabase:

1. **Server Client** (`lib/supabase.ts`): Uses WorkOS access token for server-side operations
2. **Browser Client** (`lib/supabase-client.ts`): Singleton pattern with AuthKit integration
3. **API Abstraction** (`lib/api-client.ts`): Provides retry logic and standardized CRUD operations

### State Management
- **Global State**: React Context providers for Notifications and Calendar
- **Persistence**: LocalStorage wrapper (`lib/storage.ts`) with expiration support
- **Form State**: Custom `useForm` hook with validation

### Component Architecture
- **UI Components**: Radix UI primitives wrapped with shadcn/ui styling
- **Layout**: Sidebar-based layout with draggable, archivable navigation
- **Dashboard**: Widget-based system with drag-and-drop customization
  - Widgets stored in `components/dashboard/widgets/`
  - Layout persistence via LocalStorage
  - Smart positioning with overlap resolution

### Key Directories
```
Front-end/
├── app/              # Next.js App Router pages and API routes
├── components/       # React components
│   ├── ui/          # Atomic shadcn/ui components
│   ├── dashboard/   # Dashboard-specific components
│   └── layout/      # Layout components
├── contexts/        # React Context providers
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and configurations
├── types/          # TypeScript type definitions
└── styles/         # Global CSS and Tailwind config
```

## Key Technical Decisions

### Routing
- Uses Next.js 15 App Router (not Pages Router)
- Server Components by default, "use client" for interactivity
- Protected routes handled via middleware

### Styling
- Tailwind CSS v4 with custom Zoddy brand colors
- Dark/light theme support via CSS variables
- Component variants managed with Class Variance Authority (CVA)

### Forms & Validation
- React Hook Form + Zod for type-safe form handling
- Custom validation library (`lib/validation.ts`) with Bangladesh-specific rules
- Real-time validation with error messages

### Performance
- Image optimization with AVIF/WebP formats
- Static asset caching (1 year)
- Lazy loading utilities
- Debouncing for expensive operations

## Common Patterns

### Creating a New Page
1. Add route in `app/[route]/page.tsx`
2. Wrap with authentication if needed (default is protected)
3. Use `MainLayout` or `MarketingLayout` component

### Adding a Dashboard Widget
1. Create widget component in `components/dashboard/widgets/`
2. Add widget type to `types/dashboard.ts`
3. Register in `WidgetFactory` (`components/dashboard/widget-factory.tsx`)
4. Add to available widgets list

### Working with Supabase
```typescript
// Server-side
import { createClient } from '@/lib/supabase'
const supabase = await createClient()

// Client-side
import { apiClient } from '@/lib/api-client'
const response = await apiClient.fetchWithAuth('table_name')
```

### Using Context Providers
```typescript
// Access notifications
import { useNotifications } from '@/contexts/notifications-context'

// Access calendar/reminders
import { useCalendar } from '@/contexts/calendar-context'
```

## Environment Variables

Required environment variables (stored in `.env`):
- `NEXT_PUBLIC_WORKOS_CLIENT_ID` - WorkOS client ID
- `WORKOS_API_KEY` - WorkOS API key
- `WORKOS_CLIENT_ID` - WorkOS client ID (server-side)
- `WORKOS_COOKIE_PASSWORD` - 32+ character secret for cookie encryption
- `NEXT_PUBLIC_WORKOS_REDIRECT_URI` - OAuth callback URL
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for user sync)

## Business Context

The application is designed for:
- Small online sellers in Bangladesh
- WhatsApp/Telegram-based businesses
- Users currently tracking orders manually
- Focus on mobile-first experience
- Support for local payment methods (bKash, etc.)

Key features include order tracking, inventory management, customer insights, payment reminders, and marketing tools - all optimized for simplicity and ease of use.