"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import { toast } from "sonner";
import { useConfirm } from "@/components/providers/confirm-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingCard from "@/components/ui/LoadingCard";
import EmptyState from "@/components/ui/EmptyState";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

/* ---------- Types ---------- */

type Profile = {
  user_id: string;
  email: string;
  role: string;
  created_at: string;

  club_id: string | null;
  club_name: string | null;
  club_slug: string | null;
  public_slug: string | null;
  club_status: string | null;
  club_package: string | null;

  contact_person?: string | null;
talentpool_enabled?: boolean | null;
  advertising_sales_enabled?: boolean | null;
  subscription_status?: string | null;
  subscription_cancelled_at?: string | null;
  subscription_end?: string | null;

  archived_at?: string | null;

  signup_request_id: string | null;
  signup_request_status:
    | "pending"
    | "approved"
    | "rejected"
    | null;
};


/* ---------- Pagina ---------- */

export default function AdminProfilesPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const router = useRouter();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showArchivedClubs, setShowArchivedClubs] =
  useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { confirm } = useConfirm();
  const [editingClub, setEditingClub] = useState<{
  id: string;
  currentName: string;
} | null>(null);
const [editingPublicSlugClub, setEditingPublicSlugClub] = useState<{
  id: string;
  clubName: string;
} | null>(null);

const [publicSlug, setPublicSlug] = useState("");

const [contactPerson, setContactPerson] = useState("");

  /* ---------- Data ophalen ---------- */

  useEffect(() => {
    loadProfiles();
  }, []);

  async function loadProfiles() {
    setLoading(true);

    const { data, error } = await supabase
  .from("admin_profiles_overview")
  .select("*")
  .order("created_at", { ascending: false });

    if (error) {
      console.error("Fout bij laden profielen:", error);
      setProfiles([]);
    } else {
      setProfiles(data ?? []);
    }

    setLoading(false);
  }

  /* ---------- Acties ---------- */

  async function updateClubStatus(
    clubId: string,
    status: "approved" | "rejected"
  ) {
    const confirmed = await confirm({
  title:
    status === "approved"
      ? "Club goedkeuren"
      : "Club afwijzen",
  description: `Weet je zeker dat je deze club wilt ${
    status === "approved"
      ? "goedkeuren"
      : "afwijzen"
  }?`,
  confirmText:
    status === "approved"
      ? "Goedkeuren"
      : "Afwijzen",
  cancelText: "Annuleren",
  destructive: status === "rejected",
});

if (!confirmed) return;

    try {
      setRefreshing(true);

      const { error } = await supabase
        .from("clubs")
        .update({ status })
        .eq("id", clubId);

      if (error) throw error;

      await loadProfiles();
    } catch {
      toast.error("Fout bij aanpassen status");
    } finally {
      setRefreshing(false);
    }
  }

  async function deleteClub(clubId: string, clubName: string) {
    const confirmed = await confirm({
  title: "Club verwijderen",
  description: `${clubName} wordt volledig verwijderd inclusief vacatures en statistieken.`,
  confirmText: "Verwijderen",
  cancelText: "Annuleren",
  destructive: true,
});

if (!confirmed) return;

    try {
      setRefreshing(true);

      const res = await fetch("/api/admin/delete-club", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clubId }),
      });

      if (!res.ok) throw new Error("Delete failed");

      await loadProfiles();
    } catch {
      toast.error("Fout bij verwijderen club");
    } finally {
      setRefreshing(false);
    }
  }

  async function archiveClub(
  clubId: string
) {
  const confirmed = await confirm({
    title: "Club archiveren",
    description:
      "Weet je zeker dat je deze club wilt archiveren?",
    confirmText: "Archiveren",
    cancelText: "Annuleren",
  });

  if (!confirmed) return;

  const res = await fetch(
    "/api/admin/archive-club",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clubId,
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    toast.error(
      data.error ?? "Archiveren mislukt"
    );
    return;
  }

  await loadProfiles();
}

