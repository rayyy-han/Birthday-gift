import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Cek apakah Supabase dikonfigurasi dengan kredensial nyata (bukan placeholder)
export const isSupabaseReady = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.includes("supabase.co") &&
    !supabaseUrl.includes("your-project-id") &&
    !supabaseAnonKey.includes("your-anon-key") &&
    supabaseAnonKey.length > 20
);

export const supabase: SupabaseClient | null = isSupabaseReady
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
