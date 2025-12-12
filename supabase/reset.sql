-- RESET SCRIPT: Drop all tables and recreate fresh
-- Run this in Supabase SQL Editor to start clean

-- 1. DROP ALL TABLES (in reverse order due to dependencies)
DROP TABLE IF EXISTS public.jobs CASCADE;
DROP TABLE IF EXISTS public.pms_sync_events CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.rooms CASCADE;
DROP TABLE IF EXISTS public.properties CASCADE;
DROP TABLE IF EXISTS public.organization_members CASCADE;
DROP TABLE IF EXISTS public.organizations CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. DROP CUSTOM TYPES
DROP TYPE IF EXISTS public.job_status CASCADE;
DROP TYPE IF EXISTS public.booking_status CASCADE;
DROP TYPE IF EXISTS public.room_status CASCADE;
DROP TYPE IF EXISTS public.app_role CASCADE;

-- 3. DROP FUNCTIONS & TRIGGERS
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Success message
SELECT 'All tables, types, and functions dropped successfully!' as status;
