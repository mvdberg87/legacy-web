import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";

export async function POST(
  req: Request
) {
  try {

    const {
      companyName,
      jobTitle,
    } = await req.json();

    registerFont(
      path.join(
        process.cwd(),
        "public",
        "fonts",
        "Montserrat-ExtraBold.ttf"
      ),
      {
        family: "MontserratBold",
      }
    );

    registerFont(
      path.join(
        process.cwd(),
        "public",
        "fonts",
        "Montserrat-SemiBold.ttf"
      ),
      {
        family: "MontserratSemi",
      }
    );

    const template =
      await loadImage(
        path.join(
          process.cwd(),
          "public",
          "templates",
          "linkedin.png"
        )
      );

    const canvas =
      createCanvas(
        template.width,
        template.height
      );

    const ctx =
      canvas.getContext("2d");

    ctx.drawImage(
      template,
      0,
      0
    );

    // TITEL FUNCTIE

    ctx.fillStyle =
      "#ffffff";

    ctx.font =
      "bold 72px MontserratBold";

    ctx.textAlign =
      "center";

    ctx.fillText(
      jobTitle ?? "",
      600,
      260
    );

    // BEDRIJFSNAAM

    ctx.font =
      "42px MontserratSemi";

    ctx.fillText(
      companyName ?? "",
      280,
      1030
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

  } catch (err) {

    console.error(err);

    return Response.json(
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