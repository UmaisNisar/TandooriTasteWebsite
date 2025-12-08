import { Pool } from 'pg';

// Validate DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set!');
  console.error('Please set DATABASE_URL in Vercel environment variables.');
}

// Create a connection pool for PostgreSQL
// For serverless, use smaller pool size and longer timeouts
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('sslmode=require') 
    ? { rejectUnauthorized: false } 
    : undefined,
  max: 10, // Reduced for serverless
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000, // Increased timeout for serverless
  // For serverless, we want to keep connections alive longer
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

// Add error handler to pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Helper function to execute queries with retry logic
export async function query(text: string, params?: any[], retries = 3): Promise<any> {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    const error = new Error('DATABASE_URL environment variable is not set. Please configure it in Vercel environment variables.');
    console.error(error.message);
    throw error;
  }

  const start = Date.now();
  let lastError: any;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      if (process.env.NODE_ENV === 'development') {
        console.log('Executed query', { text, duration, rows: res.rowCount });
      }
      return res;
    } catch (error: any) {
      lastError = error;
      console.error(`Database query error (attempt ${attempt}/${retries}):`, error.message);
      
      // Provide helpful error messages
      if (error.code === 'ENOTFOUND' || error.message?.includes('getaddrinfo')) {
        console.error('DNS resolution failed. Check:');
        console.error('1. DATABASE_URL is set in Vercel environment variables');
        console.error('2. Connection string format is correct');
        console.error('3. Database host is reachable');
        console.error('Current DATABASE_URL format:', process.env.DATABASE_URL ? 
          process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@') : 'NOT SET');
      }
      
      // If it's a connection error and we have retries left, wait and retry
      if (attempt < retries && (
        error.code === 'ENOTFOUND' || 
        error.code === 'ETIMEDOUT' ||
        error.code === 'ECONNREFUSED' ||
        error.message?.includes('getaddrinfo') ||
        error.message?.includes('timeout')
      )) {
        const waitTime = attempt * 1000; // Exponential backoff
        console.log(`Retrying in ${waitTime}ms...`);
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

