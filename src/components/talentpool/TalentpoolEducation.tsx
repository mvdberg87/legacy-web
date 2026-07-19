type Props = {
  education: string;
  study: string;
  field: string;
  onChange: (field: string, value: string) => void;
  showErrors: boolean;
};

const fields = [
  "Techniek",
  "ICT",
  "Logistiek",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Bouw",
  "Tuinbouw",
  "Zorg",
  "Overig",
];

export default function TalentpoolEducation({
  education,
  study,
  field,
  onChange,
  showErrors,
}: Props) {
  return (
    <div>

      <h3 className="text-xl font-semibold mb-2">
        Opleiding
      </h3>

      <p className="text-gray-600 mb-6">
        Vertel iets over je opleiding.
      </p>

      <div className="space-y-4">

        <input
          type="text"
          placeholder="Opleidingsniveau (MBO, HBO, WO...)"
          value={education}
          onChange={(e) =>
            onChange("education", e.target.value)
          }
          className={`w-full rounded-xl border p-3 ${
  showErrors && !education.trim()
    ? "border-red-500"
    : "border-gray-300"
}`}
        />

        {showErrors && !education.trim() && (
  <p className="mt-1 text-sm text-red-600">
    ⚠️ Opleidingsniveau is verplicht.
  </p>
)}

        <input
          type="text"
          placeholder="Studie"
          value={study}
          onChange={(e) =>
            onChange("study", e.target.value)
          }
          className={`w-full rounded-xl border p-3 ${
  showErrors && !study.trim()
    ? "border-red-500"
    : "border-gray-300"
}`}
        />

        {showErrors && !study.trim() && (
  <p className="mt-1 text-sm text-red-600">
    ⚠️ Studie is verplicht.
  </p>
)}

        <select
          value={field}
          onChange={(e) =>
            onChange("field", e.target.value)
          }
          className={`w-full rounded-xl border p-3 ${
  showErrors && !field
    ? "border-red-500"
    : "border-gray-300"
}`}
        >
          <option value="">
            Kies een vakgebied
          </option>

          {fields.map((item) => (
  <option key={item} value={item}>
    {item}
  </option>
))}

        </select>

        {showErrors && !field && (
  <p className="mt-1 text-sm text-red-600">
    ⚠️ Kies een vakgebied.
  </p>
)}

      </div>

    </div>
  );
}