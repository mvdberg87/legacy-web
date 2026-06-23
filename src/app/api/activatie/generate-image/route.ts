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

  primaryColor,
  secondaryColor,
  accentColor,

  platform,
  activationTemplate,
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

    const templateFile =
  `${activationTemplate ?? "1"}-${platform}.png`;

  console.log({
  platform,
  activationTemplate,
  templateFile,
});

let templatePath =
  path.join(
    process.cwd(),
    "public",
    "templates",
    templateFile
  );

try {
  await loadImage(templatePath);
} catch {
  templatePath =
    path.join(
      process.cwd(),
      "public",
      "templates",
      "1-linkedin.png"
    );
}

const templateImage =
  await loadImage(templatePath);

    const canvas =
      createCanvas(
        templateImage.width,
templateImage.height
      );

    const ctx =
      canvas.getContext("2d");

      let photoX = 80;
let photoY = 250;
let photoWidth = 1050;
let photoHeight = 950;

let titleX = 390;
let titleY = 180;

let companyX = 390;
let companyY = 230;

let companyLogoBoxX = 235;
let companyLogoBoxY = 120;

let companyLogoCenterX = 305;
let companyLogoCenterY = 180;

let clubLogoX = 915;
let clubLogoY = 1000;

// STORY

if (platform === "story") {

  // foto volledig vullen
  photoX = 0;
  photoY = 480;
  photoWidth = canvas.width;
  photoHeight = 1100;

  // bedrijfslogo lager
  companyLogoBoxX = 70;
  companyLogoBoxY = 260;

  companyLogoCenterX = 135;
  companyLogoCenterY = 325;

  // titel + bedrijfsnaam lager
  titleX = 260;
  titleY = 310;

  companyX = 260;
  companyY = 390;

  // clublogo hoger
  clubLogoX = 850;
  clubLogoY = 1450;
}

// NARROWCASTING

if (platform === "narrowcasting") {

  // foto volledig achter sponsorvlak
  photoX = 60;
  photoY = 220;

  photoWidth = 1860;
  photoHeight = 900;

  // bedrijfslogo verder naar links
  companyLogoBoxX = 930;
  companyLogoBoxY = 75;

  companyLogoCenterX = 995;
  companyLogoCenterY = 140;

  // functietitel groter en dichter bij logo
  titleX = 1090;
  titleY = 125;

  companyX = 1090;
  companyY = 205;

  // clublogo midden in sponsorvak
  clubLogoX = 1560;
  clubLogoY = 930;
}

      if (backgroundImage) {

  const bg =
    await loadImage(
      backgroundImage
    );

const scale =
  Math.max(
    photoWidth / bg.width,
    photoHeight / bg.height
  ) * 1.02;

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
  templateImage,
      0,
      0
    );

    // TITEL FUNCTIE

    ctx.fillStyle =
  accentColor ??
  primaryColor ??
  "#4D9F5D";

ctx.textAlign = "left";

const titleMaxWidth =
  platform === "narrowcasting"
    ? 700
    : platform === "story"
    ? 700
    : 650;

const startFontSize =
  platform === "narrowcasting"
    ? 78
    : 52;

const jobTitleSize =
  fitFontSize(
    ctx,
    jobTitle ?? "",
    titleMaxWidth,
    startFontSize,
    "MontserratBold"
  );

ctx.font =
  `${jobTitleSize}px MontserratBold`;

ctx.fillText(
  jobTitle ?? "",
  titleX,
  titleY
);

    // BEDRIJFSNAAM

    ctx.textAlign = "left";

const companyFontSize =
  platform === "story"
    ? jobTitleSize
    : platform === "narrowcasting"
    ? jobTitleSize
    : 34;

ctx.font =
  `${companyFontSize}px MontserratSemi`;

ctx.fillStyle =
  "#ffffff";

ctx.fillText(
  companyName ?? "",
  companyX,
  companyY
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
  companyLogoBoxX,
  companyLogoBoxY,
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
      companyLogoCenterX - logoWidth / 2,
companyLogoCenterY - logoHeight / 2,
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
  clubLogoX - logoWidth / 2,
  clubLogoY - logoHeight / 2,
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