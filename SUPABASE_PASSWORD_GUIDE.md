# How to Find Your Supabase Database Password

## Option 1: Check Project Settings (If You Saved It)

1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Click on your project: `irmgycjvcqmrfairlzut`
4. Go to **Settings** (gear icon in left sidebar)
5. Click on **Database**
6. Scroll down to **"Database Password"** section
7. If you see a password shown, that's it!
8. If it shows "••••••••", you'll need to reset it (see Option 2)

## Option 2: Reset Your Database Password (Recommended)

1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Click on your project: `irmgycjvcqmrfairlzut`
4. Go to **Settings** → **Database**
5. Scroll down to **"Database Password"** section
6. Click **"Reset Database Password"** button
7. Enter a new password (make it strong and save it!)
8. Click **"Reset Password"**
9. **IMPORTANT:** Copy the new password immediately - Supabase will show it once!

## Option 3: Use Connection Pooling (Alternative - No Password Needed)

Supabase also provides a connection pooling URL that might work differently. But for Prisma, you'll need the direct connection string with password.

---

## After You Get Your Password

1. **Replace `[YOUR_PASSWORD]` in your connection string:**
   ```
   postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.irmgycjvcqmrfairlzut.supabase.co:5432/postgres
   ```

2. **Add SSL parameter (required for Supabase):**
   ```
   postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.irmgycjvcqmrfairlzut.supabase.co:5432/postgres?sslmode=require
   ```

3. **Update in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Update `DATABASE_URL` with the complete connection string (including password and SSL)
   - Make sure it's set for **Production** environment

4. **Test the connection:**
   - You can test locally first if you want:
     ```bash
     # Create .env.local file
     DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.irmgycjvcqmrfairlzut.supabase.co:5432/postgres?sslmode=require"
     
     # Test connection
     npx prisma db pull
     ```

---

## Quick Steps Summary

1. ✅ Go to Supabase Dashboard
2. ✅ Settings → Database
3. ✅ Reset Database Password (if needed)
4. ✅ Copy the password
5. ✅ Update connection string: `postgresql://postgres:YOUR_PASSWORD@db.irmgycjvcqmrfairlzut.supabase.co:5432/postgres?sslmode=require`
6. ✅ Add to Vercel Environment Variables
7. ✅ Deploy!

---

## Security Note

⚠️ **Never commit your password to Git!**
- Only add it to Vercel Environment Variables
- Don't put it in `.env.local` if you're committing that file
- Keep your password secure

---

## Need Help?

If you can't find or reset the password:
1. Check Supabase documentation: https://supabase.com/docs/guides/database/connecting-to-postgres
2. Make sure you're the project owner/admin
3. Try creating a new project if needed (though you'll lose any data)

