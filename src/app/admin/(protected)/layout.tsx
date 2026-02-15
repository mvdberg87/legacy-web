// src/app/admin/(protected)/layout.tsx

import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0d1b2a] text-white">
      <AdminNavbar />

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-6">
          {children}
        </div>
      </main>
    </div>
  );
}
