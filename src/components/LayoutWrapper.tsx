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

  const isAdmin = pathname.startsWith("/admin");

  const isClubPage =
    !pathname.startsWith("/admin") &&
    pathname.split("/").length === 2 &&
    pathname !== "/";

  const hideNavbar = isAdmin || isClubPage;

  return (
    <>
      {!hideNavbar && <Navbar />}

      <main className={`flex-1 w-full ${!hideNavbar ? "pt-24" : ""}`}>
        {children}
      </main>

      {!hideNavbar && <Footer />}
    </>
  );
}