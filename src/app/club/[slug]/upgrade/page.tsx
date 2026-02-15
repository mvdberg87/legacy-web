"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import getSupabaseBrowser from "@/lib/supabaseBrowser";
import ClubNavbar from "@/components/club/ClubNavbar";

type Club = {
  id: string;
  name: string;
  ad_package: "basic" | "plus" | "pro" | "unlimited";
};

const PACKAGES = [
  { key: "basic", label: "Basic", price: "Gratis", ads: 0 },
  { key: "plus", label: "Plus", price: "€29 / maand", ads: 3 },
  { key: "pro", label: "Pro", price: "€79 / maand", ads: 10 },
  { key: "unlimited", label: "Unlimited", price: "Op aanvraag", ads: "Onbeperkt" },
];

export default function UpgradePage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("club_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!profile?.club_id) return;

      const { data: clubData } = await supabase
        .from("clubs")
        .select("id, name, ad_package")
        .eq("id", profile.club_id)
        .maybeSingle();

      setClub(clubData ?? null);
      setLoading(false);
    })();
  }, [supabase]);

  async function requestUpgrade(target: string) {
    if (!club) return;

    setSubmitting(true);

    const res = await fetch("/api/club/request-upgrade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clubId: club.id,
        packageKey: target,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Upgrade aanvragen mislukt");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setSuccess(true);
  }

  if (loading || !club) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0d1b2a] text-white">
        Laden…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d1b2a] p-6">
      <ClubNavbar slug={slug} />

      <div className="max-w-4xl mx-auto bg-white border-2 border-white rounded-2xl p-8 shadow-xl mt-6">
        <h1 className="text-2xl font-semibold mb-2">
          Upgrade pakket
        </h1>

        <p className="text-sm text-gray-600 mb-8">
          Huidig pakket:{" "}
          <strong>{club.ad_package.toUpperCase()}</strong>
        </p>

        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-100 text-green-800">
            Upgrade-aanvraag verzonden. We nemen snel contact met je op.
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-6">
          {PACKAGES.map((p) => {
            const disabled = p.key === club.ad_package;

            return (
              <div
                key={p.key}
                className={`
                  rounded-xl border-2 p-6 transition
                  ${disabled
                    ? "bg-gray-100 border-gray-300 opacity-60"
                    : "bg-[#0d1b2a] border-white text-white"}
                `}
              >
                <h2 className="text-lg font-semibold mb-1">
                  {p.label}
                </h2>

                <p className="text-sm mb-2 opacity-80">
                  {p.price}
                </p>

                <p className="text-sm mb-6">
                  Advertenties: {p.ads}
                </p>

                <button
                  disabled={disabled || submitting}
                  onClick={() => requestUpgrade(p.key)}
                  className={`
                    w-full rounded-xl px-4 py-2 text-sm font-semibold transition
                    ${
                      disabled
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                        : "bg-[#1f9d55] text-white hover:bg-[#15803d]"
                    }
                  `}
                >
                  {disabled ? "Huidig pakket" : "Upgrade aanvragen"}
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => router.push(`/club/${slug}/dashboard`)}
          className="mt-8 text-sm underline"
        >
          ← Terug naar dashboard
        </button>
      </div>
    </main>
  );
}
