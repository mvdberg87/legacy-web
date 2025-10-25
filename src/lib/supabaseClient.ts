import { createClient } from "@supabase/supabase-js";
export function getSupabase() {
  const url = "https://oemyfengrikpgovbyhqv.supabase.co";
  const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lbXlmZW5ncmlrcGdvdmJ5aHF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NjY1NTUsImV4cCI6MjA3NjI0MjU1NX0.cft4CakULLW-Q6xt_4ECnBl5GUx1ETyyWoE21YyutSg";
  return createClient(url, key);
}
