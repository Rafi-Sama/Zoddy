# Zoddy Backend

**Express.js + TypeScript backend for Zoddy Business Management System**

A comprehensive API server for small businesses in Bangladesh operating through WhatsApp, Facebook, and social media platforms.

---

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

Server runs at `http://localhost:5000`

---

## Tech Stack

- **Runtime:** Node.js 18+, Express.js 4.21+
- **Language:** TypeScript 5 (strict mode)
- **Database:** Supabase (PostgreSQL)
- **Auth:** WorkOS + JWT
- **AI:** Google Gemini (gemini-pro, gemini-pro-vision)
- **Delivery:** eCourier, RedX, Pathao APIs
- **Email:** Gmail API
- **Security:** Helmet, rate limiting, XSS protection, CORS

---

## Features

- **Authentication:** WorkOS OAuth + JWT with RBAC
- **Orders:** Full CRUD, multi-channel support (WhatsApp/Facebook), payment tracking
- **Customers:** CRM with order history and analytics
- **Inventory:** Stock management, low-stock alerts, movement history
- **AI Processing:** Order extraction from text/images (Bengali/English), OCR, insights
- **Delivery:** Integration with Bangladesh delivery providers
- **Team:** Multi-user collaboration with role-based permissions
- **Analytics:** Revenue trends, top products/customers

---

## Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000

# WorkOS Auth
WORKOS_API_KEY=sk_test_...
WORKOS_CLIENT_ID=client_...
JWT_SECRET=your_32+_char_secret

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Google Gemini AI
GEMINI_API_KEY=AIza...
ENABLE_AI_PROCESSING=true

# Gmail (Optional)
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
GMAIL_REFRESH_TOKEN=...
ENABLE_EMAIL_NOTIFICATIONS=true

# Delivery Providers (Optional)
ENABLE_DELIVERY_INTEGRATION=true
ECOURIER_API_KEY=...
REDX_API_KEY=...
PATHAO_CLIENT_ID=...

# Security
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## API Reference

**Base URL:** `http://localhost:5000/api/v1`

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/workos-callback` | POST | Exchange WorkOS code for JWT |
| `/auth/me` | GET | Get current user |

### Orders

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/orders` | GET | List orders (pagination, filters) |
| `/orders` | POST | Create order |
| `/orders/:id` | GET | Get order details |
| `/orders/:id` | PUT | Update order |
| `/orders/:id` | DELETE | Delete order |
| `/orders/stats` | GET | Order statistics |

**Create Order Example:**
```json
{
  "customer_name": "আহমেদ আলী",
  "customer_phone": "01712345678",
  "customer_address": "Dhaka",
  "items": [{"name": "Shirt", "quantity": 2, "price": 500}],
  "total_amount": 1000,
  "payment_method": "bkash"
}
```

### AI Processing

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/ai/extract-from-text` | POST | Extract order from text (Bengali/English) |
| `/ai/extract-from-image` | POST | OCR from image |
| `/ai/parse-xml` | POST | Parse XML order file |
| `/ai/generate-insights` | POST | Generate business insights |

### Products

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/products` | GET | List products |
| `/products/low-stock` | GET | Low stock alerts |
| `/products/:id/stock` | POST | Update stock (in/out/adjustment) |

### Delivery

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/delivery/providers` | GET | List providers (eCourier, RedX, Pathao) |
| `/delivery/book` | POST | Book delivery |
| `/delivery/track/:provider/:id` | GET | Track delivery |
| `/delivery/cancel` | POST | Cancel delivery |

### Customers

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/customers` | GET | List customers |
| `/customers/:id` | GET/PUT/DELETE | Customer CRUD |

### Team

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/team/members` | GET | List team members |
| `/team/invite` | POST | Invite member |
| `/team/members/:id` | PUT/DELETE | Update/remove member |

### Analytics

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/analytics/overview` | GET | Overall analytics |
| `/analytics/revenue-trend` | GET | Revenue over time |
| `/analytics/top-products` | GET | Best sellers |
| `/analytics/top-customers` | GET | Top customers by spend |

