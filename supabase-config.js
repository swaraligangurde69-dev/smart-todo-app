const SUPABASE_URL = "https://zsvenawzpqtbavvzqptz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_9U1SLY9cGIM_GUhr0UvE-Q_CCRqTkim";

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);