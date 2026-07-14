// src/app/layout.tsx

import "./globals.css";
import type { Metadata } from "next";

import LayoutWrapper from "@/components/LayoutWrapper";
import CookieBanner from "@/components/CookieBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Leadinfo from "@/components/Leadinfo";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import AppToaster from "@/components/ui/AppToaster";
import { ConfirmProvider } from "@/components/providers/confirm-provider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="nl" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className="antialiased flex flex-col min-h-screen overflow-x-hidden">

        <ConfirmProvider>

  <LayoutWrapper>
    {children}
  </LayoutWrapper>

</ConfirmProvider>

        <CookieBanner />
<GoogleAnalytics />
<Leadinfo />

<AppToaster />

      </body>
    </html>
  );
}