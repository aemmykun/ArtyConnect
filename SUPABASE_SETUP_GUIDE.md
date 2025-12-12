# Supabase Setup Guide - ArtyConnect

## Step 1: Create Supabase Project

1. **Go to**: https://supabase.com/dashboard
2. **Sign in** with your account
3. Click **"New Project"**
4. Fill in:
   - **Name**: `ArtyConnect` (or `ArtyHospitality`)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: `Southeast Asia (Singapore)` or `Sydney` (closest to AU)
   - **Pricing Plan**: Free (for now)
5. Click **"Create new project"**
6. ⏳ Wait ~2 minutes for database to provision

---

## Step 2: Run Database Schema

1. Once project is ready, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. **Open this file**: `c:\Users\Housekeeping\OneDrive\Apps\ArtyConnect\supabase\schema.sql`
4. **Copy ALL contents** from schema.sql
5. **Paste** into SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)
7. ✅ Should see: "Success. No rows returned"

---

## Step 3: Verify Tables Created

1. Go to **Table Editor** (left sidebar)
2. You should see these tables:
   - ☑️ profiles
   - ☑️ organizations
   - ☑️ organization_members
   - ☑️ properties
   - ☑️ rooms
   - ☑️ bookings
   - ☑️ pms_sync_events
   - ☑️ jobs

---

## Step 4: Copy API Keys

1. Go to **Project Settings** → **API**
2. Copy these values (you'll need them soon):

### Save These:
```
Project URL: https://xxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**IMPORTANT**: Keep these secure! Don't share them publicly.

---

## Step 5: Configure Authentication

1. Go to **Authentication** → **Providers**
2. **Email** should be enabled by default ✓
3. (Optional) Enable **Google OAuth**:
   - Will configure redirect URLs after Vercel deployment

---

## When Done

✅ Come back and tell me:
- "Supabase is ready"
- (paste your Project URL and anon key - I'll help add to .env.local)

Then we'll push to GitHub!