### Health Check

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Basic health check |
| `/health/detailed` | GET | Detailed system status |
| `/health/ready` | GET | Kubernetes readiness probe |
| `/health/live` | GET | Kubernetes liveness probe |

---

## Authentication

All endpoints (except `/auth/*` and `/health`) require JWT authentication:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**JWT Payload:**
```json
{
  "userId": "user_123",
  "email": "user@example.com",
  "organizationId": "org_123",
  "iat": 1705315200,
  "exp": 1705920000
}
```

**Roles:** owner, admin, member
**Permissions:** canManageOrders, canManageCustomers, canManageInventory, canViewAnalytics, canManageTeam

---

## Error Responses

```json
{
  "success": false,
  "status": "error",
  "message": "Error description"
}
```

**Status Codes:**
- `200` OK
- `201` Created
- `400` Bad Request / Validation Error
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
- `409` Conflict (duplicate resource)
- `429` Too Many Requests
- `500` Internal Server Error

---

## Development

```bash
npm run dev          # Development with hot reload
npm run build        # Compile TypeScript
npm start            # Production server
npm test             # Run tests
npm run lint         # ESLint
npm run type-check   # TypeScript check
```

---

## Project Structure

```
backend/
├── src/
│   ├── app.ts                  # Express app setup
│   ├── server.ts               # Server entry point
│   ├── controllers/            # Request handlers
│   ├── models/                 # Database models
│   ├── services/               # Business logic (AI, delivery, email)
│   ├── middleware/             # Auth, validation, error handling
│   ├── routes/                 # API route definitions
│   ├── validators/             # Joi schemas
│   ├── types/                  # TypeScript types
│   ├── utils/                  # Helpers (logger, constants, validators)
│   ├── jobs/                   # Cron jobs
│   └── db/                     # Database schema
├── logs/                       # Winston logs
├── dist/                       # Compiled JS
├── package.json
├── tsconfig.json
├── Dockerfile
└── ecosystem.config.js         # PM2 config
```

---

## Security Features

- ✅ Helmet security headers
- ✅ CORS with whitelist
- ✅ Rate limiting (100 req/15min)
- ✅ XSS protection
- ✅ SQL injection prevention
- ✅ Input validation (Joi + express-validator)
- ✅ JWT with issuer/audience validation
- ✅ Secure error handling (no stack traces in production)
- ✅ Optimistic locking for stock updates (prevents race conditions)

---

## Production Deployment

### PM2 (Recommended)
```bash
npm ci --production=false
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Docker
```bash
docker build -t zoddy-backend .
docker run -d -p 5000:5000 --env-file .env zoddy-backend
```

### Health Checks
- **Readiness:** `GET /health/ready`
- **Liveness:** `GET /health/live`

---

## Database Schema

**Tables:** users, orders, customers, products, stock_movements, team_members, delivery_bookings

**Key Features:**
- UUID primary keys
- Row-level security (RLS) policies
- Indexes on user_id, organization_id, status
- JSONB for flexible data (order items, permissions)
- Timestamps (created_at, updated_at)

See `src/db/schema.sql` for full schema.

---

## Testing Examples

### cURL
```bash
# Create order
curl -X POST http://localhost:5000/api/v1/orders \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"Test","customer_phone":"01712345678","customer_address":"Dhaka","items":[{"name":"Product","quantity":1,"price":500}],"total_amount":500,"payment_method":"cash"}'

# Extract order from text
curl -X POST http://localhost:5000/api/v1/ai/extract-from-text \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"নাম: রহিম, ফোন: 01812345678, পণ্য: শার্ট x2 @ 500"}'
```

---

## License

MIT License - Copyright (c) 2025 Zoddy

---

**Made with ❤️ for Bangladeshi businesses**
