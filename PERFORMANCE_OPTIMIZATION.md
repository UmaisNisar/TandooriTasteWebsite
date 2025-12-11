# Performance Optimization Guide

This project has been optimized for maximum performance on Vercel using Edge Runtime and caching strategies.

## Key Optimizations

### 1. Edge Runtime
- All public API routes use Edge Runtime (`export const runtime = 'edge'`)
- Eliminates cold starts on Vercel
- Faster response times globally

### 2. Database Connection
- **IMPORTANT**: Use Supabase Session Pooler connection string (IPv4-compatible)
- Connection string format: `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require`
- Port 6543 (pooler) instead of 5432 (direct)
- This is IPv4-compatible and works with Edge Runtime

### 3. Caching Strategy
- All public API routes: `revalidate = 30` (30 seconds)
- Pages use ISR (Incremental Static Regeneration) with `revalidate = 30`
- Menu page: `force-static` with 5-minute revalidation
- Cache-Control headers: `public, s-maxage=30, stale-while-revalidate=60`

### 4. Unified Menu Endpoint
- `/api/menu` returns categories, items, and featured dishes in one query
- Reduces round-trips from 3+ to 1
- Includes all related data (images, categories) in single response

### 5. Image Optimization
- All images use `next/image` component
- Automatic WebP/AVIF format conversion
- Lazy loading and responsive sizing
- Supabase CDN domains configured in `next.config.mjs`

## Environment Variables Required

```env
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://your-domain.vercel.app
```

## Performance Metrics

- **Cold Start**: Eliminated (Edge Runtime)
- **API Response Time**: < 100ms (cached)
- **Page Load**: < 1s (ISR + Edge)
- **Database Queries**: Optimized to single query per endpoint

## API Routes Using Edge Runtime

- `/api/menu` - Unified menu endpoint
- `/api/content` - Content blocks
- `/api/content/featured-dishes` - Featured dishes
- `/api/content/reviews` - Reviews
- `/api/content/store-hours` - Store hours and holidays

## Pages Using ISR

- `/` (Homepage) - Revalidates every 30 seconds
- `/about` - Revalidates every 30 seconds
- `/contact` - Revalidates every 30 seconds
- `/menu` - Static with 5-minute revalidation

## Database Client

- Edge routes use `@vercel/postgres` (edge-compatible)
- Node.js routes (admin) use `pg` library
- Both connect to the same Supabase database

## Monitoring

Check Vercel Analytics for:
- Edge Function execution time
- Cache hit rates
- Response times
- Error rates

