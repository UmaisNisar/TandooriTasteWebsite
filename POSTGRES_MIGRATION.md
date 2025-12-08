# PostgreSQL Migration Guide

Your schema has been updated to use PostgreSQL! Follow these steps to complete the migration.

## Step 1: Choose a PostgreSQL Provider

### Option A: Vercel Postgres (Recommended - Easiest)

1. **Go to Vercel Dashboard:**
   - Visit [vercel.com](https://vercel.com)
   - Open your project: `tandoori-taste-website`
   - Click on the **"Storage"** tab
   - Click **"Create Database"**
   - Select **"Postgres"**
   - Choose a name (e.g., `tandoori-taste-db`)
   - Select a region (choose closest to your users)
   - Click **"Create"**

2. **Get Connection String:**
   - Once created, click on your database
   - Go to **"Settings"** tab
   - Copy the **"Connection String"** (it looks like: `postgresql://...`)

3. **Update Environment Variables:**
   - In Vercel project settings → **Environment Variables**
   - Update `DATABASE_URL` with the connection string from step 2
   - Make sure it's set for **Production** environment

### Option B: Supabase (Free Tier Available)

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Sign up/login
   - Click **"New Project"**
   - Fill in project details
   - Wait for project to be ready (~2 minutes)

2. **Get Connection String:**
   - Go to **Project Settings** → **Database**
   - Find **"Connection string"** section
   - Copy the **"URI"** connection string
   - Format: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

3. **Update Environment Variables:**
   - In Vercel project settings → **Environment Variables**
   - Update `DATABASE_URL` with the connection string
   - Make sure it's set for **Production** environment

### Option C: Railway (Easy Setup)

1. **Create Railway Account:**
   - Go to [railway.app](https://railway.app)
   - Sign up/login with GitHub

2. **Create PostgreSQL Database:**
   - Click **"New Project"**
   - Click **"New"** → **"Database"** → **"PostgreSQL"**
   - Railway will create the database automatically

3. **Get Connection String:**
   - Click on the PostgreSQL service
   - Go to **"Variables"** tab
   - Copy the `DATABASE_URL`

4. **Update Environment Variables:**
   - In Vercel project settings → **Environment Variables**
   - Update `DATABASE_URL` with the connection string

### Option D: Neon (Serverless PostgreSQL)

1. **Create Neon Account:**
   - Go to [neon.tech](https://neon.tech)
   - Sign up/login

2. **Create Project:**
   - Click **"Create Project"**
   - Choose a name and region
   - Click **"Create Project"**

3. **Get Connection String:**
   - Copy the connection string from the dashboard
   - It will be shown after project creation

4. **Update Environment Variables:**
   - In Vercel project settings → **Environment Variables**
   - Update `DATABASE_URL` with the connection string

---

## Step 2: Run Migrations Locally (Optional - For Testing)

If you want to test locally first:

```bash
# Pull environment variables from Vercel
npx vercel env pull .env.local

# Generate Prisma client
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name init

# Seed the database
npm run seed
```

---

## Step 3: Deploy to Vercel

### Option A: Automatic Migration (Recommended)

Vercel will automatically run migrations during build if you add this to your build command.

1. **Update Vercel Build Settings:**
   - Go to Vercel Dashboard → Your Project → **Settings** → **General**
   - Find **"Build & Development Settings"**
   - Update **"Build Command"** to:
     ```
     prisma generate && prisma migrate deploy && next build
     ```

2. **Deploy:**
   ```bash
   git add .
   git commit -m "Migrate to PostgreSQL"
   git push
   ```
   
   Vercel will automatically:
   - Generate Prisma client
   - Run migrations
   - Build your app

### Option B: Manual Migration via API Route

Create a one-time migration route:

1. **Create Migration Route:**
   - File: `app/api/migrate/route.ts` (temporary)
   - Visit: `https://your-app.vercel.app/api/migrate` once
   - Delete the file after migration

2. **Or Use Vercel CLI:**
   ```bash
   # Pull environment variables
   npx vercel env pull .env.local
   
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate deploy
   
   # Seed database
   npm run seed
   ```

---

## Step 4: Seed the Database

After migrations are complete, seed your database:

**Option A: Via API Route (if you created one):**
```
https://your-app.vercel.app/api/seed
```

**Option B: Via Vercel CLI:**
```bash
npx vercel env pull .env.local
npm run seed
```

**Option C: Create a seed API route:**
- The existing `/api/seed` route should work
- Visit it once after migration

---

## Step 5: Verify Everything Works

1. **Check Database:**
   - Visit: `https://your-app.vercel.app/api/check-user`
   - Should show users in the database

2. **Test Login:**
   - Go to: `https://your-app.vercel.app/admin/login`
   - Login with: `admin` / `admin123`
   - Should work now! 🎉

3. **Verify Data Persists:**
   - Add some content via admin panel
   - Redeploy your app
   - Data should still be there (unlike SQLite!)

---

## Troubleshooting

### Migration Fails

**Error: "Database does not exist"**
- Make sure `DATABASE_URL` is set correctly in Vercel
- Check the connection string format
- Ensure the database is accessible

**Error: "SSL required"**
- Add `?sslmode=require` to your connection string
- Example: `postgresql://user:pass@host:5432/db?sslmode=require`

**Error: "Connection timeout"**
- Check firewall settings
- Ensure your IP is whitelisted (if required)
- For serverless, use connection pooling

### Connection Pooling (For Serverless)

For better performance on Vercel, add connection pooling:

**Vercel Postgres:**
- Already includes connection pooling
- No changes needed

**Supabase:**
- Use the "Connection Pooling" connection string
- Found in Project Settings → Database → Connection Pooling

**Neon:**
- Add `?pgbouncer=true` to connection string
- Or use Neon's connection pooling feature

**Railway:**
- Add `?connection_limit=1` to connection string for serverless

---

## Quick Reference

### Connection String Formats

**Vercel Postgres:**
```
postgres://user:password@host:5432/database
```

**Supabase:**
```
postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
```

**Railway:**
```
postgresql://postgres:password@host:5432/railway
```

**Neon:**
```
postgresql://user:password@host/database?sslmode=require
```

### Useful Commands

```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Deploy migrations (production)
npx prisma migrate deploy

# Push schema without migrations (dev only)
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio

# Seed database
npm run seed
```

---

## What Changed?

✅ **Schema Updated:**
- `prisma/schema.prisma` now uses PostgreSQL
- SQLite backup saved to `prisma/schema.sqlite.backup`

✅ **Package.json Updated:**
- Added migration commands:
  - `npm run db:migrate` - Create migration
  - `npm run db:deploy` - Deploy migrations
  - `npm run db:push` - Push schema (dev)
  - `npm run db:studio` - Open Prisma Studio

✅ **Next Steps:**
1. Set up PostgreSQL database (choose one option above)
2. Update `DATABASE_URL` in Vercel
3. Deploy and run migrations
4. Seed the database
5. Test login - it should work now! 🎉

---

## Benefits of PostgreSQL

✅ **Persistent Data** - Data survives redeployments
✅ **Reliable** - No more database resets
✅ **Scalable** - Handles production traffic
✅ **Better Performance** - Optimized for serverless
✅ **Connection Pooling** - Better resource management
✅ **Backups** - Most providers offer automatic backups

Your login issues will be resolved once PostgreSQL is set up! 🚀

