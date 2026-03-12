"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0d1b2a]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo/sponsorjobs-light.png"
            alt="SponsorJobs"
            width={160}
            height={40}
          />
        </Link>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center gap-10 text-lg font-semibold">

          <Link
            href="/verenigingen"
            className="text-white hover:opacity-80 transition"
          >
            VERENIGINGEN
          </Link>

          <Link
            href="/activatie"
            className="text-white hover:opacity-80 transition"
          >
            ACTIVATIE
          </Link>

          <Link
            href="/login"
            className="text-white hover:opacity-80 transition"
          >
            LOGIN
          </Link>

          <Link
            href="/signup"
            className="bg-[#1f9d55] text-white px-5 py-2 rounded-xl hover:bg-[#15803d] transition"
          >
            START GRATIS
          </Link>

        </nav>

        {/* Mobile buttons */}
        <div className="flex items-center gap-4 md:hidden">

          <Link
            href="/signup"
            className="bg-[#1f9d55] text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            START
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-2xl"
          >
            ☰
          </button>

        </div>

      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0d1b2a] border-t border-white/10 px-6 py-6 space-y-4 text-lg">

          <Link
            href="/verenigingen"
            className="block text-white"
            onClick={() => setMenuOpen(false)}
          >
            VERENIGINGEN
          </Link>

          <Link
            href="/activatie"
            className="block text-white"
            onClick={() => setMenuOpen(false)}
          >
            ACTIVATIE
          </Link>

          <Link
            href="/login"
            className="block text-white"
            onClick={() => setMenuOpen(false)}
          >
            LOGIN
          </Link>

        </div>
      )}
    </header>
  );
}