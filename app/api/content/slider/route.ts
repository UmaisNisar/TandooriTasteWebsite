import { getSupabase } from "@/lib/supabase-edge";
import { NextResponse } from "next/server";

// Use Edge Runtime for maximum performance
export const runtime = 'edge';
export const revalidate = 30; // Cache for 30 seconds

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('HomeSlider')
      .select('*')
      .eq('isActive', true)
      .order('order', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || [], {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });
  } catch (error) {
    console.error('Error fetching slider:', error);
    return NextResponse.json([], { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });
  }
}

