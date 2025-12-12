# GitHub Repository Setup - ArtyConnect

Your code is committed and ready! Now we need to push to GitHub.

---

## Option 1: Using GitHub Desktop (Easiest) ✨

1. **Download GitHub Desktop**: https://desktop.github.com/
2. **Install and sign in**
3. **Add existing repository**:
   - File → Add Local Repository
   - Choose: `c:\Users\Housekeeping\OneDrive\Apps\ArtyConnect`
4. **Publish repository**:
   - Click "Publish repository" button
   - Name: `artyhospitality`
   - ✅ Keep code private
   - Click "Publish repository"
5. ✅ Done! Skip to "After Push" section below

---

## Option 2: Command Line with Personal Access Token

### Step 1: Create Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Fill in:
   - **Note**: `ArtyConnect Deployment`
   - **Expiration**: 90 days (or No expiration)
   - **Scopes**: ✅ Check `repo` (full control)
4. Click **"Generate token"**
5. **COPY THE TOKEN** (you won't see it again!)
   - Format: `ghp_xxxxxxxxxxxxxxxxxxxx`

### Step 2: Create Repository on GitHub

1. Go to: https://github.com/new
2. Fill in:
   - **Owner**: aemmykun
   - **Repository name**: `artyhospitality`
   - **Visibility**: 🔒 Private
   - ❌ Do NOT check "Initialize with README"
3. Click **"Create repository"**

### Step 3: Push Code (I'll run these commands)

Once you have the token, tell me and I'll run:

```bash
git remote add origin https://github.com/aemmykun/artyhospitality.git
git push -u origin master
# (Will prompt for username and password - use token as password)
```

---

## After Push (Both Options)

Once code is on GitHub:

1. ✅ Verify at: https://github.com/aemmykun/artyhospitality
2. ✅ You should see all your files
3. ✅ Ready for Vercel deployment!

---

## What to Tell Me

After you've pushed (either method):

1. ✅ "Code is on GitHub"
2. ✅ Your Supabase URL and anon key
   - Then I'll help deploy to Vercel!
