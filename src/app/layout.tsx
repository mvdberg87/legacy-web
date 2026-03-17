// src/app/layout.tsx

import "./globals.css";
import type { Metadata } from "next";

import LayoutWrapper from "@/components/LayoutWrapper";
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

        <LayoutWrapper>
          {children}
        </LayoutWrapper>

        <CookieBanner />
        <GoogleAnalytics />
        <Leadinfo />

      </body>
    </html>
  );
}