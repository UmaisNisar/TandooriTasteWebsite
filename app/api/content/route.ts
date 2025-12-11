import { NextResponse } from "next/server";
import { getSupabase } from '@/lib/supabase-edge';

// Use Edge Runtime for maximum performance
export const runtime = 'edge';
export const revalidate = 30; // Cache for 30 seconds

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");

    const supabase = getSupabase();
    let query = supabase.from('ContentBlock').select('*').order('order', { ascending: true });

    if (page) {
      query = query.eq('page', page);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data || [], {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });
  } catch (error: any) {
    console.error('Error fetching content blocks:', error);
    return NextResponse.json([], { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });
  }
}