async function restoreClub(
  clubId: string
) {
  const confirmed = await confirm({
    title: "Club herstellen",
    description:
      "Weet je zeker dat je deze club wilt herstellen?",
    confirmText: "Herstellen",
    cancelText: "Annuleren",
  });

  if (!confirmed) return;

  const res = await fetch(
    "/api/admin/restore-club",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clubId,
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    toast.error(
      data.error ?? "Herstellen mislukt"
    );
    return;
  }

  await loadProfiles();
}

async function saveContactPerson() {
  if (!editingClub) return;

  const res = await fetch(
    "/api/admin/update-contact-person",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clubId: editingClub.id,
        contactPerson,
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    toast.error(data.error ?? "Opslaan mislukt");
    return;
  }

  await loadProfiles();

  setEditingClub(null);
  setContactPerson("");

  toast.success("Contactpersoon opgeslagen.");
}

async function savePublicSlug() {
  if (!editingPublicSlugClub) return;

  const slug = publicSlug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  if (!slug) {
    toast.error(
      "Gebruik alleen kleine letters en cijfers."
    );
    return;
  }

  const { data: existing } = await supabase
    .from("clubs")
    .select("id")
    .eq("public_slug", slug)
    .neq("id", editingPublicSlugClub.id)
    .maybeSingle();

  if (existing) {
    toast.error(
      "Deze publieke URL bestaat al."
    );
    return;
  }

  const { error } = await supabase
    .from("clubs")
    .update({
      public_slug: slug,
    })
    .eq("id", editingPublicSlugClub.id);

  if (error) {
    toast.error("Opslaan mislukt.");
    return;
  }

  await loadProfiles();

  setEditingPublicSlugClub(null);
  setPublicSlug("");

  toast.success("Publieke URL opgeslagen.");
}

async function resendActivationLink(requestId: string) {
  const confirmed = await confirm({
  title: "Activatielink opnieuw versturen",
  description:
    "Wil je een nieuwe activatielink versturen?",
  confirmText: "Versturen",
  cancelText: "Annuleren",
});

if (!confirmed) return;

  try {
    setRefreshing(true);

    const res = await fetch("/api/admin/resend-activation-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId }),
    });

    if (!res.ok) throw new Error();

    toast.success("Activatielink opnieuw verstuurd.");
  } catch {
    toast.error("Fout bij versturen activatielink.");
  } finally {
    setRefreshing(false);
  }
}

async function toggleManagedAds(
  clubId: string,
  currentValue: boolean
) {

  const { error } =
    await supabase
      .from("clubs")
      .update({
        advertising_sales_enabled:
          !currentValue,
      })
      .eq("id", clubId);

  if (error) {
    toast.error("Opslaan mislukt");
    return;
  }

  await loadProfiles();
}

