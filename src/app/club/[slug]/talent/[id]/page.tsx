"use client";

import ClubNavbar from "@/components/club/ClubNavbar";
import ClubSupportBar from "@/components/ClubSupportBar";
import { useParams } from "next/navigation";

export default function TalentDetailPage() {
  const { slug, id } = useParams<{
    slug: string;
    id: string;
  }>();

  return (
    <main className="min-h-screen p-6 bg-[#0d1b2a]">
      <ClubNavbar slug={slug} />

      <div className="max-w-4xl mx-auto bg-white border-2 rounded-2xl p-6 shadow mt-6">

        <h1 className="text-2xl font-semibold">
          Talentprofiel
        </h1>

        <p className="text-gray-500 mt-2">
          Talent ID: {id}
        </p>

      </div>

      <ClubSupportBar />
    </main>
  );
}