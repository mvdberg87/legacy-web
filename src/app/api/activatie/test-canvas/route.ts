import { createCanvas, registerFont } from "canvas";
import path from "path";

export async function GET() {

  registerFont(
    path.join(
      process.cwd(),
      "public",
      "fonts",
      "Montserrat-ExtraBold.ttf"
    ),
    {
      family: "Montserrat",
    }
  );

  const canvas =
    createCanvas(
      1200,
      1200
    );

  const ctx =
    canvas.getContext("2d");

  ctx.fillStyle =
    "#0d1b2a";

  ctx.fillRect(
    0,
    0,
    1200,
    1200
  );

  ctx.fillStyle =
    "#ffffff";

  ctx.font =
    "80px Montserrat";

  ctx.fillText(
    "TEST VACATURE",
    100,
    200
  );

  const buffer =
    canvas.toBuffer(
      "image/png"
    );

  return new Response(
    Uint8Array.from(buffer),
    {
      headers: {
        "Content-Type":
          "image/png",
      },
    }
  );
}