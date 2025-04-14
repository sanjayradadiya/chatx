import { APP_CONFIG } from "@/config/config";
import { createClient } from "@supabase/supabase-js";

const supaBaseClient = createClient(APP_CONFIG.SUPA_BASE_URL as string, APP_CONFIG.SUPA_BASE_API_KEY as string);

export default supaBaseClient;