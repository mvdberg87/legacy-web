// src/app/admin/(protected)/layout.tsx

import AdminNavbar from "@/components/admin/AdminNavbar";
import localFont from "next/font/local";

const adminFont = localFont({
  src: [
    {
      path: "../../../fonts/Arena.woff",
      weight: "400",
      style: "normal",
    },
  ],
  display: "swap",
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${adminFont.className} min-h-screen bg-[#0d1b2a] text-white`}>
      <AdminNavbar />

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-6">
          {children}
        </div>
      </main>
    </div>
  );
}