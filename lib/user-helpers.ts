import { getSupabase } from "@/lib/supabase-edge";

export type User = {
  id: string;
  email: string;
  name: string | null;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

// Find user by email
export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error) {
      // If no rows found, Supabase returns a specific error
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data as User | null;
  } catch (error: any) {
    console.error('Error finding user by email:', error);
    return null;
  }
}

// Find user by ID
export async function findUserById(id: string): Promise<User | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data as User | null;
  } catch (error: any) {
    console.error('Error finding user by id:', error);
    return null;
  }
}

