import { NextResponse } from "next/server";
import { getSupabase } from '@/lib/supabase-edge';

// Use Edge Runtime for maximum performance
export const runtime = 'edge';
export const revalidate = 30; // Cache for 30 seconds

export async function GET() {
  try {
    const supabase = getSupabase();
    
    // Fetch store hours and upcoming holidays in parallel
    const [hoursResult, holidaysResult] = await Promise.all([
      supabase
        .from('StoreHours')
        .select('*')
        .order('dayOfWeek', { ascending: true }),
      supabase
        .from('Holiday')
        .select('*')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
    ]);

    if (hoursResult.error) throw hoursResult.error;
    if (holidaysResult.error) throw holidaysResult.error;

    return NextResponse.json({
      hours: hoursResult.data || [],
      holidays: holidaysResult.data || []
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });
  } catch (error: any) {
    console.error('Error fetching store hours:', error);
    return NextResponse.json({ 
      hours: [], 
      holidays: [] 
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });
  }
}
