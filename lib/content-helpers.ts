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

export type ContentBlock = {
  id: string;
  page: string;
  section: string;
  content: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type StoreHours = {
  id: string;
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Holiday = {
  id: string;
  title: string;
  date: string;
  isClosed: boolean;
  overrideOpenTime: string | null;
  overrideCloseTime: string | null;
  createdAt: string;
  updatedAt: string;
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

// Fetch content blocks
export async function fetchContentBlocks(page?: string): Promise<ContentBlock[]> {
  try {
    const supabase = getSupabase();
    let query = supabase.from('ContentBlock').select('*').order('order', { ascending: true });

    if (page) {
      query = query.eq('page', page);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []) as ContentBlock[];
  } catch (error: any) {
    console.error('Error fetching content blocks:', error);
    return [];
  }
}

// Fetch store hours
export async function fetchStoreHours(): Promise<StoreHours[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('StoreHours')
      .select('*')
      .order('dayOfWeek', { ascending: true });

    if (error) throw error;

    return (data || []) as StoreHours[];
  } catch (error: any) {
    console.error('Error fetching store hours:', error);
    return [];
  }
}

// Fetch store hours by day of week
export async function fetchStoreHoursByDay(dayOfWeek: number): Promise<StoreHours | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('StoreHours')
      .select('*')
      .eq('dayOfWeek', dayOfWeek)
      .single();

    if (error) throw error;

    return data as StoreHours | null;
  } catch (error: any) {
    console.error('Error fetching store hours by day:', error);
    return null;
  }
}

// Fetch holidays for a date range
export async function fetchHolidays(startDate: Date, endDate: Date): Promise<Holiday[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('Holiday')
      .select('*')
      .gte('date', startDate.toISOString())
      .lte('date', endDate.toISOString())
      .order('date', { ascending: true });

    if (error) throw error;

    return (data || []) as Holiday[];
  } catch (error: any) {
    console.error('Error fetching holidays:', error);
    return [];
  }
}

// Fetch featured dishes with menu items
export async function fetchFeaturedDishes(): Promise<Array<{
  id: string;
  menuItemId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  menuItem: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string | null;
    category: {
      id: string;
      name: string;
      slug: string;
    } | null;
  } | null;
}>> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('FeaturedDish')
      .select(`
        *,
        MenuItem (
          *,
          Category (
            *
          )
        )
      `)
      .order('order', { ascending: true });

    if (error) throw error;

    // Transform to nested structure
    const featured = (data || []).map((row: any) => ({
      id: row.id,
      menuItemId: row.menuItemId,
      order: row.order,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      menuItem: row.MenuItem ? {
        id: row.MenuItem.id,
        name: row.MenuItem.name,
        description: row.MenuItem.description,
        price: parseFloat(row.MenuItem.price),
        imageUrl: row.MenuItem.imageUrl,
        category: row.MenuItem.Category ? {
          id: row.MenuItem.Category.id,
          name: row.MenuItem.Category.name,
          slug: row.MenuItem.Category.slug,
        } : null,
      } : null,
    })).filter((f: any) => f.menuItem); // Filter out any with missing menu items

    return featured;
  } catch (error: any) {
    console.error('Error fetching featured dishes:', error);
    return [];
  }
}

