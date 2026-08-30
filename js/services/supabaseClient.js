import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const LOCAL_SUPABASE_URL = "http://127.0.0.1:54321";
const LOCAL_SUPABASE_KEY = "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH";

const REMOTE_SUPABASE_URL = "https://yjakyvtxboclazqhebyq.supabase.co";
const REMOTE_SUPABASE_KEY = "sb_publishable_biDiWyxCFWfylHtwPDDfcw_C_lSxdbg";

const supabaseUrl = isLocal ? LOCAL_SUPABASE_URL : REMOTE_SUPABASE_URL;
const supabaseKey = isLocal ? LOCAL_SUPABASE_KEY : REMOTE_SUPABASE_KEY;

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);