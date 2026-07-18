const options = [
  { id: "bijbaan", label: "💼 Bijbaan" },
  { id: "stage", label: "🎓 Stage" },
  { id: "bbl", label: "🛠 BBL" },
  { id: "parttime", label: "🕒 Parttime" },
  { id: "fulltime", label: "🚀 Fulltime" },
  { id: "vakantiewerk", label: "☀️ Vakantiewerk" },
];

type Props = {
  selected: string[];
  onToggle: (value: string) => void;
  primaryColor?: string | null;
};

export default function TalentpoolPreferences({
  selected,
  onToggle,
  primaryColor,
}: Props) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">
        Waar ben je naar op zoek?
      </h3>

      <p className="text-gray-600 mb-6">
        Je kunt meerdere opties selecteren.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {options.map((option) => {
          const active = selected.includes(option.id);

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onToggle(option.id)}
              className="rounded-2xl border p-5 transition font-medium"
              style={{
                backgroundColor: active
                  ? primaryColor ?? "#2563eb"
                  : "#ffffff",
                color: active ? "#ffffff" : "#111827",
                borderColor: active
                  ? primaryColor ?? "#2563eb"
                  : "#d1d5db",
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}