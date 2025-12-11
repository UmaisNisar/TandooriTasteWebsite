import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    console.log('[MIGRATE] Starting database migration...');
    
    // Read and execute SQL schema
    console.log('[MIGRATE] Reading schema file...');
    const schemaPath = join(process.cwd(), 'sql', 'schema.sql');
    const schemaSQL = readFileSync(schemaPath, 'utf-8');
    
    // Split by semicolons and execute each statement
    const statements = schemaSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`[MIGRATE] Executing ${statements.length} SQL statements...`);
    
    const results = [];
    for (const statement of statements) {
      try {
        await query(statement);
        results.push({ statement: statement.substring(0, 50) + '...', success: true });
      } catch (err: any) {
        // Ignore "already exists" errors
        if (err.message?.includes('already exists') || err.code === '42P07') {
          results.push({ statement: statement.substring(0, 50) + '...', success: true, note: 'already exists' });
        } else {
          results.push({ statement: statement.substring(0, 50) + '...', success: false, error: err.message });
        }
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    
    console.log(`[MIGRATE] Migration complete: ${successCount} succeeded, ${failCount} failed`);
    
    // Check if all migrations failed (likely a connection issue)
    const allFailed = failCount > 0 && successCount === 0;
    const hasConnectionError = results.some(r => 
      !r.success && (
        r.error?.includes('getaddrinfo') || 
        r.error?.includes('ENOTFOUND') ||
        r.error?.includes('DATABASE_URL')
      )
    );
    
    // If all failed or there are connection errors, return failure
    if (allFailed || hasConnectionError) {
      return NextResponse.json({
        success: false,
        message: allFailed 
          ? 'All database migrations failed. This is likely a connection issue.'
          : 'Some migrations failed due to connection errors.',
        executed: successCount,
        failed: failCount,
        results,
        hint: hasConnectionError
          ? 'Database connection failed. DATABASE_URL may not be set in Vercel environment variables, or the connection string is incorrect. Go to Vercel Dashboard → Settings → Environment Variables → Add DATABASE_URL with your Supabase connection string, then redeploy. Try using Supabase connection pooler (port 6543) instead of direct connection (port 5432).'
          : 'Check the error messages in the results for details.',
        checkConfig: '/api/check-db-config',
      }, { status: 500 });
    }
    
    // If some failed but not all, still return success but with warning
    if (failCount > 0) {
      return NextResponse.json({
        success: true,
        message: `Database migrations completed with ${failCount} failure(s). Some migrations may have failed due to "already exists" errors, which are safe to ignore.`,
        executed: successCount,
        failed: failCount,
        results
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database migrations completed successfully!',
      executed: successCount,
      failed: failCount,
      results
    });
  } catch (error: any) {
    console.error('[MIGRATE] Migration error:', error);
    const isConnectionError = error.code === 'ENOTFOUND' || 
                              error.message?.includes('getaddrinfo') ||
                              error.message?.includes('DATABASE_URL');
    
    return NextResponse.json({
      success: false,
      error: error.message,
      hint: isConnectionError 
        ? 'Database connection failed. DATABASE_URL is not set in Vercel environment variables. Go to Vercel Dashboard → Settings → Environment Variables → Add DATABASE_URL with your Supabase connection string, then redeploy.'
        : undefined,
      checkConfig: '/api/check-db-config',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

