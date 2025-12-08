# Vercel Database Connection Setup

## The Error You're Seeing

```
getaddrinfo ENOTFOUND db.irmgycjvcqmrfairlzut.supabase.co
```

This means DNS resolution failed, which usually indicates:
1. **DATABASE_URL is not set in Vercel environment variables**
2. **Connection string format is incorrect**
3. **Network/DNS issue (less common)**

## Solution: Set DATABASE_URL in Vercel

### Step 1: Get Your Connection String

You have two options:

#### Option A: Direct Connection (Current)
```
postgresql://postgres:mHcGcaiKx120znhr@db.irmgycjvcqmrfairlzut.supabase.co:5432/postgres?sslmode=require
```

#### Option B: Connection Pooler (Recommended for Serverless/Vercel)
1. Go to [Supabase Dashboard](https://supabase.com)
2. Select your project: `irmgycjvcqmrfairlzut`
3. Go to **Settings** → **Database**
4. Scroll to **"Connection Pooling"** section
5. Copy the **"Connection string"** (port 6543)
6. It will look like:
   ```
   postgresql://postgres.irmgycjvcqmrfairlzut:mHcGcaiKx120znhr@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require
   ```

**Why use the pooler?**
- Better for serverless environments (Vercel)
- Handles connection pooling automatically
- More reliable for high-traffic applications

### Step 2: Set Environment Variable in Vercel

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Find or create `DATABASE_URL`
5. Paste your connection string (from Option A or B above)
6. **IMPORTANT**: Make sure it's set for:
   - ✅ **Production**
   - ✅ **Preview** (optional but recommended)
   - ✅ **Development** (optional)
7. Click **Save**

### Step 3: Redeploy

After setting the environment variable:
1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Or push a new commit to trigger a new deployment

### Step 4: Verify

After redeploying, test the connection:
- Visit: `https://your-app.vercel.app/api/migrate`
- Should return: `{"success":true,"message":"Database migrations completed successfully!"}`

## Troubleshooting

### Still Getting ENOTFOUND?

1. **Double-check the connection string format:**
   - Must start with `postgresql://`
   - Must include `?sslmode=require` at the end
   - Password should NOT be URL-encoded (unless it contains special characters)

2. **Check Vercel environment variables:**
   - Go to Settings → Environment Variables
   - Verify `DATABASE_URL` exists
   - Click on it to see the value (password will be hidden)
   - Make sure it's set for **Production**

3. **Check Supabase:**
   - Go to Supabase Dashboard
   - Verify your project is **Active**
   - Check **Settings** → **Database** → **Connection string** matches what you're using

4. **Try the connection pooler:**
   - Use Option B (pooler) instead of direct connection
   - Pooler is more reliable for serverless

### Password Contains Special Characters?

If your password has special characters like `@`, `#`, `%`, etc., you need to URL-encode them:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- etc.

Example:
```
postgresql://postgres:my%40password@db.irmgycjvcqmrfairlzut.supabase.co:5432/postgres?sslmode=require
```

## Your Current Connection String

Based on what you provided:
```
postgresql://postgres:mHcGcaiKx120znhr@db.irmgycjvcqmrfairlzut.supabase.co:5432/postgres?sslmode=require
```

This format is **correct**. The issue is likely that it's not set in Vercel environment variables.

## Quick Checklist

- [ ] DATABASE_URL is set in Vercel → Settings → Environment Variables
- [ ] Connection string includes `?sslmode=require`
- [ ] Environment variable is set for **Production**
- [ ] Redeployed after setting the variable
- [ ] Supabase project is active
- [ ] Connection string format is correct (starts with `postgresql://`)

