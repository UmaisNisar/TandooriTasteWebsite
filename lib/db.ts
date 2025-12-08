import { Pool } from 'pg';

// Create a connection pool for PostgreSQL
// For serverless, use smaller pool size and longer timeouts
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('sslmode=require') 
    ? { rejectUnauthorized: false } 
    : undefined,
  max: 10, // Reduced for serverless
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased timeout
  // For serverless, we want to keep connections alive longer
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

// Helper function to execute queries with retry logic
export async function query(text: string, params?: any[], retries = 3): Promise<any> {
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

