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
      platform,
      tone,
      clubName,
    } = await req.json();

    const prompt = `
Je schrijft een social media post namens een sportvereniging.

De vereniging promoot een vacature van één van haar sponsoren.

Bedrijf:
${companyName}

Vacature:
${jobTitle}

Platform:
${platform}

Tone of voice:
${tone}

Belangrijke regels:
- Schrijf altijd vanuit de vereniging
- Schrijf nooit alsof het bedrijf zelf de afzender is
- Gebruik termen als:
  "onze sponsor"
  "één van onze sponsoren"
  "partner van onze vereniging"
- Noem het bedrijf minimaal één keer bij naam
- Sluit af met een duidelijke call-to-action
- Maximaal 150 woorden
- Nederlands

Voorbeeld van de schrijfstijl:

"Bij één van onze sponsoren zijn ze op zoek naar versterking!

Trofi Pack zoekt een Operator BOIX. Een mooie kans om aan de slag te gaan bij een innovatief bedrijf uit onze regio.

Ben jij of ken jij iemand die perfect past bij deze functie? Bekijk dan de vacature en solliciteer direct."
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