type Props = {
  acceptedPrivacy: boolean;
  acceptedTerms: boolean;
  onTogglePrivacy: () => void;
  onToggleTerms: () => void;
  clubName: string;
};

export default function TalentpoolPrivacy({
  acceptedPrivacy,
  acceptedTerms,
  onTogglePrivacy,
  onToggleTerms,
  clubName,
}: Props) {
  return (
    <div>

      <h3 className="text-xl font-semibold mb-2">
        Privacy & voorwaarden
      </h3>

      <p className="text-gray-600 mb-6">
        Voordat je je aanmelding verstuurt, vragen we je akkoord te gaan met onze
        privacyverklaring en gebruikersvoorwaarden.
      </p>

      <div className="space-y-5">

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={acceptedPrivacy}
            onChange={onTogglePrivacy}
            className="mt-1"
          />

          <span className="text-sm">
            Ik ga akkoord met de{" "}
            <a
              href="#"
              className="font-semibold underline"
            >
              privacyverklaring
            </a>.
          </span>
        </label>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={onToggleTerms}
            className="mt-1"
          />

          <span className="text-sm">
            Ik ga akkoord met de{" "}
            <a
              href="#"
              className="font-semibold underline"
            >
              gebruikersvoorwaarden
            </a>.
          </span>
        </label>

      </div>

      <div className="mt-8 rounded-xl bg-gray-100 p-4 text-sm text-gray-700">
        Door je aan te melden geef je toestemming aan <strong>{clubName}</strong> om
        jouw gegevens uitsluitend te gebruiken voor het leggen van contact met
        aangesloten sponsoren. Je profiel wordt niet openbaar gepubliceerd.
      </div>

    </div>
  );
}