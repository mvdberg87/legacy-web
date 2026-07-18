import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const {
      companyName,
      jobTitle,
      applyUrl,
      platform,   
      clubName,
    } = await req.json();

    const prompt = `
Je schrijft een social media post namens de sportvereniging ${clubName}.

Schrijf alsof het officiële social media kanaal van ${clubName} de afzender is.

- Gebruik maximaal 2 passende emoji's.

De vereniging promoot een vacature van één van haar sponsoren.

Bedrijf:
${companyName}

Vacature:
${jobTitle}

Platform:
${platform}

Pas de opmaak en schrijfstijl aan op het gekozen platform. Voor LinkedIn mag de tekst iets zakelijker zijn, voor Facebook en Instagram iets toegankelijker en enthousiaster.

Schrijf in een professionele, enthousiaste en positieve schrijfstijl. De post moet uitnodigend zijn, goed leesbaar voor leden, supporters en sponsoren en geschikt zijn voor publicatie op social media.

Belangrijke regels:
- Schrijf altijd vanuit de vereniging
- Schrijf nooit alsof het bedrijf zelf de afzender is
- Gebruik termen als:
  "onze sponsor"
  "één van onze sponsoren"
  "partner van onze vereniging"
- Noem het bedrijf minimaal één keer bij naam
- Zorg voor variatie in de openingszin en gebruik niet steeds dezelfde opbouw.
- Maximaal 150 woorden
- Nederlands
- Sluit af met een concrete call-to-action waarin de lezer wordt gevraagd te solliciteren of de vacature te delen met iemand uit zijn of haar netwerk.
- Gebruik altijd onderstaande vacaturelink
- Plaats de link op een aparte laatste regel

Vacaturelink:
${applyUrl ?? "Geen vacaturelink beschikbaar"}
`;

    const response =
      await openai.chat.completions.create({
        model: "gpt-5-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    return NextResponse.json({
      text:
        response.choices[0].message.content,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "failed" },
      { status: 500 }
    );
  }
}