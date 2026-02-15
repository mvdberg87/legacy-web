// @ts-nocheck

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async () => {
  const { data: pending } = await supabase
    .from("email_queue")
    .select("*")
    .eq("sent", false)
    .limit(10);

  if (!pending?.length) return new Response("No emails to send.");

  for (const mail of pending) {
    try {
      await resend.emails.send({
        from: "Sponsorjobs <no-reply@sponsorjobs.nl>",
        to: mail.email,
        subject: mail.subject,
        text: mail.body,
      });

      await supabase.from("email_queue").update({ sent: true }).eq("id", mail.id);
      console.log("✅ Sent to", mail.email);
    } catch (err) {
      console.error("❌ Failed:", mail.email, err);
    }
  }

  return new Response("Emails processed.");
});
