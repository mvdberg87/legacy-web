import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";

function fitFontSize(
  ctx: any,
  text: string,
  maxWidth: number,
  startSize: number,
  fontFamily: string
) {
  let size = startSize;

  while (size > 20) {
    ctx.font = `${size}px ${fontFamily}`;

    if (
      ctx.measureText(text).width <=
      maxWidth
    ) {
      return size;
    }

    size--;
  }

  return 20;
}

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

    ctx.textAlign = "center";

const jobTitleSize =
  fitFontSize(
    ctx,
    jobTitle ?? "",
    850,
    52,
    "MontserratBold"
  );

ctx.font =
  `${jobTitleSize}px MontserratBold`;

ctx.fillText(
  jobTitle ?? "",
  600,
  260
);

    // BEDRIJFSNAAM

    ctx.textAlign = "left";

const companySize =
  fitFontSize(
    ctx,
    companyName ?? "",
    420,
    42,
    "MontserratSemi"
  );

ctx.font =
  `${companySize}px MontserratSemi`;

ctx.fillText(
  companyName ?? "",
  340,
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