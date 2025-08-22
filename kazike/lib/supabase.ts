// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://jknubpustqswobaujseq.supabase.co";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbnVicHVzdHFzd29iYXVqc2VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4Mzk1NTksImV4cCI6MjA3MTQxNTU1OX0.re7S3fxVomLy4eKGZVIJlU_20tESdg2zBkf1PFkOlBw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export type { SupabaseClient } from "@supabase/supabase-js";

