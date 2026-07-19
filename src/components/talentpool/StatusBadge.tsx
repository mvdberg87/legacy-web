interface Props {
  status: string;
}

const colors: Record<string, string> = {
  Nieuw: "bg-gray-100 text-gray-700",

  "In behandeling":
    "bg-yellow-100 text-yellow-800",

  "Voorgesteld aan sponsor":
    "bg-blue-100 text-blue-800",

  "Gesprek gepland":
    "bg-purple-100 text-purple-800",

  Geplaatst:
    "bg-green-100 text-green-800",

  Afgewezen:
    "bg-red-100 text-red-800",
};

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${
        colors[status] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}