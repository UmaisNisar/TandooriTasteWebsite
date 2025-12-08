import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const hasDatabaseUrl = !!process.env.DATABASE_URL;
  const databaseUrlLength = process.env.DATABASE_URL?.length || 0;
  const databaseUrlPreview = process.env.DATABASE_URL 
    ? `${process.env.DATABASE_URL.substring(0, 30)}...${process.env.DATABASE_URL.substring(process.env.DATABASE_URL.length - 20)}`
    : 'NOT SET';
  
  // Check if it looks like a valid connection string
  const isValidFormat = process.env.DATABASE_URL?.startsWith('postgresql://') || 
                        process.env.DATABASE_URL?.startsWith('postgres://');
  const hasSslMode = process.env.DATABASE_URL?.includes('sslmode=require');
  const hasHost = process.env.DATABASE_URL?.includes('db.irmgycjvcqmrfairlzut.supabase.co') ||
                  process.env.DATABASE_URL?.includes('pooler.supabase.com');

  return NextResponse.json({
    hasDatabaseUrl,
    databaseUrlLength,
    databaseUrlPreview: hasDatabaseUrl ? databaseUrlPreview : 'NOT SET',
    isValidFormat,
    hasSslMode,
    hasHost,
    nodeEnv: process.env.NODE_ENV,
    message: !hasDatabaseUrl 
      ? '❌ DATABASE_URL is NOT SET. Please set it in Vercel → Settings → Environment Variables'
      : !isValidFormat
      ? '⚠️ DATABASE_URL format looks invalid. Should start with postgresql:// or postgres://'
      : !hasSslMode
      ? '⚠️ DATABASE_URL missing sslmode=require. Supabase requires SSL.'
      : !hasHost
      ? '⚠️ DATABASE_URL host doesn\'t match expected Supabase host'
      : '✅ DATABASE_URL appears to be configured correctly. If you still get connection errors, try redeploying.',
    instructions: !hasDatabaseUrl ? [
      '1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables',
      '2. Add DATABASE_URL with value: postgresql://postgres:mHcGcaiKx120znhr@db.irmgycjvcqmrfairlzut.supabase.co:5432/postgres?sslmode=require',
      '3. Make sure it\'s set for Production environment',
      '4. Redeploy your application'
    ] : []
  });
}

