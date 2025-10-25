import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legacy",
  description: "Legacy MVP",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
