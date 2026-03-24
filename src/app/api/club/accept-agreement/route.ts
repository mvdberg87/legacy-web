import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const { clubId } = await req.json();

  await supabaseAdmin
    .from("clubs")
    .update({
      agreement_accepted: true,
      agreement_accepted_at: new Date().toISOString(),
      agreement_version: "v1",
    })
    .eq("id", clubId);

  return Response.json({ success: true });
}