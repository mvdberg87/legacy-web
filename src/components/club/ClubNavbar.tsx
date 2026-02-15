"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function ClubNavbar({ slug }: { slug: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = getSupabaseBrowser();

  const [clubName, setClubName] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const PRIMARY = "#0d1b2a"; // Sponsorjobs Navy
  const BORDER = "#ffffff"; // Wit

  const links = [
    { label: "Dashboard", path: `/club/${slug}/dashboard` },
    { label: "Vacatures", path: `/club/${slug}/jobs` },
    { label: "Club bewerken", path: `/club/${slug}/edit` },
    { label: "Publieke pagina", path: `/club/${slug}/jobs/public` },
  ];

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("clubs")
        .select("name, logo_url")
        .eq("slug", slug)
        .maybeSingle();

      if (data) {
        setClubName(data.name);
        setLogoUrl(data.logo_url);
      }
    })();
  }, [slug, supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  function navigate(path: string) {
    router.push(path);
    setMenuOpen(false);
  }

  return (
    <header
      className="sticky top-0 z-50 border-b-4"
      style={{
        backgroundColor: PRIMARY,
        borderColor: BORDER,
      }}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo + clubnaam */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate(`/club/${slug}/dashboard`)}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={clubName ?? "Club logo"}
              className="h-9 w-9 object-contain rounded-md border-2"
              style={{ borderColor: BORDER }}
            />
          ) : (
            <div
              className="h-9 w-9 rounded-md border-2 flex items-center justify-center text-xs font-semibold text-white"
              style={{ borderColor: BORDER }}
            >
              LOGO
            </div>
          )}
          <span className="text-white font-semibold text-sm sm:text-base">
            {clubName ?? "Club"}
          </span>
        </div>

        {/* Desktop navigatie */}
        <nav className="hidden md:flex items-center gap-3">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.path);

            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`
                  px-5 py-2 rounded-full border-2 text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-white text-[#0d1b2a]"
                      : "text-white hover:bg-white hover:text-[#0d1b2a]"
                  }
                `}
                style={{ borderColor: BORDER }}
              >
                {link.label}
              </button>
            );
          })}

          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-full border-2 text-sm font-medium text-red-500 hover:bg-white hover:text-red-600 transition"
            style={{ borderColor: BORDER }}
          >
            Uitloggen
          </button>
        </nav>

        {/* Mobiel menu knop */}
        <button
          className="md:hidden p-2 border-2 rounded-lg"
          style={{ borderColor: BORDER }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <X size={20} color="white" />
          ) : (
            <Menu size={20} color="white" />
          )}
        </button>
      </div>

      {/* Mobiel menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden px-4 pb-4 space-y-2 border-t-4"
            style={{
              backgroundColor: PRIMARY,
              borderColor: BORDER,
            }}
          >
            {links.map((link) => {
              const isActive = pathname.startsWith(link.path);

              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`
                    w-full text-left px-4 py-2 rounded-lg border-2 text-sm transition
                    ${
                      isActive
                        ? "bg-white text-[#0d1b2a]"
                        : "text-white hover:bg-white hover:text-[#0d1b2a]"
                    }
                  `}
                  style={{ borderColor: BORDER }}
                >
                  {link.label}
                </button>
              );
            })}

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 rounded-lg border-2 text-sm text-red-500 hover:bg-white hover:text-red-600 transition"
              style={{ borderColor: BORDER }}
            >
              Uitloggen
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
