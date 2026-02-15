// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sponsorjobs Platform",
  description: "Verbind sportclubs, leden en sponsoren — powered by Sponsuls",
};

export const dynamic = "force-dynamic"; // voorkomt SSR-cache & hydration issues

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className="antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
