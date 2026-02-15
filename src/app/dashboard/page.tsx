// src/app/dashboard/page.tsx
import { getSupabaseServer } from "@/lib/supabase.server";
import Link from "next/link";

type Club = {
  id: string;
  name: string | null;
  slug: string;
  ad_package: "basic" | "plus" | "pro" | "unlimited";
};

type ClubStats = {
  id: string;
  name: string;
  slug: string;
  ad_package: Club["ad_package"];
  job_count: number;
  total_likes: number;
  total_clicks: number;
};

export const dynamic = "force-dynamic";

export default async function SuperadminDashboard() {
  const supabase = await getSupabaseServer();

  /* ===============================
     1️⃣ Clubs ophalen
     =============================== */
  
     const { data: clubs, error: clubError } = await supabase
    .from("clubs")
    .select("id, name, slug, ad_package")
    .order("name", { ascending: true });

  if (clubError) {
    console.error("Fout bij ophalen clubs:", clubError);
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a1e3f] to-[#122b57]">
        <div className="bg-white border-2 p-6 rounded-xl shadow text-center text-red-600">
          <p>Fout bij ophalen clubs: {clubError.message}</p>
        </div>
      </main>
    );
  }

  if (!clubs || clubs.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a1e3f] to-[#122b57]">
        <div className="bg-white border-2 p-6 rounded-xl shadow text-center">
          <p className="text-sm opacity-70">
            Nog geen clubs gevonden.
          </p>
        </div>
      </main>
    );
  }

  /* ===============================
     2️⃣ Statistieken ophalen
     =============================== */
  const clubStats: ClubStats[] = [];

  for (const club of clubs as Club[]) {
    const [jobsRes, likesRes, clicksRes] = await Promise.all([
      supabase
        .from("jobs")
        .select("id", { count: "exact", head: true })
        .eq("club_id", club.id),
      supabase
        .from("job_like_counts")
        .select("id", { count: "exact", head: true })
        .eq("club_id", club.id),
      supabase
        .from("job_clicks")
        .select("id", { count: "exact", head: true })
        .eq("club_id", club.id),
    ]);

    clubStats.push({
      id: club.id,
      name: club.name ?? "Onbekende club",
      slug: club.slug,
      ad_package: club.ad_package,
      job_count: jobsRes.count ?? 0,
      total_likes: likesRes.count ?? 0,
      total_clicks: clicksRes.count ?? 0,
    });
  }

  /* ===============================
     3️⃣ UI
     =============================== */
  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-[#0a1e3f] to-[#122b57]">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Sponsorjobs Superadmin Dashboard
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse bg-white border-2 shadow-md rounded-xl overflow-hidden">
          <thead className="bg-[#0a1e3f] text-white">
            <tr>
              <th className="py-3 px-4 text-left">
                Club
              </th>
              <th className="py-3 px-4 text-center">
                Pakket
              </th>
              <th className="py-3 px-4 text-center">
                Vacatures
              </th>
              <th className="py-3 px-4 text-center">
                Likes
              </th>
              <th className="py-3 px-4 text-center">
                Clicks
              </th>
              <th className="py-3 px-4 text-center">
                Dashboard
              </th>
            </tr>
          </thead>

          <tbody>
            {clubStats.map((club) => (
              <tr
                key={club.id}
                className="border-b hover:bg-blue-50 transition"
              >
                <td className="py-3 px-4 font-medium">
                  {club.name}
                </td>

                <td className="py-3 px-4 text-center font-semibold uppercase">
                  {club.ad_package}
                </td>

                <td className="py-3 px-4 text-center">
                  {club.job_count}
                </td>

                <td className="py-3 px-4 text-center font-semibold text-pink-600">
                  {club.total_likes}
                </td>

                <td className="py-3 px-4 text-center font-semibold text-blue-600">
                  {club.total_clicks}
                </td>

                <td className="py-3 px-4 text-center">
                  <Link
                    href={`/club/${club.slug}/dashboard`}
                    className="inline-block px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
                  >
                    Bekijk
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="text-sm text-white/70 mt-6">
        Sponsorjobs – samen sterker in sponsoring
      </footer>
    </main>
  );
}
