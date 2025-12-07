# Deployment Guide for Tandoori Tastes Website

## Pre-Deployment Checklist

### 1. Environment Variables
Create a `.env.local` file (or set in your hosting platform) with:

```env
NEXTAUTH_SECRET=your-secure-secret-here
NEXTAUTH_URL=https://your-domain.com
DATABASE_URL="file:./dev.db"
```

**Generate a secure secret:**
```bash
openssl rand -base64 32
```

### 2. Database Setup
- **Development**: SQLite is fine (already configured)
- **Production**: Consider migrating to PostgreSQL for better performance and reliability
  - SQLite works but has limitations in serverless environments
  - For Vercel, use Vercel Postgres or external PostgreSQL (Supabase, Railway, etc.)

### 3. Build the Application
```bash
npm run build
```

### 4. Test Production Build Locally
```bash
npm run build
npm start
```

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository
   - Add environment variables in project settings
   - Deploy

3. **Deploy via CLI:**
   ```bash
   vercel
   ```

4. **Environment Variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add:
     - `NEXTAUTH_SECRET` (generate secure secret)
     - `NEXTAUTH_URL` (your Vercel domain or custom domain)
     - `DATABASE_URL` (if using external database)

5. **Important for SQLite on Vercel:**
   - SQLite files are ephemeral on serverless platforms
   - Consider using Vercel Postgres or external database
   - Or use Vercel's file system storage (limited)

### Option 2: Other Platforms

#### Netlify
- Similar to Vercel
- Use Netlify Functions for API routes
- Consider external database

#### Railway
- Good for full-stack apps
- Supports PostgreSQL out of the box
- Can deploy directly from Git

#### Self-Hosted (VPS)
- Use PM2 or similar process manager
- Set up reverse proxy (Nginx)
- Use PostgreSQL for production database

## Database Migration (If switching to PostgreSQL)

1. **Update `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Update environment:**
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   ```

3. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   npm run seed
   ```

## Post-Deployment Steps

1. **Seed Initial Data:**
   ```bash
   npm run seed
   ```
   This creates:
   - Admin user (username: `admin`, password: `admin123`)
   - Initial content blocks
   - Store hours
   - Sample testimonials

2. **Change Admin Password:**
   - Log in to admin panel
   - Update password immediately (add password change feature if needed)

3. **Upload Images:**
   - Go to Admin Panel → Home Slider
   - Upload restaurant images
   - Add menu item images
   - Update all content as needed

4. **Test All Features:**
   - Public pages load correctly
   - Admin login works
   - Menu items display
   - Content management works
   - Image uploads work

## Security Checklist

- [ ] `NEXTAUTH_SECRET` is set and secure
- [ ] Admin password is changed from default
- [ ] HTTPS is enabled (automatic on Vercel)
- [ ] Environment variables are not committed to Git
- [ ] Database credentials are secure
- [ ] API routes are protected (middleware is working)

## Troubleshooting

### Build Errors
- Check for TypeScript errors: `npm run lint`
- Ensure all dependencies are installed: `npm install`
- Check for missing environment variables

### Database Issues
- Ensure database is accessible
- Run `npx prisma generate` after schema changes
- Check database connection string format

### Authentication Issues
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Ensure middleware is correctly configured

## Quick Deploy Commands

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Build for production
npm run build

# 4. Test locally
npm start

# 5. Deploy (Vercel)
vercel --prod
```

## Support

For issues during deployment:
1. Check build logs
2. Verify environment variables
3. Test locally with production build
4. Check hosting platform logs

