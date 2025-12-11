# Quick Deploy to Vercel

Your code is now on GitHub: https://github.com/UmaisNisar/TandooriTasteWebsite

## Deploy to Vercel (5 minutes)

### Step 1: Go to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Sign in with your GitHub account

### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Find **"TandooriTasteWebsite"** in your repositories
3. Click **"Import"**

### Step 3: Configure Project
- **Framework Preset**: Next.js (auto-detected) ✅
- **Root Directory**: `./` (default) ✅
- **Build Command**: `npm run build` (default) ✅
- **Output Directory**: `.next` (default) ✅
- **Install Command**: `npm install` (default) ✅

### Step 4: Add Environment Variables
Click **"Environment Variables"** and add:

```
NEXTAUTH_SECRET = [Generate with: openssl rand -base64 32]
NEXTAUTH_URL = https://your-project-name.vercel.app
DATABASE_URL = "file:./dev.db"
```

**To generate NEXTAUTH_SECRET:**
- Windows PowerShell: `[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))`
- Or use: https://generate-secret.vercel.app/32

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait 2-5 minutes for build to complete
3. Your site will be live at: `https://your-project-name.vercel.app`

## After Deployment

### 1. Seed the Database
After first deployment, you need to seed the database. You can:
- Use Vercel CLI: `vercel env pull .env.local` then `npm run seed`
- Or create a temporary API route (see VERCEL_DEPLOYMENT.md)

### 2. Access Admin Panel
- URL: `https://your-project-name.vercel.app/admin/login`
- Username: `admin`
- Password: `admin123`
- ⚠️ **Change password immediately!**

### 3. Upload Content
- Add menu items
- Upload images for home slider
- Configure store hours
- Add testimonials
- Update all content

## Important Notes

⚠️ **SQLite Limitation**: SQLite files are ephemeral on Vercel serverless. Data may be lost on redeploy.

**For Production**: Consider migrating to PostgreSQL:
- Use Vercel Postgres (easiest)
- Or Supabase/Railway/Neon
- See `scripts/setup-postgres.md` for instructions

## Troubleshooting

If build fails:
1. Check build logs in Vercel dashboard
2. Verify environment variables are set
3. Ensure `NEXTAUTH_SECRET` is a valid base64 string

## Next Steps

1. ✅ Code pushed to GitHub
2. ⏳ Deploy to Vercel (follow steps above)
3. ⏳ Seed database
4. ⏳ Configure admin panel
5. ⏳ Upload content

Your website will be live in minutes! 🚀





