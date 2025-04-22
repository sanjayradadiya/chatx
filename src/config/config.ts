const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const cdnUrl = import.meta.env.VITE_CDN_URL;
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripeSecretKey = import.meta.env.VITE_STRIPE_SECRET_KEY;

export const APP_CONFIG = {
  SUPA_BASE_URL: supabaseUrl,
  SUPA_BASE_API_KEY: supabaseKey,
  CDN_URL: cdnUrl,
  GEMINI_API_KEY: geminiApiKey,
  STRIPE_PUBLIC_KEY: stripePublicKey,
  STRIPE_SECRET_KEY: stripeSecretKey,
} as const;