"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import ClubNavbar from "@/components/club/ClubNavbar";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingCard from "@/components/ui/LoadingCard";
import EmptyState from "@/components/ui/EmptyState";
import { Label } from "@/components/ui/label";

type Club = {
  id: string;
  name: string;
  primary_color?: string | null;
  secondary_color?: string | null;
};

export default function NewJobPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const router = useRouter();
  const params = useParams();

  const slug = params.slug as string;

  const [club, setClub] = useState<Club | null>(null);

  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [applyUrl, setApplyUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
(async () => {

const { data: clubData } = await supabase
  .from("clubs")
  .select("id, name, primary_color, secondary_color")
  .eq("public_slug", slug)
  .maybeSingle();

if (!clubData) {
setLoading(false);
return;
}

setClub(clubData);
setLoading(false);

})();
}, [supabase, slug]);

  async function createJob(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !companyName || !applyUrl) {
      toast.error("Vul alle velden in.");
      return;
    }

    if (!club) return;

    setSaving(true);

    const res = await fetch("/api/jobs/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    clubId: club.id,
    title,
    company_name: companyName,
    apply_url: applyUrl,
  }),
});

setSaving(false);

if (!res.ok) {
  toast.error("Vacature aanmaken mislukt");
  return;
}
toast.success("Vacature toegevoegd.");
    router.push(`/admin/clubs/${slug}`)
  }

  if (loading) {
  return (
    <main className="min-h-screen bg-[#0d1b2a] p-6">
      <ClubNavbar slug={slug} />

      <div className="max-w-3xl mx-auto mt-6">
        <LoadingCard rows={5} />
      </div>
    </main>
  );
}

  if (!club) {
  return (
    <main className="min-h-screen bg-[#0d1b2a] p-6">
      <ClubNavbar slug={slug} />

      <div className="max-w-3xl mx-auto mt-6">
        <EmptyState
          title="Club niet gevonden"
          description="Deze club bestaat niet of is verwijderd."
        />
      </div>
    </main>
  );
}

  return (
    <main className="min-h-screen bg-[#0d1b2a] p-6">

      <ClubNavbar slug={slug} />

      <div className="max-w-3xl mx-auto bg-white text-black border-2 border-[#0d1b2a] rounded-2xl p-6 shadow mt-6">

        <h1 className="text-2xl font-semibold mb-6 text-[#0d1b2a]">
          Vacature toevoegen
        </h1>

        <form onSubmit={createJob} className="space-y-4">

          <div>
            <Label>Bedrijfsnaam</Label>

            <Input
  value={companyName}
  onChange={(e) => setCompanyName(e.target.value)}
  required
/>
          </div>

          <div>
            <Label>Functietitel</Label>

            <Input
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  required
/>
          </div>

          <div>
            <Label>Vacaturelink</Label>

            <Input
  type="url"
  value={applyUrl}
  onChange={(e) => setApplyUrl(e.target.value)}
  required
/>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center pt-4">

            <Button
  type="button"
  variant="outline"
  onClick={() => router.back()}
>
  Annuleren
</Button>

            <Button
  type="submit"
  disabled={saving}
>
  {saving ? "Opslaan..." : "Vacature toevoegen"}
</Button>

          </div>

        </form>

      </div>

    </main>
  );
}