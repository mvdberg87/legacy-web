// src/app/layout.tsx

import "./globals.css";
import type { Metadata } from "next";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Leadinfo from "@/components/Leadinfo";

export const metadata: Metadata = {
  title: "Sponsorjobs Platform",
  description: "Verbind sportclubs, leden en sponsoren — powered by Sponsuls",
  icons: {
    icon: "/logo/sponsorjobs-icon.png",
  },
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className="antialiased flex flex-col min-h-screen">

        <Navbar />

        <main className="flex-1 pt-24">
          {children}
        </main>

        <Footer />

        <CookieBanner />

        <GoogleAnalytics />

        <Leadinfo />

      </body>
    </html>
  );
}