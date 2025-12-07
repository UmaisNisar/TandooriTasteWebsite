# Step-by-Step Vercel Deployment Guide

## Prerequisites

- ✅ Code pushed to GitHub/GitLab/Bitbucket
- ✅ Node.js 18+ installed locally
- ✅ Vercel account (free tier works)

---

## Step 1: Prepare Your Code

### 1.1 Generate Environment Variables

Run the environment variable generator:

```bash
node scripts/generate-env.js --production
```

This creates `.env.production` with secure values. **Do not commit this file!**

### 1.2 Test Build Locally

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Build for production
npm run build

# Test production build
npm start
```

Visit `http://localhost:3000` and verify everything works.

---

## Step 2: Push to Git Repository

If not already done:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

## Step 3: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended for First Time)

1. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub/GitLab/Bitbucket

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Select your repository
   - Click "Import"

3. **Configure Project:**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Add Environment Variables:**
   Click "Environment Variables" and add:

   ```
   NEXTAUTH_SECRET = [paste from .env.production]
   NEXTAUTH_URL = https://your-project-name.vercel.app
   DATABASE_URL = "file:./dev.db"
   ```

   ⚠️ **Note**: For SQLite, you may need to use Vercel's file system or switch to PostgreSQL (see Step 4).

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (2-5 minutes)

### Option B: Via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project? → No (first time)
   - Project name? → `tandoori-tastes` (or your choice)
   - Directory? → `./`
   - Override settings? → No

4. **Add Environment Variables:**
   ```bash
   vercel env add NEXTAUTH_SECRET
   vercel env add NEXTAUTH_URL
   vercel env add DATABASE_URL
   ```
   
   Paste values when prompted.

5. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

---

## Step 4: Database Setup

### Option A: SQLite (Simple, but Limited)

⚠️ **Warning**: SQLite files are ephemeral on Vercel serverless. Data may be lost on redeploy.

**For Development/Demo Only:**
- Already configured
- No additional setup needed
- Run seed after deployment (see Step 6)

### Option B: PostgreSQL (Recommended for Production)

1. **Choose a PostgreSQL Provider:**
   - **Vercel Postgres** (easiest, integrated)
   - **Supabase** (free tier available)
   - **Railway** (easy setup)
   - **Neon** (serverless)

2. **Set Up Database:**
   - Follow instructions in `scripts/setup-postgres.md`
   - Get your PostgreSQL connection string

3. **Update Prisma Schema:**
   ```bash
   # Backup SQLite schema
   cp prisma/schema.prisma prisma/schema.sqlite.backup
   
   # Use PostgreSQL schema
   cp prisma/schema.postgresql.prisma prisma/schema.prisma
   ```

4. **Update Environment Variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Update `DATABASE_URL` with PostgreSQL connection string

5. **Run Migrations:**
   ```bash
   # In Vercel, add a build command or use Vercel CLI
   vercel env pull .env.local
   npx prisma generate
   npx prisma migrate deploy
   ```

   Or add to `package.json`:
   ```json
   "postinstall": "prisma generate"
   ```

---

## Step 5: Configure Custom Domain (Optional)

1. **In Vercel Dashboard:**
   - Go to Project Settings → Domains
   - Add your domain
   - Follow DNS configuration instructions

2. **Update NEXTAUTH_URL:**
   - Update `NEXTAUTH_URL` environment variable to your custom domain
   - Redeploy if needed

---

## Step 6: Seed Initial Data

After first deployment, you need to seed the database:

### Option A: Via Vercel CLI

```bash
# Pull environment variables
vercel env pull .env.local

# Run seed
npm run seed
```

### Option B: Via Vercel Functions (One-time)

Create `api/seed/route.ts` (temporary, remove after seeding):

```typescript
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    await execAsync('npm run seed');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
```

Visit `https://your-app.vercel.app/api/seed` once, then delete the file.

### Option C: Manual SQL (if using PostgreSQL)

Use your database provider's SQL editor to run seed queries.

---

## Step 7: Verify Deployment

1. **Visit Your Site:**
   - Go to `https://your-project.vercel.app`
   - Verify homepage loads

2. **Test Admin Panel:**
   - Go to `https://your-project.vercel.app/admin/login`
   - Login: `admin` / `admin123`
   - ⚠️ **Change password immediately!**

3. **Test Features:**
   - [ ] Menu page loads
   - [ ] About page loads
   - [ ] Contact page loads
   - [ ] Admin panel accessible
   - [ ] Can add/edit menu items
   - [ ] Can upload images
   - [ ] Content management works

---

## Step 8: Post-Deployment Checklist

- [ ] Admin password changed
- [ ] Initial content uploaded (images, menu items)
- [ ] Store hours configured
- [ ] Contact information updated
- [ ] Social media links added
- [ ] Testimonials added (if any)
- [ ] Home slider images uploaded
- [ ] Site settings configured
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (automatic on Vercel)

---

## Troubleshooting

### Build Fails

1. **Check Build Logs:**
   - Go to Vercel Dashboard → Deployments
   - Click on failed deployment
   - Review error messages

2. **Common Issues:**
   - Missing environment variables → Add in Vercel settings
   - Prisma client not generated → Add `postinstall` script
   - TypeScript errors → Fix locally, push again

### Database Connection Issues

1. **SQLite:**
   - Ensure `DATABASE_URL` is set correctly
   - Check file permissions

2. **PostgreSQL:**
   - Verify connection string format
   - Check firewall/whitelist settings
   - Ensure SSL is enabled if required

### Authentication Not Working

1. **Check Environment Variables:**
   - `NEXTAUTH_SECRET` must be set
   - `NEXTAUTH_URL` must match your domain exactly

2. **Verify Middleware:**
   - Check `middleware.ts` is correct
   - Ensure routes are protected

### Images Not Loading

1. **Check Image Paths:**
   - Verify images are in `public/uploads/`
   - Check Next.js image configuration

2. **Vercel File System:**
   - Uploaded files may be lost on redeploy
   - Consider using external storage (S3, Cloudinary)

---

## Quick Reference

### Environment Variables Template

```env
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://your-domain.vercel.app
DATABASE_URL=postgresql://user:pass@host:5432/db
```

### Useful Vercel CLI Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# Pull environment variables
vercel env pull .env.local

# List deployments
vercel ls
```

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review error messages
3. Test locally with production build
4. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)

---

## Next Steps

After successful deployment:
- Set up monitoring (Vercel Analytics)
- Configure backups (for database)
- Set up CI/CD (automatic deployments)
- Add custom domain
- Optimize images and performance

