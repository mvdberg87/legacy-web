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
  clubLogo,
  companyLogo,
  backgroundImage,
} = await req.json();

console.log("BACKGROUND:", backgroundImage);

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

      if (backgroundImage) {

  const bg =
    await loadImage(
      backgroundImage
    );

 const photoX = 80;
const photoY = 250;
const photoWidth = 1050;
const photoHeight = 950;

const scale = Math.max(
  photoWidth / bg.width,
  photoHeight / bg.height
);

const width = bg.width * scale;
const height = bg.height * scale;

const x =
  photoX +
  (photoWidth - width) / 2;

const y =
  photoY +
  (photoHeight - height) / 2;

ctx.save();

ctx.beginPath();
ctx.rect(
  photoX,
  photoY,
  photoWidth,
  photoHeight
);

ctx.clip();

ctx.drawImage(
  bg,
  x,
  y,
  width,
  height
);

ctx.restore();

ctx.fillStyle =
  "rgba(0,0,0,0.25)";

ctx.fillRect(
  photoX,
  photoY,
  photoWidth,
  photoHeight
);
}

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
  190
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
  520,
  1000
);

if (companyLogo) {

  const logo =
    await loadImage(companyLogo);

  const maxSize = 140;

  const ratio =
    Math.min(
      maxSize / logo.width,
      maxSize / logo.height
    );

  const logoWidth =
    logo.width * ratio;

  const logoHeight =
    logo.height * ratio;

  ctx.drawImage(
    logo,
    220 - logoWidth / 2,
    930 - logoHeight / 2,
    logoWidth,
    logoHeight
  );
}

if (clubLogo) {

  const logo =
    await loadImage(
      clubLogo
    );

  const maxSize = 180;

  const ratio =
    Math.min(
      maxSize / logo.width,
      maxSize / logo.height
    );

  const logoWidth =
    logo.width * ratio;

  const logoHeight =
    logo.height * ratio;

  ctx.drawImage(
    logo,
    900 - logoWidth / 2,
    960 - logoHeight / 2,
    logoWidth,
    logoHeight
  );
}

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