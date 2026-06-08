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
    } = await req.json();

    const prompt = `
Schrijf een ${platform} post voor een vacature.

Bedrijf:
${companyName}

Vacature:
${jobTitle}

Tone of voice:
${tone}

Eisen:
- maximaal 150 woorden
- enthousiasmerend
- call-to-action
- Nederlands
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