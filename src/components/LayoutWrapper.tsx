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

  const showNavbar =
    pathname === "/" ||
    pathname.startsWith("/verenigingen") ||
    pathname.startsWith("/activatie") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");

  return (
    <>
      {showNavbar && <Navbar />}

      <main className={`flex-1 w-full ${showNavbar ? "pt-24" : ""}`}>
        {children}
      </main>

      {showNavbar && <Footer />}
    </>
  );
}