import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    console.log('[TEST-CONNECTION] Testing database connection...');
    
    // Simple query to test connection
    const result = await query('SELECT NOW() as current_time, version() as pg_version');
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      data: {
        currentTime: result.rows[0]?.current_time,
        postgresVersion: result.rows[0]?.pg_version?.substring(0, 50),
      }
    });
  } catch (error: any) {
    console.error('[TEST-CONNECTION] Connection test failed:', error);
    
    const isDnsError = error.code === 'ENOTFOUND' || error.message?.includes('getaddrinfo');
    const dbUrl = process.env.DATABASE_URL || '';
    const urlMatch = dbUrl.match(/@([^:]+)/);
    const host = urlMatch ? urlMatch[1] : 'unknown';
    
    return NextResponse.json({
      success: false,
      error: error.message,
      errorCode: error.code,
      host: host,
      hint: isDnsError 
        ? `DNS resolution failed for ${host}. Try using Supabase connection pooler (port 6543) instead of direct connection (port 5432). Go to Supabase Dashboard → Settings → Database → Connection Pooling and use that connection string.`
        : 'Check your DATABASE_URL configuration in Vercel environment variables.',
      checkConfig: '/api/check-db-config',
    }, { status: 500 });
  }
}

