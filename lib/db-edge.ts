// Edge-compatible database client using @vercel/postgres
// This works with Supabase Session Pooler (IPv4-compatible)
// Note: @vercel/postgres requires DATABASE_URL to be set in Vercel environment variables
import { sql } from '@vercel/postgres';

export const revalidate = 30; // Default cache revalidation time

// Edge-compatible query function
// @vercel/postgres supports parameterized queries: sql.query(text, params)
export async function queryEdge(text: string, params?: any[]): Promise<any> {
  try {
    // @vercel/postgres sql.query() supports parameterized queries with $1, $2, etc.
    const result = await sql.query(text, params || []);
    return {
      rows: result.rows || [],
      rowCount: result.rowCount || (result.rows ? result.rows.length : 0)
    };
  } catch (error: any) {
    console.error('[DB-EDGE] Query error:', error.message);
    console.error('[DB-EDGE] Query:', text.substring(0, 100));
    throw error;
  }
}

// Helper to execute raw SQL (for compatibility with existing code)
export async function query(text: string, params?: any[]): Promise<any> {
  return queryEdge(text, params);
}

// Export sql for direct use with template literals (recommended for edge)
export { sql };

