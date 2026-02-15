import getSupabaseServer from "@/lib/supabase.server";

export default async function DebugAuth() {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="p-10">
      <h2 className="text-lg font-bold mb-4">Debug Auth Info</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
