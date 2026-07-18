type Props = {
  clubName: string;
};

export default function TalentpoolIntro({
  clubName,
}: Props) {
  return (
    <>
      <h3 className="text-xl font-semibold mb-4">
        Welkom!
      </h3>

      <p className="text-gray-600 leading-7">
        Ben je op zoek naar een bijbaan, stage,
        BBL-plek of een nieuwe uitdaging?

        <br /><br />

        Meld je aan voor de Talentpool van
        <strong> {clubName}</strong>.

        <br /><br />

        <strong>Je profiel is niet openbaar zichtbaar.</strong>

        <br /><br />

        Alleen de sponsorcommissie heeft toegang
        tot jouw gegevens en neemt contact met je
        op zodra er een passende mogelijkheid
        ontstaat.

        <br /><br />

        Aan deze aanmelding kunnen geen rechten
        worden ontleend.
      </p>
    </>
  );
}