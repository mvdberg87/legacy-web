import sharp from "sharp";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(
  req: Request
) {

  const {
    companyName,
    jobTitle,
  } = await req.json();

  try {

    const templatePath =
      path.join(
        process.cwd(),
        "public",
        "templates",
        "linkedin.png"
      );

    const svg = `
<svg width="1200" height="1200">

  <text
    x="600"
    y="500"
    text-anchor="middle"
    font-size="60"
    font-weight="bold"
    fill="#ffffff"
  >
    VACATURE
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