import { getSupabase } from "@/lib/supabase-edge";

export type Slide = {
  id: string;
  imageUrl: string;
  caption: string | null;
  altText: string | null;
  order: number;
  isActive: boolean;
};

export type Review = {
  id: string;
  reviewerName: string;
  reviewerImageUrl: string | null;
  rating: number;
  text: string;
  isVisible: boolean;
  createdAt: string;
};

// Fetch slider data
export async function fetchSliderData(): Promise<Slide[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('HomeSlider')
      .select('*')
      .eq('isActive', true)
      .order('order', { ascending: true });

    if (error) throw error;

    return (data || []) as Slide[];
  } catch (error: any) {
    console.error('Error fetching slider:', error);
    return [];
  }
}

// Fetch reviews data
export async function fetchReviewsData(): Promise<Review[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('Review')
      .select('*')
      .eq('isVisible', true)
      .order('createdAt', { ascending: false });

    if (error) throw error;

    return (data || []) as Review[];
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

