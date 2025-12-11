import { NextResponse } from "next/server";
import { getSupabase } from '@/lib/supabase-edge';

// Use Edge Runtime for maximum performance
export const runtime = 'edge';
export const revalidate = 30; // Cache for 30 seconds

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('Review')
      .select('*')
      .eq('isVisible', true)
      .order('createdAt', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || [], {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json([], { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });
  }
}
