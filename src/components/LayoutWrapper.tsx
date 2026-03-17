"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // ❌ Geen navbar op admin
  const isAdmin = pathname.startsWith("/admin");

  // ❌ Geen navbar op clubpagina's (slug-based)
  const isClubPage =
    pathname.startsWith("/club") ||
    pathname.split("/").length === 2 && pathname !== "/";

  const hideNavbar = isAdmin || isClubPage;

  return (
    <>
      {!hideNavbar && <Navbar />}

      <main className={`flex-1 ${!hideNavbar ? "pt-24" : ""}`}>
        {children}
      </main>

      {!hideNavbar && <Footer />}
    </>
  );
}