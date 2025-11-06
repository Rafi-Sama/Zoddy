# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zoddy is a full-stack business management system for Bangladesh-based SMBs and e-commerce businesses. It provides order management, inventory tracking, CRM, team collaboration, and AI-powered data extraction features.

## Development Commands

### Frontend (Next.js 15 - Port 3000)
```bash
cd Front-end
npm run dev       # Start development server
npm run build     # Production build (includes linting)
npm run start     # Start production server
npm run lint      # Run ESLint
```

### Backend (Express.js - Port 5000)
```bash
cd backend
npm run dev         # Start with nodemon and hot-reload (uses tsconfig-paths)
npm run build       # Compile TypeScript to dist/
npm run start       # Run production build
npm run lint        # Run ESLint
npm run test        # Run Jest tests with coverage
npm run type-check  # TypeScript type checking
npm run clean       # Remove dist/ directory
```

### Database
```bash
# Database schema files:
# - DB.md - Complete schema reference (context only)
# - Policies.md - RLS policies reference
# - add_missing_indexes.sql - Performance indexes
# - create_optimization_rpcs.sql - Database stored procedures
```

## Architecture Overview

### Frontend Structure
- **Framework**: Next.js 15 with App Router, React 19, TypeScript 5
- **Key Directories**:
  - `app/` - Next.js app router pages and layouts
    - `(auth)/` - Auth route group (signin, reset-password, signout, update-password)
    - `organizations/` - Organization management and switching
  - `components/` - Reusable UI components (100+ components)
  - `contexts/` - React contexts (organization, session, dashboard-data, notifications, calendar)
  - `hooks/` - Custom React hooks (use-organization, use-database, etc.)
  - `lib/` - Utilities, API client, Supabase client
    - `supabase/client.ts` - Browser client factory (@supabase/ssr)
    - `supabase/server.ts` - Server client factory with cookie handling
- **State Management**: React Context (organization, notifications, calendar, dashboard-data, session)
- **Form Handling**: React Hook Form + Zod validation
- **UI Components**: Radix UI primitives + custom components
- **Drag & Drop**: @dnd-kit for dashboard widgets and sortable lists

### Backend Structure
- **Framework**: Express.js with TypeScript
- **Key Directories**:
  - `controllers/` - Request handlers
    - `auth.controller.ts` - Authentication (signup, signin, OAuth callbacks)
    - `organization.controller.ts` - Organization CRUD and member management
    - `onboarding.controller.ts` - User onboarding flow
    - `health.controller.ts` - Health checks and system status
    - `order.controller.ts`, `product.controller.ts`, `customer.controller.ts` - Core business logic
    - `ai.controller.ts` - AI-powered text extraction and OCR
    - `delivery.controller.ts` - Delivery provider integrations
    - `team.controller.ts` - Team and permissions
    - `analytics.controller.ts` - Business analytics
  - `routes/` - API endpoint definitions
  - `middleware/` - Auth, security, rate limiting
  - `services/` - Business logic (AI, delivery, email)
  - `models/` - Data models and types
  - `utils/` - Helper functions (supabase-helpers.ts, etc.)
