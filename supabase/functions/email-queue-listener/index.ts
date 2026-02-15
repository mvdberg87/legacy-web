// supabase/functions/email-queue-listener/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 🔑 Maak een Supabase client met service role key
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// 🎧 Luistert realtime naar nieuwe e-mails in de queue
const channel = supabase
  .channel("email_queue_listener")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "email_queue" },
    async (payload) => {
      const mail = payload.new;
      console.log("📬 Nieuw mailitem:", mail);

      try {
        // Stuur het nieuwe record naar de bestaande send-emails functie
        const res = await fetch(
          "https://oemyfengrikpgovbyhqv.functions.supabase.co/send-emails",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mail),
          }
        );

        if (!res.ok) throw new Error(`Status ${res.status}`);
        console.log("✅ Mail doorgestuurd naar send-emails:", mail.email);
      } catch (err) {
        console.error("❌ Fout bij doorsturen:", err);
      }
    }
  )
  .subscribe();

// Houd de functie actief
Deno.serve(() => new Response("📡 Email Queue Listener actief"));
