type Props = {
  education: string;
  study: string;
  field: string;
  onChange: (field: string, value: string) => void;
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
          className="w-full rounded-xl border border-gray-300 p-3"
        />

        <input
          type="text"
          placeholder="Studie"
          value={study}
          onChange={(e) =>
            onChange("study", e.target.value)
          }
          className="w-full rounded-xl border border-gray-300 p-3"
        />

        <select
          value={field}
          onChange={(e) =>
            onChange("field", e.target.value)
          }
          className="w-full rounded-xl border border-gray-300 p-3"
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

      </div>

    </div>
  );
}