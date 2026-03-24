import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { AGREEMENT_VERSION } from "@/lib/constants";

export async function POST(req: Request) {
  const { clubId } = await req.json();

  await supabaseAdmin
    .from("clubs")
    .update({
      agreement_accepted: true,
      agreement_accepted_at: new Date().toISOString(),
      agreement_version: AGREEMENT_VERSION,
    })
    .eq("id", clubId);

  return Response.json({ success: true });
}