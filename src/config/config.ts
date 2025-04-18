
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const cdnUrl = import.meta.env.VITE_CDN_URL;
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const APP_CONFIG = {
  SUPA_BASE_URL: supabaseUrl,
  SUPA_BASE_API_KEY: supabaseKey,
  CDN_URL: cdnUrl,
  GEMINI_API_KEY: geminiApiKey,
} as const;