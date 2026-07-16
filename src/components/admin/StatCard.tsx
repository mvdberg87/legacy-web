type Props = {
  label: string;
  value: React.ReactNode;
};

export default function StatCard({
  label,
  value,
}: Props) {
  return (
    <div className="border-2 border-slate-900 rounded-2xl p-4 text-center min-h-[140px]">
      <div className="text-3xl font-semibold">
        {value}
      </div>

      <div className="mt-2 text-xs uppercase tracking-wide text-gray-500 break-words">
        {label}
      </div>
    </div>
  );
}