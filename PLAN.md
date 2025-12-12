# ArtyConnect Platform Plan

## Tech Stack
- **Frontend/Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules (Vanilla CSS as requested)
- **Backend**: Next.js API Routes (Serverless)
- **Auth**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Security**: Row Level Security (RLS) via Supabase

## Architecture

### 1. Authentication (Auth)
We are using **Supabase Auth** for handling authentication.
- **Client**: `@supabase/ssr` for Next.js App Router.
- **Middleware**: Manages session refresh.
- **Providers**: Email/Password, Google (OAuth).

### 2. Row Level Security (RLS)
- **Implementation**:
    - All database access is done via the Supabase client.
    - RLS policies are defined in the Supabase Dashboard or SQL Editor.
    - Example Policy: `CREATE POLICY "User can see their own data" ON "housekeeping_jobs" FOR SELECT USING (auth.uid() = user_id);`

## Database Schema
The schema supports multi-tenancy via `organizations`.
- `profiles`: User details.
- `organizations`: Tenant entities.
- `organization_members`: Links users to tenants with roles.
- `properties`: Houses/Buildings.
- `rooms`: Individual units/rooms within properties (e.g., Room 305).
- `bookings`: Guest reservations linked to rooms.
- `pms_sync_events`: Logs for incoming PMS webhooks (RMS, Cloudbeds, etc.).
- `jobs`: Cleaning tasks.

## Billing & Subscriptions
- **Model**: No free tier.
- **Setup Fee**: AU$1,500 (One-time integration fee).
- **Recurring**: AU$3.50 per room/month.
- **Implementation**:
    - Store subscription status in `organizations`.
    - Gate access to features based on status.
    - Integration with Stripe (Future).

## Next Steps
1. **User Action Required**: Run the SQL in `supabase/schema.sql` in the Supabase SQL Editor.
2. **Dev**: Create a "Create Organization" flow for new users.
3. **Dev**: Create a "Dashboard" to list properties/jobs.
4. **Dev**: Implement Billing UI and Logic.
