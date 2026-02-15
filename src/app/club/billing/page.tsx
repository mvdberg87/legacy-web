"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import ClubNavbar from "@/components/club/ClubNavbar";

type PackageKey = "basic" | "plus" | "pro" | "unlimited";

export default function ClubBillingPage() {
  const searchParams = useSearchParams();
  const { slug } = useParams<{ slug: string }>();

  const autoCheckout =
    searchParams.get("autoCheckout") === "true";

  const supabase = useMemo(() => getSupabaseBrowser(), []);

  const [loading, setLoading] = useState<PackageKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [packageToPay, setPackageToPay] =
    useState<PackageKey | null>(null);

  /* ===============================
     1️⃣ Goedgekeurde upgrade ophalen
     =============================== */
  useEffect(() => {
    async function loadApprovedUpgrade() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("club_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!profile?.club_id) return;

      const { data: approvedUpgrade } = await supabase
        .from("club_upgrade_requests")
        .select("requested_package")
        .eq("club_id", profile.club_id)
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (approvedUpgrade?.requested_package) {
        setPackageToPay(
          approvedUpgrade.requested_package as PackageKey
        );
      }
    }

    loadApprovedUpgrade();
  }, [supabase]);

  /* ===============================
     2️⃣ Stripe Checkout starten
     =============================== */
  async function handleCheckout(packageKey: PackageKey) {
    if (loading) return;

    setLoading(packageKey);
    setError(null);

    try {
      const res = await fetch(
        "/api/billing/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ packageKey }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.checkoutUrl) {
        throw new Error(
          data.error ||
            "Kon betaling niet starten. Probeer opnieuw."
        );
      }

      window.location.href = data.checkoutUrl;
    } catch (err: any) {
      console.error("❌ Checkout error:", err);
      setError(err.message);
      setLoading(null);
    }
  }

  /* ===============================
     3️⃣ Auto-checkout via mail
     =============================== */
  useEffect(() => {
    if (autoCheckout && packageToPay && !loading) {
      handleCheckout(packageToPay);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCheckout, packageToPay]);

  return (
    <main className="min-h-screen bg-[#0d1b2a] p-6">
      <ClubNavbar slug={slug} />

      <div className="max-w-5xl mx-auto mt-6">
        <h1 className="text-2xl font-semibold mb-4 text-white">
          Abonnement afronden
        </h1>

        <p className="mb-8 text-white/80">
          Jullie upgrade is goedgekeurd. Rond de betaling af
          om het abonnement te activeren.
        </p>

        {error && (
          <p className="mb-6 text-red-300 text-sm">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(
            ["basic", "plus", "pro", "unlimited"] as PackageKey[]
          ).map((key) => {
            const isPayable = key === packageToPay;

            return (
              <PlanCard
                key={key}
                title={key.toUpperCase()}
                packageKey={key}
                loading={loading}
                onCheckout={handleCheckout}
                highlight={isPayable}
                disabled={!isPayable}
                isPayable={isPayable}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}

/* ===============================
   PlanCard
   =============================== */

function PlanCard({
  title,
  packageKey,
  loading,
  onCheckout,
  disabled,
  highlight,
  isPayable,
}: {
  title: string;
  packageKey: PackageKey;
  loading: PackageKey | null;
  onCheckout: (key: PackageKey) => void;
  disabled?: boolean;
  highlight?: boolean;
  isPayable?: boolean;
}) {
  const isLoading = loading === packageKey;

  return (
    <div
      className={`border-2 rounded-xl p-6 ${
        highlight
          ? "border-green-600 bg-green-50"
          : "bg-white"
      } ${disabled ? "opacity-50" : ""}`}
    >
      <h2 className="text-xl font-semibold mb-2">
        {title}
      </h2>

      {isPayable && (
        <p className="mb-4 text-sm text-green-700 font-medium">
          Te betalen pakket
        </p>
      )}

      <button
        onClick={() => onCheckout(packageKey)}
        disabled={disabled || !!loading}
        className={`w-full py-3 rounded-lg font-medium transition ${
          highlight
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-gray-800 hover:bg-gray-900 text-white"
        } disabled:opacity-50`}
      >
        {isLoading
          ? "Bezig met doorsturen…"
          : isPayable
          ? "Ga naar betaling"
          : "Niet beschikbaar"}
      </button>
    </div>
  );
}
