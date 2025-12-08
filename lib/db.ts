import { Pool } from 'pg';

// Validate DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set!');
  console.error('Please set DATABASE_URL in Vercel environment variables.');
}

// Helper to create pool with proper configuration
function createPool() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  // Parse connection string to extract host for better error messages
  let host = 'unknown';
  try {
    const url = new URL(connectionString);
    host = url.hostname;
  } catch (e) {
    // Ignore parsing errors
  }

  console.log(`[DB] Initializing connection pool for host: ${host}`);

  const pool = new Pool({
    connectionString: connectionString,
    ssl: connectionString.includes('sslmode=require') 
      ? { rejectUnauthorized: false } 
      : undefined,
    max: 10, // Reduced for serverless
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 30000, // Increased timeout for serverless
    // For serverless, we want to keep connections alive longer
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
    // Allow the pool to retry connections
    allowExitOnIdle: false,
  });

  // Add error handler to pool
  pool.on('error', (err: any) => {
    console.error('[DB] Unexpected error on idle client:', err.message);
    if (err.code) {
      console.error('[DB] Error code:', err.code);
    }
  });

  // Test connection on pool creation
  pool.on('connect', () => {
    console.log('[DB] New client connected to database');
  });

  return pool;
}

// Create the connection pool
let pool: Pool;
try {
  pool = createPool();
} catch (error: any) {
  console.error('[DB] Failed to create connection pool:', error.message);
  throw error;
}

// Helper function to execute queries with retry logic
export async function query(text: string, params?: any[], retries = 3): Promise<any> {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    const error = new Error('DATABASE_URL environment variable is not set. Please configure it in Vercel environment variables.');
    console.error('[DB]', error.message);
    throw error;
  }

  // Ensure pool is initialized
  if (!pool) {
    try {
      pool = createPool();
    } catch (error: any) {
      console.error('[DB] Failed to initialize pool:', error.message);
      throw new Error('Database connection pool failed to initialize. Check DATABASE_URL configuration.');
    }
  }

  const start = Date.now();
  let lastError: any;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      if (process.env.NODE_ENV === 'development') {
        console.log('[DB] Executed query', { text: text.substring(0, 50), duration, rows: res.rowCount });
      }
      return res;
    } catch (error: any) {
      lastError = error;
      console.error(`[DB] Query error (attempt ${attempt}/${retries}):`, error.message);
      console.error(`[DB] Error code:`, error.code);
      console.error(`[DB] Error syscall:`, error.syscall);
      
      // Provide helpful error messages
      if (error.code === 'ENOTFOUND' || error.message?.includes('getaddrinfo')) {
        const dbUrl = process.env.DATABASE_URL || '';
        const urlMatch = dbUrl.match(/@([^:]+)/);
        const host = urlMatch ? urlMatch[1] : 'unknown';
        
        console.error('[DB] DNS resolution failed for host:', host);
        console.error('[DB] This usually means:');
        console.error('[DB] 1. The hostname is incorrect');
        console.error('[DB] 2. There is a network/DNS issue');
        console.error('[DB] 3. The database server is not accessible from Vercel');
        console.error('[DB] Try using Supabase connection pooler instead of direct connection');
        console.error('[DB] Connection string preview:', dbUrl.replace(/:[^:@]+@/, ':****@'));
      }
      
      // If it's a connection error and we have retries left, wait and retry
      if (attempt < retries && (
        error.code === 'ENOTFOUND' || 
        error.code === 'ETIMEDOUT' ||
        error.code === 'ECONNREFUSED' ||
        error.message?.includes('getaddrinfo') ||
        error.message?.includes('timeout')
      )) {
        const waitTime = attempt * 2000; // Exponential backoff (2s, 4s, 6s)
        console.log(`[DB] Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError;
}

// Helper function to get a client from the pool (for transactions)
export async function getClient() {
  const client = await pool.connect();
  return client;
}

// Export the pool for direct access if needed
export { pool };

// Helper to close the pool (useful for cleanup)
export async function closePool() {
  await pool.end();
}

