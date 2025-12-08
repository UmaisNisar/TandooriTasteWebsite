import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';

const execAsync = promisify(exec);

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('[MIGRATE] Starting database migration...');
    
    // Prisma client should already be generated during build (via postinstall script)
    // Skip prisma generate - it causes issues in serverless environments
    
    // Run migrations only
    console.log('[MIGRATE] Running migrations...');
    
    // Use Prisma binary directly from node_modules to avoid npx issues in serverless
    const prismaPath = join(process.cwd(), 'node_modules', '.bin', 'prisma');
    
    // Set proper environment for serverless
    const env = {
      ...process.env,
      // Use temp directory for npm cache if needed
      NPM_CONFIG_CACHE: process.env.NPM_CONFIG_CACHE || '/tmp/.npm',
      HOME: process.env.HOME || '/tmp',
    };
    
    // Run migrate deploy using Prisma binary directly
    const command = process.platform === 'win32' 
      ? `"${prismaPath}.cmd" migrate deploy`
      : `"${prismaPath}" migrate deploy`;
    
    const { stdout, stderr } = await execAsync(command, {
      env,
      cwd: process.cwd(),
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer
    });
    
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

