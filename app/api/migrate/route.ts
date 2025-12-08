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
    
    return NextResponse.json({
      success: true,
      message: 'Database migrations completed successfully!',
      executed: successCount,
      failed: failCount,
      results
    });
  } catch (error: any) {
    console.error('[MIGRATE] Migration error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

