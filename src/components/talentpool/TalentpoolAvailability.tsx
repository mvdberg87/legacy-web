type Props = {
  city: string;
  distance: number;
  availableFrom: string;
  notes: string;
  onChange: (field: string, value: string | number) => void;
};

export default function TalentpoolAvailability({
  city,
  distance,
  availableFrom,
  notes,
  onChange,
}: Props) {
  return (
    <div>

      <h3 className="text-xl font-semibold mb-2">
        Beschikbaarheid
      </h3>

      <p className="text-gray-600 mb-6">
        Laat ons weten waar en wanneer je beschikbaar bent.
      </p>

      <div className="space-y-5">

        <input
          type="text"
          placeholder="Woonplaats"
          value={city}
          onChange={(e) =>
            onChange("city", e.target.value)
          }
          className="w-full rounded-xl border p-3"
        />

        <div>

          <label className="block text-sm font-medium mb-2">
            Maximale reisafstand ({distance} km)
          </label>

          <input
            type="range"
            min={0}
            max={50}
            value={distance}
            onChange={(e) =>
              onChange("distance", Number(e.target.value))
            }
            className="w-full"
          />

        </div>

        <input
          type="date"
          value={availableFrom}
          onChange={(e) =>
            onChange("availableFrom", e.target.value)
          }
          className="w-full rounded-xl border p-3"
        />

        <textarea
          rows={4}
          placeholder="Extra toelichting (optioneel)"
          value={notes}
          onChange={(e) =>
            onChange("notes", e.target.value)
          }
          className="w-full rounded-xl border p-3"
        />

      </div>

    </div>
  );
}