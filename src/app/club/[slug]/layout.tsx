export const dynamic = "force-dynamic";

import ClubSupportFooter from "@/components/ClubSupportFooter";

export default function ClubSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <div className="flex-1">
        {children}
      </div>

      <ClubSupportFooter />
    </div>
  );
}