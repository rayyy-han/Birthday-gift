import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://yiqhxjfnmrdionjzsarq.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcWh4amZubXJkaW9uanpzYXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5MTIwMDIsImV4cCI6MjEwNzQ4ODAwMn0.65u12ZFoNbk5-kDBZobx02p5XoY3RWzs-IcWOpLpFtA";

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
