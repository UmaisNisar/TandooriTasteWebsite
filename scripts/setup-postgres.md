# PostgreSQL Setup Guide

## Option 1: Vercel Postgres (Recommended for Vercel Deployment)

1. **In Vercel Dashboard:**
   - Go to your project
   - Navigate to "Storage" tab
   - Click "Create Database" → Select "Postgres"
   - Wait for database to be created
   - Copy the connection string

2. **Update Environment Variables:**
   - In Vercel project settings → Environment Variables
   - Add/Update `DATABASE_URL` with the connection string from step 1

3. **Update Prisma Schema:**
   ```bash
   # Backup current schema
   cp prisma/schema.prisma prisma/schema.sqlite.backup
   
   # Use PostgreSQL schema
   cp prisma/schema.postgresql.prisma prisma/schema.prisma
   ```

4. **Run Migrations:**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   npm run seed
   ```

## Option 2: Supabase (Free PostgreSQL)

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for project to be ready

2. **Get Connection String:**
   - Go to Project Settings → Database
   - Copy the connection string (URI format)
   - Format: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

3. **Update Environment Variables:**
   - Add `DATABASE_URL` to your `.env.local` or Vercel environment variables

4. **Update Prisma Schema:**
   ```bash
   cp prisma/schema.postgresql.prisma prisma/schema.prisma
   ```

5. **Run Migrations:**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   npm run seed
   ```

## Option 3: Railway (Easy PostgreSQL)

1. **Create Railway Account:**
   - Go to [railway.app](https://railway.app)
   - Sign up/login

2. **Create PostgreSQL Database:**
   - Click "New Project"
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will create the database automatically

3. **Get Connection String:**
   - Click on the PostgreSQL service
   - Go to "Variables" tab
   - Copy the `DATABASE_URL`

4. **Update Environment Variables:**
   - Add to Vercel or your hosting platform

5. **Update Prisma and Migrate:**
   ```bash
   cp prisma/schema.postgresql.prisma prisma/schema.prisma
   npx prisma generate
   npx prisma migrate deploy
   npm run seed
   ```

## Option 4: Neon (Serverless PostgreSQL)

1. **Create Neon Account:**
   - Go to [neon.tech](https://neon.tech)
   - Sign up/login

2. **Create Project:**
   - Create a new project
   - Select region closest to your users

3. **Get Connection String:**
   - Copy the connection string from dashboard

4. **Update Environment Variables:**
   - Add `DATABASE_URL` to your hosting platform

5. **Update Prisma and Migrate:**
   ```bash
   cp prisma/schema.postgresql.prisma prisma/schema.prisma
   npx prisma generate
   npx prisma migrate deploy
   npm run seed
   ```

## Migration Commands

After setting up PostgreSQL:

```bash
# Generate Prisma client
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name init

# Or for production (no prompts)
npx prisma migrate deploy

# Seed the database
npm run seed
```

## Troubleshooting

- **Connection Issues**: Check firewall settings, ensure IP is whitelisted
- **SSL Required**: Add `?sslmode=require` to connection string if needed
- **Pool Size**: For serverless, add `?connection_limit=1` to connection string

