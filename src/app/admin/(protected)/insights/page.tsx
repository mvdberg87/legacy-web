"use client";

import { useEffect, useMemo, useState } from "react";
import getSupabaseBrowser from "../../../../lib/supabaseBrowser";

type Profile = { user_id: string; club_id: string; role: string };
type Row = {
  job_id: string;
  job_title: string | null;
  sponsor_name: string | null;
  like_count: number | null;
  last_liked_at: string | null;
};

type RangeKey = "all" | "7d" | "30d";

export default function InsightsPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [userId, setUserId] = useState<string | null>(null);
  const [clubId, setClubId] = useState<string | null>(null);

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [range, setRange] = useState<RangeKey>("all");

  /* ---------- user ophalen ---------- */

  useEffect(() => {
    let ignore = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!ignore) setUserId(data.user?.id ?? null);
    })();
    return () => {
      ignore = true;
    };
  }, [supabase]);

  /* ---------- data ophalen ---------- */

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let ignore = false;

    (async () => {
      setLoading(true);
      setErr(null);

      try {
        const { data: prof, error: pErr } = await supabase
          .from("profiles")
          .select("club_id, role")
          .eq("user_id", userId)
          .maybeSingle();

        if (pErr) throw pErr;
        if (!prof) throw new Error("Geen profiel gevonden.");

        const cId = (prof as Profile).club_id;
        if (!ignore) setClubId(cId);

        let startISO: string | null = null;
        if (range === "7d") {
          const d = new Date();
          d.setDate(d.getDate() - 7);
          startISO = d.toISOString();
        } else if (range === "30d") {
          const d = new Date();
          d.setDate(d.getDate() - 30);
          startISO = d.toISOString();
        }

        let q = supabase
          .from("v_club_job_likes")
          .select(
            "job_id, job_title, sponsor_name, like_count, last_liked_at"
          )
          .eq("club_id", cId)
          .order("like_count", { ascending: false })
          .order("last_liked_at", {
            ascending: false,
            nullsFirst: false,
          });

        if (startISO) {
          q = q
            .not("last_liked_at", "is", null)
            .gte("last_liked_at", startISO);
        }

        const { data, error } = await q;
        if (error) throw error;

        if (!ignore) setRows((data ?? []) as Row[]);
      } catch (e: any) {
        if (!ignore)
          setErr(e?.message ?? "Kon insights niet laden.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [supabase, userId, range]);

  /* ---------- CSV export ---------- */

  function exportCSV() {
    const header = [
      "Vacature",
      "Sponsor",
      "Likes",
      "Laatst geliked",
    ];

    const lines = rows.map((r) =>
      [
        safeCSV(r.job_title ?? ""),
        safeCSV(r.sponsor_name ?? ""),
        String(r.like_count ?? 0),
        r.last_liked_at
          ? new Date(r.last_liked_at).toISOString()
          : "",
      ].join(",")
    );

    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `insights_${
      range === "7d"
        ? "last7days"
        : range === "30d"
        ? "last30days"
        : "all"
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function safeCSV(value: string) {
    if (
      value.includes(",") ||
      value.includes('"') ||
      value.includes("\n")
    ) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  /* ---------- Render ---------- */

  return (
    <div className="space-y-8">
      <div className="bg-white text-black rounded-2xl shadow p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold">
              Insights
            </h1>
            <p className="text-sm text-gray-500">
              {loading
                ? "Laden…"
                : `${rows.length} vacatures met like-data`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={range}
              onChange={(e) =>
                setRange(e.target.value as RangeKey)
              }
              className="border rounded-lg px-2 py-1 text-sm"
            >
              <option value="all">Alles</option>
              <option value="7d">Laatste 7 dagen</option>
              <option value="30d">Laatste 30 dagen</option>
            </select>

            <button
              onClick={exportCSV}
              disabled={loading || rows.length === 0}
              className="border rounded-lg px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Exporteer CSV
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <p>Laden…</p>
        ) : err ? (
          <p className="text-red-600">{err}</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-gray-500">
            Geen resultaten voor deze periode.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#0d1b2a] text-white text-xs uppercase">
                <tr>
                  <th className="px-3 py-3 text-left">
                    Vacature
                  </th>
                  <th className="px-3 py-3 text-left">
                    Sponsor
                  </th>
                  <th className="px-3 py-3 text-left">
                    Likes
                  </th>
                  <th className="px-3 py-3 text-left">
                    Laatst geliked
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.job_id}
                    className="border-b last:border-b-0"
                  >
                    <td className="px-3 py-3">
                      {r.job_title || "—"}
                    </td>
                    <td className="px-3 py-3">
                      {r.sponsor_name || "—"}
                    </td>
                    <td className="px-3 py-3">
                      {r.like_count ?? 0}
                    </td>
                    <td className="px-3 py-3">
                      {r.last_liked_at
                        ? new Date(
                            r.last_liked_at
                          ).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
