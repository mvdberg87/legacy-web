export const dynamic = "force-dynamic";

export default function ClubSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {children}
    </div>
  );
}