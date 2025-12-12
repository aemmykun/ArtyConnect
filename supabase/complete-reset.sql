-- COMPLETE RESET: Drop EVERYTHING including old schema
-- Run this in Supabase SQL Editor

-- Drop ALL tables (old + new)
DROP TABLE IF EXISTS public.inventory_usage CASCADE;
DROP TABLE IF EXISTS public.analytics CASCADE;
DROP TABLE IF EXISTS public.maintenance_reports CASCADE;
DROP TABLE IF EXISTS public.reservations CASCADE;
DROP TABLE IF EXISTS public.rosters CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.inventory CASCADE;
DROP TABLE IF EXISTS public.checklist_templates CASCADE;
DROP TABLE IF EXISTS public.guests CASCADE;
DROP TABLE IF EXISTS public.staff CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.alembic_version CASCADE;
DROP TABLE IF EXISTS public.jobs CASCADE;
DROP TABLE IF EXISTS public.pms_sync_events CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.rooms CASCADE;
DROP TABLE IF EXISTS public.properties CASCADE;
DROP TABLE IF EXISTS public.organization_members CASCADE;
DROP TABLE IF EXISTS public.organizations CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop ALL custom types
DROP TYPE IF EXISTS public.job_status CASCADE;
DROP TYPE IF EXISTS public.booking_status CASCADE;
DROP TYPE IF EXISTS public.room_status CASCADE;
DROP TYPE IF EXISTS public.app_role CASCADE;
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.staff_role CASCADE;
DROP TYPE IF EXISTS public.task_type CASCADE;
DROP TYPE IF EXISTS public.task_status CASCADE;
DROP TYPE IF EXISTS public.priority_level CASCADE;
DROP TYPE IF EXISTS public.reservation_status CASCADE;
DROP TYPE IF EXISTS public.inventory_category CASCADE;
DROP TYPE IF EXISTS public.issue_category CASCADE;
DROP TYPE IF EXISTS public.maintenance_status CASCADE;

-- Drop ALL sequences
DROP SEQUENCE IF EXISTS public.analytics_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.checklist_templates_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.guests_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.inventory_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.inventory_usage_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.maintenance_reports_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.reservations_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.rosters_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.staff_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.tasks_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.users_id_seq CASCADE;

-- Drop triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Success
SELECT 'Complete database reset successful! All old and new tables dropped.' as status;
