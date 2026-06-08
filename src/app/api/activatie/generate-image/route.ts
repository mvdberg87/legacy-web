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
  "#4D9F5D";

ctx.textAlign = "left";

const jobTitleSize =
  fitFontSize(
    ctx,
    jobTitle ?? "",
    650,
    52,
    "MontserratBold"
  );

ctx.font =
  `${jobTitleSize}px MontserratBold`;

ctx.fillText(
  jobTitle ?? "",
  390,
  180
);

    // BEDRIJFSNAAM

    ctx.textAlign = "left";

ctx.font =
  "34px MontserratSemi";

ctx.fillStyle =
  "#ffffff";

ctx.fillText(
  companyName ?? "",
  390,
  230
);

if (companyLogo) {

  try {

    const logo =
      await loadImage(companyLogo);

    // wit vlak

    ctx.fillStyle =
      "#ffffff";

    ctx.beginPath();

    ctx.roundRect(
      235,
      115,
      130,
      130,
      20
    );

    ctx.fill();

    const maxSize = 90;

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
      305 - logoWidth / 2,
      175 - logoHeight / 2,
      logoWidth,
      logoHeight
    );

  } catch (error) {

    console.log(
      "Company logo kon niet geladen worden"
    );

  }
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
  915 - logoWidth / 2,
  1000 - logoHeight / 2,
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

    } catch (error) {

    console.error(error);

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