- **API Base Path**: `/api/v1/`
- **Authentication**: Supabase Auth with JWT validation via middleware
- **Path Aliases**: Uses tsconfig-paths for module resolution (@/* maps to src/*)

### Database Schema
- **Provider**: Supabase (PostgreSQL)
- **Key Tables**:
  - `organizations` - Multi-tenant organization data with subscription plans
  - `profiles` - User profiles linked to auth.users
  - `team_members` - Organization membership and permissions
  - `customers` - Customer CRM data (phone, email, address, status, metadata)
  - `products` - Inventory with stock tracking, pricing, SKU
  - `orders` - Order data with items stored as JSONB
  - `order_items` - Normalized order line items
  - `stock_movements` - Audit trail for inventory changes
  - `delivery_bookings` - Delivery provider tracking
  - `notifications` - User notifications with types and priorities
  - `reminders` - Calendar events and reminders
  - `team_tasks` - Task management
  - `subscriptions` - Subscription billing data
  - `transactions` - Income/expense tracking
  - `categories` - Product categorization
- **Features**: Row Level Security (RLS) on all tables, multi-tenancy via organization_id, full-text search indexes
- **Payment Methods**: cash, bkash, nagad, rocket, bank, card, upay, cellfin
- **Delivery Providers**: ecourier, redx, pathao, steadfast, paperfly, sundarban
- **Order Channels**: whatsapp, facebook, instagram, phone, website, manual, messenger
- **Order Status**: pending, confirmed, processing, shipped, delivered, cancelled, returned
- **Payment Status**: pending, paid, partial, failed, refunded

## API Endpoints

All endpoints prefixed with `/api/v1/`:
- `/auth/*` - Authentication (signup, signin, OAuth callbacks, password reset)
- `/organization/*` - Organization management, member invites, switching
- `/onboarding/*` - User onboarding workflow
- `/orders/*` - Order CRUD operations
- `/products/*` - Inventory management
- `/customers/*` - Customer CRM
- `/team/*` - Team and permissions
- `/ai/*` - AI-powered features (text extraction, OCR via Google Gemini)
- `/delivery/*` - Delivery provider integrations
- `/analytics/*` - Business analytics
- `/health` - Health check endpoint

## Key Features to Understand

### 1. Multi-Tenancy & Organization Management
- All data is scoped by `organization_id`
- Users can belong to multiple organizations via `team_members` table
- RLS policies enforce data isolation at database level (see Policies.md)
- Organization context managed via React Context (`organization-context.tsx`)
- Organization switcher component allows switching between orgs
- Onboarding flow creates first organization for new users

### 2. Authentication Architecture
- **Frontend**: Uses @supabase/ssr for client/server separation
  - `lib/supabase/client.ts` - Browser client (client components)
  - `lib/supabase/server.ts` - Server client with cookie handling (server components/actions)
  - Auth routes in `app/(auth)/` - signin, signout, reset-password, update-password
- **Backend**: JWT validation via Supabase middleware
- **Flow**:
  1. User signs up/in via Supabase Auth
  2. Session stored in cookies (managed by @supabase/ssr)
  3. Backend validates JWT on protected routes
  4. Profile auto-created in public.profiles
  5. Organization context loaded and stored in session-context

### 3. Dashboard Widgets
- 16+ widget types with drag-and-drop layout
- Widget configuration stored per user in preferences
- Uses react-grid-layout for positioning
- Dashboard data context (`dashboard-data-context.tsx`) manages state
- Widget factory pattern for dynamic rendering

### 4. AI Integration
- Google Gemini API for order text extraction and OCR
- Supports text, image, and XML parsing
- Located in `backend/src/services/aiService.ts`
- AI controller exposes endpoints for extraction

### 5. Order Management
- Multi-channel support (WhatsApp, Facebook, Instagram, phone, website, manual, messenger)
- Bulk import functionality
- Order items stored as JSONB in orders table
- Normalized order_items table for relational queries
- Delivery tracking integration with multiple providers
- Order status workflow: pending → confirmed → processing → shipped → delivered

### 6. Data Access Patterns
- **CRITICAL**: Frontend uses custom database hooks for ALL data operations:
  - `use-database-optimized.ts` - Primary hook with caching, LRU eviction (used by most pages)
  - `use-database-ultra.ts` - Advanced hook with deduplication, batching (used by dashboard-data-context)
  - Both hooks provide `useData()` for queries and `useMutation()` for inserts/updates/deletes
- **Auto-Population**: Mutation hooks automatically inject:
  - `organization_id` for all multi-tenant tables (see `database-constants.ts`)
  - `user_id` for tables requiring user ownership (products, customers, etc.)
- Multi-tenant tables list in `database-constants.ts` - keep in sync with schema
- Database optimization RPCs in `create_optimization_rpcs.sql`
- Performance indexes in `add_missing_indexes.sql`
- Field selection optimization via `FIELD_SELECTIONS` in `database-constants.ts`

## Environment Variables

### Frontend (.env.local)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key
- `NEXT_PUBLIC_BASE_URL` - Frontend URL
- `NEXT_PUBLIC_AI_BACKEND_URL` - Backend API URL

### Backend (.env)
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `FRONTEND_URL` - Frontend URL for CORS
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key
- `GEMINI_API_KEY` - Google AI API key

## Testing Approach

### Frontend Testing
```bash
# No test suite currently configured
# Consider adding: Jest + React Testing Library
```

### Backend Testing
```bash
npm run test        # Run Jest tests
npm run test:watch  # Watch mode
# Test files: *.test.ts or *.spec.ts
```

### Manual Testing
1. Start frontend: `cd Front-end && npm run dev`
2. Start backend: `cd backend && npm run dev`
3. Access: http://localhost:3000

## Common Development Tasks

### Add New API Endpoint
1. Create controller function in appropriate `backend/src/controllers/*.controller.ts`
2. Add route definition in corresponding `backend/src/routes/*.routes.ts`
3. Register route in `backend/src/routes/index.ts`
4. Update frontend API client in `Front-end/lib/api-client.ts` if needed
5. Add authentication middleware if endpoint requires auth

### Add New Dashboard Widget
1. Create widget component in `Front-end/components/dashboard/widgets/`
2. Register in widget factory (`Front-end/components/dashboard/widget-factory.tsx`)
3. Add widget type to dashboard configuration
4. Widget data should use dashboard-data-context for state management

### Modify Database Schema
1. Make changes in Supabase dashboard or via SQL
2. Update `DB.md` with schema documentation
3. Update TypeScript types in `Front-end/types/database.ts`
4. Update RLS policies in Supabase (document in `Policies.md`)
5. Add performance indexes to `add_missing_indexes.sql` if needed
6. Create optimization RPCs in `create_optimization_rpcs.sql` if needed

### Add New Organization Feature
1. Ensure data is scoped by `organization_id` in database (NOT NULL constraint)
2. Add table to `MULTI_TENANT_TABLES` in `database-constants.ts`
3. Add RLS policies using security definer functions (`user_is_in_organization()`)
4. Use organization context from `useOrganization()` hook in frontend
5. Backend should validate organization membership via middleware
6. Test with organization switching to ensure proper isolation

### Handle Organization Onboarding
- Use `create_organization_with_membership` RPC for atomic operations
- This creates both organization AND team_member records in one transaction
- Updates user's profile.organization_id and JWT metadata
- **Never** create organizations without corresponding team_member records
- See `onboarding.controller.ts` for reference implementation

### Implement Delivery Provider
1. Add provider service in `backend/src/services/deliveryService.ts`
2. Implement provider-specific API integration
3. Add provider to delivery_bookings table provider enum
4. Update frontend delivery selection UI
5. Add provider credentials to environment variables

## Code Patterns

### API Response Format
```typescript
{
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}
```

### Error Handling
- Backend: Try-catch blocks with proper HTTP status codes
- Frontend: Toast notifications via Sonner (from 'sonner' package)
- Validation: Zod (frontend), express-validator/Joi (backend)
- Always return user-friendly error messages

### Type Safety
- Shared types between frontend and backend where possible
- Strict TypeScript configuration on both sides
- Zod schemas for runtime validation in frontend forms
- Database types defined in `Front-end/types/database.ts`

### Authentication Patterns
- **Frontend Client Components**: Use `createClient()` from `lib/supabase/client.ts`
- **Frontend Server Components**: Use `await createClient()` from `lib/supabase/server.ts`
- **Backend**: Use Supabase service role client for admin operations
- Always check authentication state before accessing protected resources
- Use middleware for route-level auth guards

### Organization Context Usage
```typescript
// In any component
const { organization, loading } = useOrganization();

// All data queries should filter by organization.id
const { data } = await supabase
  .from('orders')
  .select('*')
  .eq('organization_id', organization.id);
```

### Data Fetching Patterns
```typescript
// CORRECT: Using optimized hooks for data access
import { useData, useMutation } from '@/hooks/use-database-optimized'

// Query data with automatic organization scoping
const { data: customers, loading, error } = useData<Customer>({
  table: 'customers',
  select: 'id,name,phone,email,total_spent',
  orderBy: { column: 'created_at', ascending: false },
  limit: 20,
  realtime: true, // Optional: enable real-time updates
  staleTime: 30000 // Optional: cache time in ms
})

// Mutations auto-inject organization_id and user_id
const { insert, update, remove } = useMutation<Customer>('customers')

// Insert (organization_id and user_id added automatically)
await insert({ name: 'John Doe', phone: '+880...' })

// Update requires ID
await update('customer-uuid', { phone: '+880...' })

// Delete requires ID
await remove('customer-uuid')
```

**IMPORTANT**: Never manually add `organization_id` or `user_id` - hooks handle this automatically

## Important Implementation Notes

### Supabase SSR (@supabase/ssr)
- **CRITICAL**: Always use the correct Supabase client for the context
  - Client Components: `createClient()` from `lib/supabase/client.ts`
  - Server Components/Actions: `await createClient()` from `lib/supabase/server.ts`
- Middleware handles cookie refresh for session management
- Never mix client/server Supabase clients

### Multi-Organization Support
- Users can belong to multiple organizations via `team_members` table
- Organization switching:
  - Frontend: `switchOrganization()` from `organization-context.tsx`
  - Backend: `/api/v1/organizations/switch` endpoint updates JWT metadata
  - Requires `Authorization: Bearer <token>` header
- **CRITICAL**: All database queries for multi-tenant tables MUST filter by `organization_id`
  - Custom hooks automatically handle this (see `requiresOrgScope()` in `database-constants.ts`)
  - RLS policies enforce isolation at database level as additional security layer
- Team members have role-based permissions: owner, admin, sales, inventory, support, viewer
- Security definer functions (`user_is_in_organization`, `user_organizations_where_admin`) prevent RLS recursion

### Performance Optimization
- Database indexes are defined in `add_missing_indexes.sql`
- Complex queries use stored procedures in `create_optimization_rpcs.sql`
- Multiple optimization variants of hooks exist (e.g., `use-database-optimized.ts`)
- Use these optimized versions when dealing with large datasets

### Security Considerations
- **RLS Policies**: All tables have Row Level Security (documented in `Policies.md`)
  - Use security definer functions to prevent infinite recursion
  - Always add `SET search_path TO 'public', 'pg_temp'` to security definer functions
  - Wrap `auth.uid()` in `(SELECT auth.uid())` for query performance
- **Backend Authentication**:
  - Uses Supabase service role key for admin operations
  - `authenticate` middleware validates JWT on protected routes
  - `requireRole()` and `requirePermission()` for authorization
  - Always validate organization membership before data access
- **Frontend Authentication**:
  - Uses Supabase anon key with RLS enforcement
  - Session managed via cookies (@supabase/ssr)
  - Organization context provides user and org data
- **Foreign Keys**: Reference `profiles(id)` not `auth.users(id)` for PostgREST compatibility

## Common Issues and Troubleshooting

### "Skipping query for [table] - no organization ID available"
- **Cause**: Organization context still loading or user not onboarded
- **Fix**: Ensure all early returns in organization context call `setIsLoading(false)`
- Check that user completed onboarding flow (has organization record)

### "Failed to create" or "column cannot be null" errors
- **Cause**: Required fields not auto-populated (`organization_id`, `user_id`)
- **Fix**: Verify mutation hooks are from `use-database-optimized.ts` or `use-database-ultra.ts`
- Check that hooks extract both `organizationId` and `user` from context

### "infinite recursion detected in policy"
- **Cause**: RLS policy queries the same table it's protecting
- **Fix**: Create security definer function to bypass RLS for that specific check
- Example: `user_is_in_organization()` function for team_members checks

### "Could not find a relationship between [table1] and [table2]"
- **Cause**: Foreign key references `auth.users` instead of `profiles`
- **Fix**: Change FK constraint to reference `profiles(id)` for PostgREST compatibility

### Organization Context Stuck Loading
- **Cause**: Missing `setIsLoading(false)` before early returns
- **Fix**: Add `setIsLoading(false)` to ALL return paths in `fetchOrganization()`

### Build Warnings: "React Hook has an unnecessary dependency"
- **Cause**: Dependency used only in conditional path
- **Fix**: Remove dependency if not in main execution path (e.g., `user` in update/delete)

## Deployment Considerations

### Frontend
- Optimized for Vercel deployment
- Static generation where possible
- Image optimization configured
- Build command: `eslint && next build`

### Backend
- Docker-ready architecture
- PM2 for process management
- Environment-based configuration
- Uses tsconfig-paths for module resolution in production

### Database
- Supabase managed PostgreSQL
- Automatic backups configured
- Connection pooling for scale
- Migration workflow: Update schema → Update DB.md → Update types → Update RLS policies