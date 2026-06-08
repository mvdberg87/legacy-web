import sharp from "sharp";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(
  req: Request
) {
  try {

    const {
      companyName,
      jobTitle,
    } = await req.json();

    const templatePath =
      path.join(
        process.cwd(),
        "public",
        "templates",
        "linkedin.png"
      );

    const svg = `
<svg
  width="1200"
  height="1200"
  xmlns="http://www.w3.org/2000/svg"
>

  <rect
    x="40"
    y="300"
    width="1120"
    height="450"
    fill="#00000088"
  />

  <text
    x="600"
    y="450"
    text-anchor="middle"
    font-size="60"
    fill="white"
    font-family="sans-serif"
  >
    TEST VACATURE
  </text>

  <text
    x="600"
    y="550"
    text-anchor="middle"
    font-size="42"
    fill="white"
    font-family="sans-serif"
  >
    TROFI PACK
  </text>

</svg>
`;

    const image =
  await sharp(templatePath)

    .composite([
      {
        input: Buffer.from(svg),
        top: 0,
        left: 0,
      },
    ])

    .png()

    .toBuffer();

    return new Response(
      Uint8Array.from(image),
      {
        headers: {
          "Content-Type":
            "image/png",
        },
      }
    );

  } catch (err) {

    return NextResponse.json(
      {
        error:
          "Image generation failed",
      },
      {
        status: 500,
      }
    );
  }
}