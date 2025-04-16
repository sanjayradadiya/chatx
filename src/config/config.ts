
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const APP_CONFIG = {
  SUPA_BASE_URL: supabaseUrl,
  SUPA_BASE_API_KEY: supabaseKey
}