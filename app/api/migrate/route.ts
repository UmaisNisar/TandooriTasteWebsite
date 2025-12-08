import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    console.log('[MIGRATE] Starting database migration...');
    
    // Generate Prisma client
    console.log('[MIGRATE] Generating Prisma client...');
    await execAsync('npx prisma generate');
    
    // Run migrations
    console.log('[MIGRATE] Running migrations...');
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy');
    
    console.log('[MIGRATE] Migration output:', stdout);
    if (stderr) {
      console.warn('[MIGRATE] Migration warnings:', stderr);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database migrations completed successfully!',
      output: stdout
    });
  } catch (error: any) {
    console.error('[MIGRATE] Migration error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      output: error.stdout || error.stderr || String(error)
    }, { status: 500 });
  }
}

