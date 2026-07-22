"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const supabase = getSupabaseBrowser();

type Club = {
  id: string;
  name: string;
  slug: string;
  primary_color?: string;
};

export default function ActivatiePage() {

  const [clubs, setClubs] = useState<Club[]>([]);

  type PackageKey = "partner" | "spotlight" | "premium";

type CampaignState = Record<
  string,
  {
    partner: number;
    spotlight: number;
    premium: number;
  }
>;

const [campaigns, setCampaigns] =
  useState<CampaignState>({});

const [companyName, setCompanyName] = useState("");
const [contactName, setContactName] = useState("");
const [companyEmail, setCompanyEmail] = useState("");
const [companyWebsite, setCompanyWebsite] = useState("");
const [vacancyUrl, setVacancyUrl] = useState("");
const [phoneNumber, setPhoneNumber] = useState("");
const [notes, setNotes] = useState("");

const [loading, setLoading] = useState(false);

useEffect(() => {
  fetchClubs();
}, []);

const fetchClubs = async () => {

  const { data, error } = await supabase
  .from("clubs")
  .select(
    "id, name, slug, primary_color, status, advertising_sales_enabled"
  )
  .eq("advertising_sales_enabled", true)
  .order("name");

  console.log("CLUBS", data);
console.log("ERROR", error);

  if (error) {
    console.error(error);
    return;
  }

  setClubs(data || []);

  console.log("CLUBS", data);
};

const packagePrices = {
  partner: 350,
  spotlight: 750,
  premium: 1250,
};

const totalPrice = useMemo(() => {
  return Object.values(campaigns).reduce(
    (total, campaign) => {
      return (
        total +
        campaign.partner * packagePrices.partner +
        campaign.spotlight * packagePrices.spotlight +
        campaign.premium * packagePrices.premium
      );
    },
    0
  );
}, [campaigns]);

const totalAdvertisements = useMemo(() => {
  return Object.values(campaigns).reduce(
    (total, campaign) =>
      total +
      campaign.partner +
      campaign.spotlight +
      campaign.premium,
    0
  );
}, [campaigns]);

const updateCampaign = (
  clubId: string,
  packageKey: PackageKey,
  change: number
) => {
  setCampaigns((prev) => {
    const current = prev[clubId] ?? {
      partner: 0,
      spotlight: 0,
      premium: 0,
    };

    const next = Math.max(
      0,
      current[packageKey] + change
    );

    return {
      ...prev,
      [clubId]: {
        ...current,
        [packageKey]: next,
      },
    };
  });
};

const startCheckout = async () => {

    if (
  totalAdvertisements === 0 ||
    !companyName ||
    !contactName ||
    !companyEmail ||
    !companyWebsite ||
    !vacancyUrl
  ) {
    toast.error("Vul alle verplichte velden in.");
    return;
  }

  try {

    setLoading(true);

    const res = await fetch(
      "/api/stripe/company-checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  campaigns: Object.entries(campaigns)
    .flatMap(([clubId, values]) => [
      ...(values.partner > 0
        ? [{
            clubId,
            packageKey: "partner",
            quantity: values.partner,
          }]
        : []),

      ...(values.spotlight > 0
        ? [{
            clubId,
            packageKey: "spotlight",
            quantity: values.spotlight,
          }]
        : []),

      ...(values.premium > 0
        ? [{
            clubId,
            packageKey: "premium",
            quantity: values.premium,
          }]
        : []),
    ]),

  companyName,
  contactName,
  companyEmail,
  companyWebsite,
  vacancyUrl,
  phoneNumber,
  notes,
}),
      }
    );

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    toast.error("Checkout kon niet worden gestart.");

  } catch (err) {

    console.error(err);

    toast.error("Er ging iets mis.");

  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-[#0d1b2a] text-white">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-24 text-center">

        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Vind personeel via de kracht van sportverenigingen.
        </h1>

        <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto">
          Maak jouw vacatures zichtbaar binnen het netwerk van lokale sportclubs en bereik actief werkzoekenden via community, social media en recruitment activatie.
        </p>

        <p className="mt-4 text-white/70 max-w-2xl mx-auto">
          Met de activatiepakketten van Sponsorjobs helpen we
          sportverenigingen om vacatures van sponsoren te promoten
          via social media, content en recruitmentcampagnes.
        </p>

      </section>


      {/* PROBLEEM / OPLOSSING */}
      <section className="bg-white text-black py-20">

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">

          <div>
            <h2 className="text-2xl font-bold">
              Veel vacatures van sponsoren blijven onzichtbaar.
            </h2>

            <p className="mt-4 opacity-70">
              Sponsors hebben vacatures, maar deze bereiken vaak
              niet het netwerk van de club. Daardoor blijft een
              belangrijk onderdeel van sponsoractivatie onbenut.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#0d1b2a]">
              Activatie maakt sponsoring meetbaar.
            </h2>

            <p className="mt-4 opacity-70">
              Door vacatures actief te promoten via social media,
              content en campagnes ontstaat extra zichtbaarheid
              voor sponsoren én een waardevolle recruitmentkans
              binnen de clubcommunity.
            </p>
          </div>

        </div>

      </section>


      {/* HOE HET WERKT */}
      <section className="py-24">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold">
            Hoe werkt sponsoractivatie?
          </h2>

          <div className="mt-16 grid md:grid-cols-4 gap-10">

            <div>
              <div className="text-4xl font-bold text-[#1f9d55]">01</div>
              <h3 className="mt-4 font-semibold text-lg">
                Vacature van sponsor
              </h3>
              <p className="mt-2 opacity-80 text-sm">
                De sponsor levert een vacature aan
                die binnen het clubnetwerk zichtbaar wordt.
              </p>
            </div>

            <div>
              <div className="text-4xl font-bold text-[#1f9d55]">02</div>
              <h3 className="mt-4 font-semibold text-lg">
                Content en promotie
              </h3>
              <p className="mt-2 opacity-80 text-sm">
                Vacatures worden gepromoot via social media,
                visuals en campagnes.
              </p>
            </div>

            <div>
              <div className="text-4xl font-bold text-[#1f9d55]">03</div>
              <h3 className="mt-4 font-semibold text-lg">
                Bereik binnen community
              </h3>
              <p className="mt-2 opacity-80 text-sm">
                Clubleden, supporters en netwerkpartners
                zien de vacatures via clubkanalen.
              </p>
            </div>

            <div>
              <div className="text-4xl font-bold text-[#1f9d55]">04</div>
              <h3 className="mt-4 font-semibold text-lg">
                Extra sponsorwaarde
              </h3>
              <p className="mt-2 opacity-80 text-sm">
                Sponsoring wordt meetbaar en
                recruitment wordt onderdeel van de activatie.
              </p>
            </div>

          </div>

        </div>

      </section>

      <section className="py-24 bg-[#10263a]">
  <div className="max-w-6xl mx-auto px-6">

    <h2 className="text-3xl font-bold text-center">
      Stel jouw recruitmentcampagne samen
    </h2>

    <div className="mt-12 space-y-6">

      {clubs.map((club) => {

        const campaign =
          campaigns[club.id] ?? {
            partner: 0,
            spotlight: 0,
            premium: 0,
          };

        return (

          <div
            key={club.id}
            className="rounded-2xl bg-white/5 border border-white/10 p-6"
          >

            <h3 className="text-2xl font-semibold">
              {club.name}
            </h3>

            <div className="mt-6 space-y-4">

              {(
                [
                  ["partner","Partner",350],
                  ["spotlight","Spotlight",750],
                  ["premium","Premium",1250],
                ] as const
              ).map(([key,label,price]) => (

                <div
                  key={key}
                  className="flex items-center justify-between"
                >

                  <div>
                    <p className="font-semibold">
                      {label}
                    </p>

                    <p className="text-white/60 text-sm">
                      €{price}
                    </p>

                  </div>

                  <div className="flex items-center gap-3">

                    <Button
                      variant="outline"
                      onClick={() =>
                        updateCampaign(
                          club.id,
                          key,
                          -1
                        )
                      }
                    >
                      −
                    </Button>

                    <span className="w-8 text-center">
                      {campaign[key]}
                    </span>

                    <Button
                      onClick={() =>
                        updateCampaign(
                          club.id,
                          key,
                          1
                        )
                      }
                    >
                      +
                    </Button>

                  </div>

                </div>

              ))}

            </div>

          </div>

        );

      })}

    </div>

    <div className="mt-12 text-center">

      <p className="text-white/60">
        {totalAdvertisements} advertenties geselecteerd
      </p>

      <h2 className="text-5xl font-bold mt-2">
        €{totalPrice}
      </h2>

      <p className="text-white/60">
        excl. btw
      </p>

    </div>

  </div>
</section>

{/* CLUB SELECTIE */}

<div className="mt-16 max-w-3xl mx-auto bg-white text-black rounded-2xl p-8">

  <h3 className="text-2xl font-bold">
    Bedrijfsgegevens
  </h3>

  <div className="grid md:grid-cols-2 gap-4 mt-6">

    <Input
  value={companyName}
  onChange={(e) => setCompanyName(e.target.value)}
  placeholder="Bedrijfsnaam *"
/>

    <Input
  value={contactName}
  onChange={(e) => setContactName(e.target.value)}
  placeholder="Contactpersoon *"
/>

    <Input
  type="email"
  value={companyEmail}
  onChange={(e) => setCompanyEmail(e.target.value)}
  placeholder="E-mailadres *"
/>

    <Input
  value={phoneNumber}
  onChange={(e) => setPhoneNumber(e.target.value)}
  placeholder="Telefoonnummer"
/>

    <Input
  type="url"
  value={companyWebsite}
  onChange={(e) => setCompanyWebsite(e.target.value)}
  placeholder="Website *"
/>

    <Input
  type="url"
  value={vacancyUrl}
  onChange={(e) => setVacancyUrl(e.target.value)}
  placeholder="Vacature URL *"
/>

  </div>

  <Textarea
  value={notes}
  onChange={(e) => setNotes(e.target.value)}
  placeholder="Extra toelichting"
  rows={4}
  className="mt-4"
/>

</div>

<div className="mt-16 mb-28 text-center">

  <Button
  onClick={startCheckout}
  disabled={
    loading ||
    totalAdvertisements === 0
  }
  className="mt-4 px-10 py-6 rounded-2xl bg-[#1f9d55] hover:bg-[#15803d] text-white text-lg font-semibold"
>
  {loading
    ? "Bezig..."
    : "Start recruitmentcampagne"}
</Button>

</div>

      {/* ACTIVATIEGESPREK */}
<section className="py-24 bg-white text-black">

  <div className="max-w-5xl mx-auto px-6 text-center">

    <h2 className="text-4xl font-bold">
      Benieuwd wat sponsoring voor jouw recruitment kan betekenen?
    </h2>

    <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
      De meeste bedrijven benutten hun sponsoring vooral voor zichtbaarheid.
      Met Sponsorjobs zetten we sponsoring ook in als recruitmentkanaal.
      Tijdens een vrijblijvend activatiegesprek laten we zien hoe je lokaal
      talent bereikt via sportverenigingen, welke activaties het beste passen
      bij jouw organisatie en hoe je meer rendement haalt uit je
      sponsorinvestering.
    </p>

    <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">

      <div className="rounded-2xl border p-6">
        <h3 className="font-semibold text-lg">
          🎯 Bereik lokaal talent
        </h3>

        <p className="mt-3 text-gray-600 text-sm">
          Ontdek welke verenigingen het beste aansluiten bij jouw doelgroep.
        </p>
      </div>

      <div className="rounded-2xl border p-6">
        <h3 className="font-semibold text-lg">
          📈 Meer rendement
        </h3>

        <p className="mt-3 text-gray-600 text-sm">
          Maak van je sponsorbijdrage een krachtig recruitmentkanaal.
        </p>
      </div>

      <div className="rounded-2xl border p-6">
        <h3 className="font-semibold text-lg">
          🤝 Activatie op maat
        </h3>

        <p className="mt-3 text-gray-600 text-sm">
          Samen bepalen we de beste activatie voor jouw vacatures.
        </p>
      </div>

      <div className="rounded-2xl border p-6">
        <h3 className="font-semibold text-lg">
          📊 Inzicht & advies
        </h3>

        <p className="mt-3 text-gray-600 text-sm">
          Je krijgt direct inzicht in de mogelijkheden, het bereik en de investering.
        </p>
      </div>

    </div>

    <div className="mt-14">

      <Link
        href="/bedrijven/activatiegesprek"
        className="inline-flex bg-[#1f9d55] text-white px-10 py-4 rounded-2xl font-semibold hover:bg-[#15803d] transition"
      >
        Plan een vrijblijvend activatiegesprek
      </Link>

    </div>

  </div>

</section>

    </main>
  );
}
