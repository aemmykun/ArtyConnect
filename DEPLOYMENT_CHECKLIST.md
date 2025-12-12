# ArtyConnect Deployment Checklist

## ☐ Step 1: Supabase Database Setup

### 1.1 Create Project (if not already created)
- [ ] Go to Supabase Dashboard (already open)
- [ ] Click "New Project"
- [ ] Name: `ArtyConnect`
- [ ] Password: _____________ (save this!)
- [ ] Region: Singapore or Sydney
- [ ] Wait for provisioning (~2 min)

### 1.2 Run Database Schema
- [ ] Go to **SQL Editor** (left sidebar)
- [ ] Click "New Query"
- [ ] Open file: `c:\Users\Housekeeping\OneDrive\Apps\ArtyConnect\supabase\schema.sql`
- [ ] Copy ALL contents
- [ ] Paste into SQL Editor
- [ ] Click "Run" or Ctrl+Enter
- [ ] Verify: "Success. No rows returned"

### 1.3 Verify Tables
- [ ] Go to **Table Editor** (left sidebar)
- [ ] Check these tables exist:
  - [ ] profiles
  - [ ] organizations
  - [ ] organization_members
  - [ ] properties
  - [ ] rooms
  - [ ] bookings
  - [ ] pms_sync_events
  - [ ] jobs

### 1.4 Get API Keys
- [ ] Go to **Project Settings** → **API**
- [ ] Copy and save:
  ```
  Project URL: _________________________________
  anon key: ____________________________________
  ```

---

## ☐ Step 2: Create GitHub Repository

### Option A: GitHub Desktop (Recommended)
- [ ] Download: https://desktop.github.com/
- [ ] Install and sign in as `aemmykun`
- [ ] File → Add Local Repository
- [ ] Path: `c:\Users\Housekeeping\OneDrive\Apps\ArtyConnect`
- [ ] Click "Publish repository"
- [ ] Name: `artyhospitality`
- [ ] ✅ Private
- [ ] Click "Publish"

### Option B: Command Line
- [ ] Create token: https://github.com/settings/tokens
- [ ] Create repo: https://github.com/new
  - Owner: aemmykun
  - Name: artyhospitality
  - Private
- [ ] Tell me token, I'll push the code

---

## ☐ Step 3: Deploy to Vercel

(I'll help with this after Steps 1 & 2 are complete)

- [ ] Go to vercel.com/dashboard
- [ ] Import GitHub repo
- [ ] Add Supabase environment variables
- [ ] Deploy!

---

## ✅ When Complete

Tell me:
1. ✅ Supabase Project URL: `_____________`
2. ✅ Supabase anon key: `_____________`
3. ✅ GitHub repo URL: `https://github.com/aemmykun/artyhospitality`

Then we deploy to Vercel! 🚀
