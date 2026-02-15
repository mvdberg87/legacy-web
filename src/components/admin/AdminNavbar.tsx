"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import getSupabaseBrowser from "@/lib/supabaseBrowser";

export default function AdminNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = getSupabaseBrowser();

  const [menuOpen, setMenuOpen] = useState(false);

  const primary = "#0d1b2a"; // Sponsorjobs navy

  /* ===============================
     Navigatie
     =============================== */
  const links = [
  { label: "📋 Clubs", path: "/admin" },
  { label: "🧾 Abonnementen", path: "/admin/subscriptions" },
  { label: "👥 Profielen", path: "/admin/profiles" },
  { label: "🔐 Upgrades", path: "/admin/upgrades" },
];

  /* ===============================
     Helpers
     =============================== */
  function isActive(path: string) {
    return pathname === path || pathname.startsWith(`${path}/`);
  }

  function navigate(path: string) {
    setMenuOpen(false);
    router.push(path);
  }

  /* ===============================
     Logout (admin-only)
     =============================== */
  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } finally {
      // 🔒 admin altijd naar admin login
      router.replace("/admin/login");
    }
  }

  /* ===============================
     Render
     =============================== */
  return (
    <header
      className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md shadow-sm"
      style={{ borderColor: primary }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* 🔹 Logo + titel */}
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div
            className="h-8 w-8 rounded-md flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: primary }}
          >
            S
          </div>
          <span
            className="font-semibold text-base tracking-tight"
            style={{ color: primary }}
          >
            <Sponsorjobs></Sponsorjobs> Admin
          </span>
        </button>

        {/* 🔹 Desktop navigatie */}
        <nav className="hidden md:flex items-center gap-2">
          {links.map((link) => {
            const active = isActive(link.path);

            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`px-4 py-2 text-sm rounded-full border font-medium transition-all duration-200 ${
                  active
                    ? "bg-blue-600 text-white border-blue-600"
                    : "hover:bg-blue-50 border-gray-300 text-gray-700"
                }`}
              >
                {link.label}
              </button>
            );
          })}

          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm rounded-full border font-medium text-red-600 hover:bg-red-50 border-red-300 transition-all"
          >
            🚪 Uitloggen
          </button>
        </nav>

        {/* 🔹 Mobile menu button */}
        <button
          aria-label="Menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden p-2 border rounded-lg transition-colors"
          style={{ borderColor: primary }}
        >
          {menuOpen ? (
            <X size={20} color={primary} />
          ) : (
            <Menu size={20} color={primary} />
          )}
        </button>
      </div>

      {/* 🔸 Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t flex flex-col px-4 py-3 space-y-2 shadow-lg bg-white"
            style={{ borderColor: primary }}
          >
            {links.map((link) => {
              const active = isActive(link.path);

              return (
                <motion.button
                  key={link.path}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(link.path)}
                  className={`w-full text-left px-4 py-2 rounded-lg border font-medium transition ${
                    active
                      ? "bg-blue-600 text-white border-blue-600"
                      : "hover:bg-blue-50 border-gray-300 text-gray-700"
                  }`}
                >
                  {link.label}
                </motion.button>
              );
            })}

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 rounded-lg border font-medium hover:bg-red-50 border-red-300 text-red-600"
            >
              🚪 Uitloggen
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
