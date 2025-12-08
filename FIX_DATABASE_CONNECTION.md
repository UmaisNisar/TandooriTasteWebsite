# Fix Database Connection Issue

The error shows: `Can't reach database server at db.irmgycjvcqmrfairlzut.supabase.co:5432`

## Quick Fix Steps

### Step 1: Verify Your Connection String Format

Your connection string should look like this (with your actual password):

```
postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.irmgycjvcqmrfairlzut.supabase.co:5432/postgres?sslmode=require
```

**Important:**
- Replace `YOUR_ACTUAL_PASSWORD` with your actual Supabase password
- **Must include** `?sslmode=require` at the end (Supabase requires SSL)

### Step 2: Check Vercel Environment Variable

1. Go to [Vercel Dashboard](https://vercel.com) → Your Project
2. Go to **Settings** → **Environment Variables**
3. Find `DATABASE_URL`
4. Make sure it:
   - Has your actual password (not `[YOUR_PASSWORD]`)
   - Includes `?sslmode=require` at the end
   - Is set for **Production** environment

### Step 3: Test Connection String Format

Your connection string should be:
```
postgresql://postgres:PASSWORD@db.irmgycjvcqmrfairlzut.supabase.co:5432/postgres?sslmode=require
```

Where `PASSWORD` is your actual Supabase database password.

### Step 4: Check Supabase Settings

1. Go to [Supabase Dashboard](https://supabase.com)
2. Select your project
3. Go to **Settings** → **Database**
4. Check:
   - Database is running (should show "Active")
   - Connection pooling is enabled (optional but recommended)
   - No IP restrictions blocking Vercel

### Step 5: Use Connection Pooling (Recommended for Serverless)

For better performance on Vercel, use Supabase's connection pooling:

1. In Supabase Dashboard → **Settings** → **Database**
2. Scroll to **"Connection Pooling"** section
3. Copy the **"Connection string"** (not the direct one)
4. It will look like:
   ```
   postgresql://postgres.irmgycjvcqmrfairlzut:PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require
   ```
5. Use this connection string in Vercel instead

**Note:** Connection pooling uses port `6543` instead of `5432` and a different host.

---

## After Fixing Connection String

1. **Update Vercel Environment Variable:**
   - Go to Vercel → Settings → Environment Variables
   - Update `DATABASE_URL` with correct connection string
   - Save

2. **Redeploy:**
   - Vercel will automatically redeploy when you update environment variables
   - Or manually trigger a redeploy

3. **Run Migrations:**
   - Visit: `https://your-app.vercel.app/api/migrate`
   - This will create all database tables

4. **Seed Database:**
   - Visit: `https://your-app.vercel.app/api/seed`
   - This will create admin user and initial data

5. **Test Login:**
   - Go to: `https://your-app.vercel.app/admin/login`
   - Login with: `admin` / `admin123`

---

## Common Issues

### Issue: "Can't reach database server"
- **Fix:** Check connection string has password and `?sslmode=require`
- **Fix:** Verify Supabase database is running
- **Fix:** Try connection pooling URL instead

### Issue: "SSL required"
- **Fix:** Add `?sslmode=require` to connection string

### Issue: "Authentication failed"
- **Fix:** Verify password is correct in connection string
- **Fix:** Reset password in Supabase if needed

### Issue: "Connection timeout"
- **Fix:** Use connection pooling URL (port 6543)
- **Fix:** Check Supabase firewall settings

---

## Quick Checklist

- [ ] Connection string has actual password (not placeholder)
- [ ] Connection string includes `?sslmode=require`
- [ ] `DATABASE_URL` is set in Vercel for Production
- [ ] Supabase database is running
- [ ] Connection string format is correct

---

## Example Connection Strings

**Direct Connection (Port 5432):**
```
postgresql://postgres:your_password_here@db.irmgycjvcqmrfairlzut.supabase.co:5432/postgres?sslmode=require
```

**Connection Pooling (Port 6543 - Recommended):**
```
postgresql://postgres.irmgycjvcqmrfairlzut:your_password_here@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require
```

Replace `your_password_here` with your actual Supabase database password!

