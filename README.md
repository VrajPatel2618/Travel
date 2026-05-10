# Traveloop

Traveloop is a production-ready AI-powered travel planning SaaS scaffold with a premium Next.js frontend, Express REST API, PostgreSQL schema, Prisma ORM, JWT authentication, RBAC, analytics, and deployment configuration.

## Stack

- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, shadcn-style UI primitives, Lucide Icons, Recharts, TanStack Query, Zustand
- Backend: Node.js, Express, TypeScript, JWT access and refresh tokens, bcrypt, Zod validation, RBAC
- Database: PostgreSQL with Prisma ORM
- Storage-ready: Cloudinary helper included
- Deployment: Vercel for `client`, Render/Railway for `server`, Neon/Supabase PostgreSQL

## Structure

```txt
client/              Next.js app, UI system, hooks, API client
server/              Express API, controllers, services, middleware
prisma/              PostgreSQL schema and seed data
packages/shared/     Reserved for shared types/utilities
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment files:

```bash
cp .env.example .env
cp client/.env.example client/.env.local
cp server/.env.example server/.env
```

3. Start PostgreSQL and set `DATABASE_URL`. A local Docker option is included:

```bash
docker compose up -d
```

4. Generate Prisma client and run migrations:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

Seed users:

```txt
maya@traveloop.ai / Traveloop123!
admin@traveloop.ai / Traveloop123!
```

5. Run the full stack:

```bash
npm run dev
```

Frontend: http://localhost:3000  
Backend: http://localhost:4000  
API health: http://localhost:4000/health

## Useful Commands

```bash
npm run dev:client
npm run dev:server
npm run build
npm run typecheck
npm run db:studio
```

## API Modules

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/verify-email`
- `GET /api/users/me`
- `PATCH /api/users/me`
- `GET /api/trips`
- `POST /api/trips`
- `GET /api/trips/:id`
- `PATCH /api/trips/:id`
- `DELETE /api/trips/:id`
- `POST /api/trips/:id/destinations`
- `PATCH /api/trips/:id/destinations/reorder`
- `POST /api/trips/:id/activities`
- `GET /api/cities`
- `GET /api/activities`
- `GET /api/budgets/trips/:tripId`
- `POST /api/budgets/trips/:tripId/items`
- `GET /api/packing/trips/:tripId`
- `POST /api/packing/trips/:tripId/items`
- `GET /api/journals`
- `POST /api/journals`
- `POST /api/sharing/trips/:tripId`
- `GET /api/sharing/public/:slug`
- `GET /api/analytics/dashboard`
- `GET /api/analytics/admin`

## Deployment Notes

- Vercel: deploy `client/`, set `NEXT_PUBLIC_API_URL` to your hosted API URL.
- Render/Railway: deploy `server/`, set `DATABASE_URL`, `CLIENT_URL`, and JWT secrets.
- Neon/Supabase: create PostgreSQL database, copy connection string to `DATABASE_URL`, then run `npm run db:deploy`.
- Cloudinary: set the three Cloudinary variables to enable image upload helpers.

## Architecture Notes

- Controllers stay thin and call services.
- Services own Prisma queries and business rules.
- Middleware handles auth, RBAC, validation, rate limiting, and error formatting.
- Prisma schema includes cascading deletes, indexes, enums, and optimized relations for the core travel workflow.
- Frontend can run as a beautiful standalone demo while also being API-ready when the backend is available.
