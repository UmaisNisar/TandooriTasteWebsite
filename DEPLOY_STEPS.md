# Quick Deployment Steps - Tandoori Taste Website

## Your Deployment Information

**NEXTAUTH_SECRET (Generated):**
```
zFngR2fkmP1TlN4lklG7YlLmWtwYd+hETT5dJ/VZBxk=
```

**GitHub Repository:**
```
https://github.com/UmaisNisar/TandooriTasteWebsite
```

---

## Option 1: Deploy via Vercel Dashboard (Recommended - 5 minutes)

### Step 1: Go to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Sign in with your **GitHub account** (same account that has the repository)

### Step 2: Import Your Project
1. Click **"Add New..."** → **"Project"**
2. Find **"TandooriTasteWebsite"** in your repositories list
3. Click **"Import"**

### Step 3: Configure Project Settings
Vercel will auto-detect Next.js. Verify these settings:
- **Framework Preset**: Next.js ✅
- **Root Directory**: `./` ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `.next` ✅
- **Install Command**: `npm install` ✅

### Step 4: Add Environment Variables
**BEFORE clicking Deploy**, click **"Environment Variables"** and add these:

| Variable Name | Value |
|--------------|-------|
| `NEXTAUTH_SECRET` | `zFngR2fkmP1TlN4lklG7YlLmWtwYd+hETT5dJ/VZBxk=` |
| `NEXTAUTH_URL` | `https://tandoori-taste-website.vercel.app` (or your project name) |
| `DATABASE_URL` | `file:./dev.db` |

**Important:** 
- Replace `tandoori-taste-website.vercel.app` with your actual Vercel domain after first deployment
- For `NEXTAUTH_URL`, you'll get the actual URL after deployment (e.g., `https://your-project-name.vercel.app`)

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait 2-5 minutes for the build to complete
3. Your site will be live! 🎉

### Step 6: Update NEXTAUTH_URL (After First Deployment)
1. After deployment, Vercel will show your live URL (e.g., `https://tandoori-taste-website-xyz.vercel.app`)
2. Go to **Project Settings** → **Environment Variables**
3. Update `NEXTAUTH_URL` to match your actual domain
4. Click **"Redeploy"** to apply changes

---

## Option 2: Deploy via CLI

### Step 1: Login to Vercel
```bash
npx vercel login
```
- This will open a browser window
- Visit the URL shown in terminal
- Authorize the CLI

### Step 2: Deploy
```bash
npx vercel
```
Follow the prompts:
- Link to existing project? → **No** (first time)
- Project name? → `tandoori-taste-website` (or your choice)
- Directory? → `./`
- Override settings? → **No**

### Step 3: Add Environment Variables
```bash
# Add NEXTAUTH_SECRET
npx vercel env add NEXTAUTH_SECRET
# Paste: zFngR2fkmP1TlN4lklG7YlLmWtwYd+hETT5dJ/VZBxk=

# Add NEXTAUTH_URL (update with your actual domain after first deploy)
npx vercel env add NEXTAUTH_URL
# Paste: https://your-project-name.vercel.app

# Add DATABASE_URL
npx vercel env add DATABASE_URL
# Paste: file:./dev.db
```

### Step 4: Deploy to Production
```bash
npx vercel --prod
```

---

## After Deployment - Important Steps

### 1. Seed the Database
After first deployment, you need to seed the database with initial data:

**Option A: Using Vercel CLI**
```bash
# Pull environment variables
npx vercel env pull .env.local

# Run seed
npm run seed
```

**Option B: Create Temporary API Route**
Create `app/api/seed/route.ts` (temporary file):
```typescript
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    await execAsync('npm run seed');
    return NextResponse.json({ success: true, message: 'Database seeded successfully' });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
```

Then visit: `https://your-app.vercel.app/api/seed` once, then delete the file.

### 2. Access Admin Panel
- URL: `https://your-project.vercel.app/admin/login`
- Username: `admin`
- Password: `admin123`
- ⚠️ **CHANGE PASSWORD IMMEDIATELY!**

### 3. Upload Content
- Add menu items
- Upload images for home slider
- Configure store hours
- Add testimonials
- Update all content

---

## ⚠️ Important Notes

### SQLite Limitation
SQLite files are **ephemeral** on Vercel serverless. This means:
- Data may be lost on redeploy
- Fine for development/demo
- **For production**, consider migrating to PostgreSQL:
  - Vercel Postgres (easiest, integrated)
  - Supabase (free tier available)
  - Railway or Neon

### Database Migration to PostgreSQL
If you want persistent data, see `scripts/setup-postgres.md` for instructions.

---

## Troubleshooting

### Build Fails
1. Check build logs in Vercel dashboard
2. Verify all environment variables are set
3. Ensure `NEXTAUTH_SECRET` is valid base64 string

### Authentication Not Working
1. Verify `NEXTAUTH_SECRET` is set correctly
2. Check `NEXTAUTH_URL` matches your domain exactly
3. Redeploy after updating environment variables

### Database Issues
1. SQLite: Data may reset on redeploy (expected behavior)
2. Consider PostgreSQL for production use

---

## Quick Checklist

- [ ] Deploy to Vercel (Dashboard or CLI)
- [ ] Set environment variables
- [ ] Update NEXTAUTH_URL after first deploy
- [ ] Seed database
- [ ] Access admin panel
- [ ] Change admin password
- [ ] Upload content
- [ ] Test all features

---

## Your Generated Secrets

**NEXTAUTH_SECRET:**
```
zFngR2fkmP1TlN4lklG7YlLmWtwYd+hETT5dJ/VZBxk=
```

**Save this securely!** You'll need it for environment variables.

---

## Next Steps After Deployment

1. ✅ Deploy to Vercel
2. ⏳ Seed database
3. ⏳ Configure admin panel
4. ⏳ Upload content
5. ⏳ Test all features
6. ⏳ Consider PostgreSQL migration for production

Your website will be live in minutes! 🚀

