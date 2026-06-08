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
    x="100"
    y="350"
    width="1000"
    height="400"
    fill="rgba(0,0,0,0.7)"
  />

  <text
    x="600"
    y="460"
    text-anchor="middle"
    font-size="60"
    font-family="Arial"
    font-weight="bold"
    fill="white"
  >
    VACATURE
  </text>

  <text
    x="600"
    y="560"
    text-anchor="middle"
    font-size="50"
    font-family="Arial"
    font-weight="bold"
    fill="white"
  >
    ${jobTitle ?? ""}
  </text>

  <text
    x="600"
    y="650"
    text-anchor="middle"
    font-size="36"
    font-family="Arial"
    fill="white"
  >
    ${companyName ?? ""}
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