async function toggleTalentpool(
  clubId: string,
  currentValue: boolean
) {

  const { error } =
    await supabase
      .from("clubs")
      .update({
        talentpool_enabled:
          !currentValue,
      })
      .eq("id", clubId);

  if (error) {
    toast.error("Opslaan mislukt");
    return;
  }

  await loadProfiles();
}
  /* ---------- Filter ---------- */

  const filtered = profiles
  .filter((p) => {
    if (!p.club_id) return true;

    if (showArchivedClubs) {
      return p.archived_at;
    }

    return !p.archived_at;
  })
  .filter((p) => {
    const q = search.toLowerCase();

    return (
      p.email.toLowerCase().includes(q) ||
      (p.club_name ?? "")
        .toLowerCase()
        .includes(q) ||
      p.role.toLowerCase().includes(q)
    );
  });

  /* ---------- Render ---------- */

  return (
    <div className="space-y-8">
      <div className="bg-white text-black rounded-2xl shadow p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-xl font-semibold">
            Profielbeheer
          </h1>

          <div className="flex flex-wrap gap-3 mt-4">

  <Button
  variant={!showArchivedClubs ? "default" : "outline"}
  onClick={() => setShowArchivedClubs(false)}
>
  Actief
</Button>

  <Button
  variant={showArchivedClubs ? "default" : "outline"}
  onClick={() => setShowArchivedClubs(true)}
>
  Gearchiveerd
</Button>

</div>

          <Input
  placeholder="Zoek..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="w-full md:w-80"
/>
        </div>

        {/* Content */}
        {loading ? (
  <LoadingCard rows={8} />
) : filtered.length === 0 ? (
          <EmptyState
  title="Geen profielen gevonden"
  description="Er zijn geen profielen die voldoen aan de huidige filters."
/>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#0d1b2a] text-white text-xs uppercase">
                <tr>
                  <th className="px-3 py-3 text-left">Club</th>
                  <th className="px-3 py-3 text-left">E-mail</th>
                  <th className="px-3 py-3 text-left">
  Contactpersoon
</th>
                  <th className="px-3 py-3 text-left">Rol</th>
<th className="px-3 py-3 text-left">
  Pakket
</th>

<th className="px-3 py-3 text-center">
  Managed Ads
</th>

<th className="px-3 py-3 text-center">
  Talentpool
</th>

<th className="px-3 py-3 text-left">
  Aangemaakt
</th>
                  <th className="px-3 py-3 text-center">Acties</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((p, i) => {
                  const club = p.club_id
                    ? {
                        id: p.club_id,
                        name: p.club_name!,
                        slug: p.club_slug!,
                        status: p.club_status!,
                      }
                    : null;

                  return (
                    <motion.tr
                      key={p.user_id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b last:border-b-0 hover:bg-blue-50/40"
                    >
                      <td className="px-3 py-3">
  {club ? (
    <div className="flex flex-col break-words">
      <Button
  variant="link"
  className="h-auto p-0 text-left justify-start"
  onClick={() =>
    router.push(`/admin/clubs/${club.slug}`)
  }
>
  {club.name}
</Button>

<div className="flex items-center gap-2">
  <a
    href={`/${p.public_slug}`}
    target="_blank"
    rel="noopener noreferrer"
    className="text-xs text-blue-600 hover:underline"
  >
    /{p.public_slug}
  </a>

  <Button
    size="icon"
    variant="ghost"
    className="h-6 w-6"
    onClick={() => {
      setEditingPublicSlugClub({
        id: club.id,
        clubName: club.name,
      });

      setPublicSlug(p.public_slug ?? "");
    }}
  >
    ✏️
  </Button>
</div>

      <span className="text-xs">
        {p.subscription_cancelled_at ? (
          <span className="text-orange-600">
            Opgezegd (tot {new Date(
              p.subscription_cancelled_at
            ).toLocaleDateString("nl-NL")})
          </span>
        ) : p.subscription_status === "active" ? (
          <span className="text-green-600">
            Actief
          </span>
        ) : (
          <span className="text-gray-500">
            {club.status}
          </span>
        )}
      </span>
    </div>
  ) : (
    <span className="italic text-gray-400">
      Geen club
    </span>
  )}
</td>

<td className="px-3 py-3 max-w-[200px] break-all">
  {p.email}
</td>

                      <td className="px-3 py-3">
  {club ? (
    <Button
  size="sm"
  variant="ghost"
  onClick={() => {
    setEditingClub({
      id: club.id,
      currentName: p.contact_person ?? "",
    });

    setContactPerson(
      p.contact_person ?? ""
    );
  }}
>
  {p.contact_person ?? "—"}
</Button>
  ) : (
    "—"
  )}
</td>

                      <td className="px-3 py-3">
                        {p.role}
                      </td>

                      <td className="px-3 py-3">
  {p.club_package ?? "—"}
</td>

<td className="px-3 py-3 text-center">

  {club ? (

    <Button
  size="sm"
  variant={
    p.advertising_sales_enabled
      ? "default"
      : "secondary"
  }
  onClick={() =>
    toggleManagedAds(
      club.id,
      p.advertising_sales_enabled ?? false
    )
  }
>
  {p.advertising_sales_enabled ? "AAN" : "UIT"}
</Button>

  ) : (
    "—"
  )}

</td>

<td className="px-3 py-3 text-center">

  {club ? (

    <Button
      size="sm"
      variant={
        p.talentpool_enabled
          ? "default"
          : "secondary"
      }
      onClick={() =>
        toggleTalentpool(
          club.id,
          p.talentpool_enabled ?? false
        )
      }
    >
      {p.talentpool_enabled ? "AAN" : "UIT"}
    </Button>

  ) : (
    "—"
  )}

</td>

                      <td className="px-3 py-3">
                        {new Date(p.created_at).toLocaleDateString("nl-NL")}
                      </td>

                      <td className="px-3 py-3 text-center">
                        {club && (
                          <div className="flex flex-wrap justify-center gap-2">

  {club.status === "pending" && (
    <>
      <Button
  size="icon"
  className="bg-green-600 hover:bg-green-700"
  onClick={() =>
    updateClubStatus(club.id, "approved")
  }
  disabled={refreshing}
>
  ✅
</Button>

      <Button
  size="icon"
  variant="secondary"
  onClick={() =>
    updateClubStatus(club.id, "rejected")
  }
  disabled={refreshing}
>
  ❌
</Button>
    </>
  )}

  {p.archived_at ? (
  <>
    <Button
  size="icon"
  className="bg-green-600 hover:bg-green-700"
  onClick={() => restoreClub(club.id)}
>
  ↩️
</Button>

   <Button
  size="icon"
  variant="destructive"
  onClick={() =>
    deleteClub(club.id, club.name)
  }
>
  🗑️
</Button>
  </>
) : (
  <>
    {(club.status === "active" ||
      club.status === "approved") && (
      <Button
  size="icon"
  variant="secondary"
  onClick={() => archiveClub(club.id)}
>
  📦
</Button>
    )}

    {(club.status === "pending" ||
      club.status === "rejected") && (
      <Button
  size="icon"
  variant="destructive"
  onClick={() =>
    deleteClub(club.id, club.name)
  }
>
  🗑️
</Button>
    )}
  </>
)}

</div>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Dialog
  open={!!editingClub}
  onOpenChange={(open) => {
    if (!open) {
      setEditingClub(null);
      setContactPerson("");
    }
  }}
>
  <DialogContent className="sm:max-w-md">

    <DialogHeader>
      <DialogTitle>
        Contactpersoon wijzigen
      </DialogTitle>

      <DialogDescription>
        Pas de contactpersoon van deze club aan.
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-2">
      <Label>Naam contactpersoon</Label>

      <Input
        value={contactPerson}
        onChange={(e) =>
          setContactPerson(e.target.value)
        }
      />
    </div>

    <DialogFooter>

      <Button
        variant="outline"
        onClick={() => {
          setEditingClub(null);
          setContactPerson("");
        }}
      >
        Annuleren
      </Button>

      <Button onClick={saveContactPerson}>
        Opslaan
      </Button>

    </DialogFooter>

  </DialogContent>
</Dialog>

<Dialog
  open={!!editingPublicSlugClub}
  onOpenChange={(open) => {
    if (!open) {
      setEditingPublicSlugClub(null);
      setPublicSlug("");
    }
  }}
>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>
        Publieke URL wijzigen
      </DialogTitle>

      <DialogDescription>
        Pas de publieke URL van deze vereniging aan.
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-2">
      <Label>Publieke URL</Label>

      <Input
        value={publicSlug}
        onChange={(e) =>
          setPublicSlug(e.target.value)
        }
        placeholder="fcsgravenzande"
      />
    </div>

    <DialogFooter>
      <Button
        variant="outline"
        onClick={() => {
          setEditingPublicSlugClub(null);
          setPublicSlug("");
        }}
      >
        Annuleren
      </Button>

      <Button onClick={savePublicSlug}>
  Opslaan
</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </div>
  );
}
