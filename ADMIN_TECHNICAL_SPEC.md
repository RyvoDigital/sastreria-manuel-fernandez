# Admin Dashboard — Technical Specification

## Overview
Full custom admin dashboard built directly into the Next.js 16 app. Password-based JWT auth. Protected by middleware. Connected to existing PostgreSQL database.

## New Dependencies
- `bcryptjs` — password hashing (pure JS, no native deps)
- `jose` — JWT signing/verification (Edge-compatible)
- `@types/bcryptjs` — types

## Database Schema Additions

### admins
- id SERIAL PRIMARY KEY
- name VARCHAR(100)
- email VARCHAR(200) UNIQUE
- password_hash VARCHAR(255)
- role VARCHAR(20) DEFAULT 'manager' — owner | manager | viewer
- created_at TIMESTAMP

### contact_submissions
- id SERIAL PRIMARY KEY
- name VARCHAR(100)
- email VARCHAR(200)
- type VARCHAR(50) DEFAULT 'contact'
- message TEXT
- locale VARCHAR(10) DEFAULT 'es'
- read BOOLEAN DEFAULT FALSE
- created_at TIMESTAMP

### configurations
- id SERIAL PRIMARY KEY
- name VARCHAR(100)
- email VARCHAR(200)
- fabric VARCHAR(100)
- measurements JSONB
- design_options JSONB
- status VARCHAR(50) DEFAULT 'new'
- notes TEXT
- created_at TIMESTAMP

### customer_notes
- id SERIAL PRIMARY KEY
- email VARCHAR(200)
- name VARCHAR(100)
- notes TEXT
- measurements JSONB
- created_at TIMESTAMP
- updated_at TIMESTAMP

### editable_content
- id VARCHAR(100) PRIMARY KEY
- value TEXT
- updated_at TIMESTAMP

## Auth Architecture
- Login: POST /api/admin/auth/login — verify bcrypt hash, issue JWT in httpOnly cookie
- Logout: POST /api/admin/auth/logout — clear cookie
- Me: GET /api/admin/auth/me — verify JWT, return admin user
- Middleware: middleware.ts checks /admin/* routes (except /admin/login) for valid JWT cookie
- Password: initial admin created by setup script using ADMIN_PASSWORD env var

## API Routes

### Auth
- POST /api/admin/auth/login
- POST /api/admin/auth/logout
- GET /api/admin/auth/me

### Data
- GET /api/admin/bookings — list bookings with filters
- PATCH /api/admin/bookings/:id — update status/cancel
- GET /api/admin/contacts — list contact submissions
- PATCH /api/admin/contacts/:id — mark as read
- GET /api/admin/payments — fetch from Stripe
- GET /api/admin/configurations — list configurator submissions
- PATCH /api/admin/configurations/:id — update status/notes
- GET /api/admin/customers — aggregated customer directory
- PATCH /api/admin/customers/:email — update notes/measurements
- GET /api/admin/content — list editable content
- PUT /api/admin/content/:id — update content value
- GET /api/admin/stats — dashboard aggregation

## Frontend Structure

### Layout
- app/admin/layout.tsx — auth check, redirect to /admin/login if no session
- Sidebar navigation with icons from lucide-react
- Header with admin name and logout

### Pages
- /admin/login — clean login form
- /admin — dashboard overview cards + recent activity
- /admin/bookings — table + calendar view of appointments
- /admin/contacts — inbox-style list of form submissions
- /admin/payments — Stripe payment list
- /admin/configurations — configurator orders table
- /admin/customers — customer directory with search
- /admin/content — editable text fields for site copy
- /admin/settings — business hours, pricing, slots
- /admin/analytics — charts (revenue, bookings, conversion)

## Stripe Integration for Payments View
- Server-side fetch from Stripe API using existing STRIPE_SECRET_KEY
- List checkout sessions with expanded customer data
- Filter by date range

## Security
- All admin API routes verify JWT cookie
- Passwords hashed with bcrypt (12 rounds)
- HTTP-only, Secure, SameSite=strict cookies
- No admin routes cached
- Role-based UI hiding (viewer cannot edit)

## Setup Steps
1. Install dependencies
2. Add new tables to setup-db.ts
3. Create default admin user on first run
4. Set ADMIN_PASSWORD in .env
5. Build all API routes
6. Build all frontend pages
7. Add middleware.ts for route protection
