// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Leadinfo from "@/components/Leadinfo";

export const metadata: Metadata = {
  title: "Sponsorjobs Platform",
  description: "Verbind sportclubs, leden en sponsoren — powered by Sponsuls",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className="antialiased bg-white text-gray-900 flex flex-col min-h-screen">
        
        <main className="flex-1">
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