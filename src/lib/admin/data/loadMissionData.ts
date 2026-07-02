import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

export async function loadMissionData() {

  const supabase =
    getSupabaseBrowser();

  const [

    clubs,

    advertisements,

  ] = await Promise.all([

    supabase
      .from("clubs")
      .select(
        "id, name, active_package, subscription_status, subscription_start, subscription_end, subscription_cancelled_at"
      ),

    supabase
      .from("admin_advertisements_overview")
      .select("*"),

  ]);

  return {

    clubs:
      clubs.data ?? [],

    advertisements:
      advertisements.data ?? [],

  };

}