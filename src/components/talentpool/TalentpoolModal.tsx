"use client";

type Club = {
  name: string;
  primary_color?: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  club: Club;
};

export default function TalentpoolModal({
  open,
  onClose,
  club,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* Header */}
        <div
          className="p-8 text-white"
          style={{
            backgroundColor: club.primary_color ?? "#1d4ed8",
          }}
        >
          <h2 className="text-3xl font-bold">
            Talentpool
          </h2>

          <p className="mt-2 opacity-90">
            Laat jouw talent zien aan de sponsoren van {club.name}.
          </p>
        </div>

        {/* Content */}
        <div className="p-8">

          <h3 className="text-xl font-semibold mb-4">
            Welkom!
          </h3>

          <p className="text-gray-600 leading-7">
            Ben je op zoek naar een bijbaan, stage,
            BBL-plek of een nieuwe uitdaging?

            <br /><br />

            Meld je aan voor de Talentpool van
            <strong> {club.name}</strong>.

            <br /><br />

            Je profiel is <strong>niet openbaar zichtbaar</strong>.

            Alleen de sponsorcommissie kan jouw gegevens
            bekijken en neemt contact met je op zodra
            er een passende mogelijkheid ontstaat.

            <br /><br />

            Aan deze aanmelding kunnen geen rechten
            worden ontleend.
          </p>

          <div className="mt-8 flex justify-end gap-3">

            <button
              onClick={onClose}
              className="rounded-xl border px-5 py-3"
            >
              Annuleren
            </button>

            <button
              className="rounded-xl px-6 py-3 font-semibold text-white"
              style={{
                backgroundColor:
                  club.primary_color ?? "#1d4ed8",
              }}
            >
              Start aanmelding →
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}