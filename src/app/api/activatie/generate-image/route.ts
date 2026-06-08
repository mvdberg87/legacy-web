import sharp from "sharp";
import { NextResponse } from "next/server";
import path from "path";

export async function POST() {
  try {

    const templatePath =
      path.join(
        process.cwd(),
        "public",
        "templates",
        "linkedin.png"
      );

    const image =
  await sharp(templatePath)
    .png()
    .toBuffer();

const uint8 =
  Uint8Array.from(image);

return new Response(
  uint8,
  {
    headers: {
      "Content-Type":
        "image/png",
    },
  }
);

  } catch (err) {

    console.error(err);

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