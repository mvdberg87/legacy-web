import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

import type {
  ExecutiveData,
} from "./types";

export async function loadExecutiveData(): Promise<ExecutiveData> {

  const supabase = getSupabaseBrowser();

  const [

    clubs,

    subscriptions,

    advertisements,

  ] = await Promise.all([

    supabase
      .from("club_admin_overview")
      .select("*"),

    supabase
      .from("subscriptions_overview")
      .select("*"),

    supabase
      .from("admin_advertisements_overview")
      .select("*"),

  ]);

  return {

    clubs:
      clubs.data ?? [],

    subscriptions:
      subscriptions.data ?? [],

    advertisements:
      advertisements.data ?? [],

  };

}