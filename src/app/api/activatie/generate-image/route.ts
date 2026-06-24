import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";
import fs from "fs";

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

function getContrastColor(color: string) {

  const hex =
    color.replace("#", "");

  const r =
    parseInt(
      hex.substring(0, 2),
      16
    );

  const g =
    parseInt(
      hex.substring(2, 4),
      16
    );

  const b =
    parseInt(
      hex.substring(4, 6),
      16
    );

  const brightness =
    (
      r * 299 +
      g * 587 +
      b * 114
    ) / 1000;

  return brightness > 150
    ? "#000000"
    : "#FFFFFF";
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

  console.log(
  "TEMPLATE PATH:",
  templatePath
);

console.log(
  "TEMPLATE EXISTS:",
  fs.existsSync(templatePath)
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

  console.log("TEMPLATE LOADED");

    const canvas =
      createCanvas(
        templateImage.width,
templateImage.height
      );

    const ctx =
      canvas.getContext("2d");

      let photoX = 0;
let photoY = 0;
let photoWidth = 0;
let photoHeight = 0;

let titleX = 0;
let titleY = 0;

let companyX = 0;
let companyY = 0;

let companyLogoBoxX = 0;
let companyLogoBoxY = 0;

let companyLogoCenterX = 0;
let companyLogoCenterY = 0;
let companyLogoBoxSize = 130;

let clubLogoX = 0;
let clubLogoY = 0;

if (platform === "linkedin") {

  photoX = 40;
  photoY = 190;
  photoWidth = 1120;
  photoHeight = 450;

  titleX = 350;
  titleY = 95;

  companyX = 350;
  companyY = 150;

  companyLogoBoxX = 200;
  companyLogoBoxY = 35;

  companyLogoCenterX = 265;
  companyLogoCenterY = 100;

  clubLogoX = 1080;
  clubLogoY = 90;
}

if (platform === "facebook") {

  photoX = 40;
  photoY = 190;
  photoWidth = 1120;
  photoHeight = 400;

  titleX = 350;
  titleY = 95;

  companyX = 350;
  companyY = 150;

  companyLogoBoxX = 200;
  companyLogoBoxY = 35;

  companyLogoCenterX = 265;
  companyLogoCenterY = 100;

  clubLogoX = 1080;
  clubLogoY = 90;
}

if (platform === "instagram") {

  photoX = 40;
  photoY = 250;
  photoWidth = 1000;
  photoHeight = 700;

  titleX = 300;
  titleY = 120;

  companyX = 300;
  companyY = 180;

  companyLogoBoxX = 120;
  companyLogoBoxY = 50;

  companyLogoCenterX = 185;
  companyLogoCenterY = 115;

  clubLogoX = 950;
  clubLogoY = 110;
}

if (platform === "story") {

  photoX = 0;
  photoY = 520;
  photoWidth = 1080;
  photoHeight = 1200;

  titleX = 250;
  titleY = 230;

  companyX = 250;
  companyY = 310;

  companyLogoBoxX = 80;
  companyLogoBoxY = 130;
  companyLogoBoxSize = 160;

  companyLogoCenterX = 145;
  companyLogoCenterY = 195;

  clubLogoX = 920;
  clubLogoY = 180;
}

if (platform === "narrowcasting") {

  photoX = 40;
  photoY = 220;
  photoWidth = 1840;
  photoHeight = 800;

  titleX = 1100;
  titleY = 120;

  companyX = 1100;
  companyY = 190;

  companyLogoBoxX = 930;
  companyLogoBoxY = 40;

  companyLogoCenterX = 995;
  companyLogoCenterY = 105;
  companyLogoBoxSize = 150;

  clubLogoX = 1750;
  clubLogoY = 100;
}

      if (backgroundImage) {

        console.log("LOAD BACKGROUND START");

  const bg =
    await loadImage(
      backgroundImage
    );

    console.log("LOAD BACKGROUND SUCCESS");

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

const clubColor =
  accentColor ??
  primaryColor ??
  "#4D9F5D";

ctx.fillStyle =
  getContrastColor(clubColor);

ctx.textAlign = "left";

const titleMaxWidth =
  platform === "story"
    ? 700
    : platform === "narrowcasting"
    ? 750
    : platform === "instagram"
    ? 650
    : 600;

const startFontSize =
  platform === "narrowcasting"
    ? 78
    : platform === "story"
    ? 64
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
  getContrastColor(clubColor);

ctx.fillText(
  companyName ?? "",
  companyX,
  companyY
);

if (companyLogo) {

  try {

    console.log("COMPANY LOGO START");

const logo =
  await loadImage(companyLogo);

console.log("COMPANY LOGO SUCCESS");

    // wit vlak

    ctx.fillStyle =
      "#ffffff";

    ctx.beginPath();

    ctx.roundRect(
  companyLogoBoxX,
  companyLogoBoxY,
  companyLogoBoxSize,
  companyLogoBoxSize,
  20
);

    ctx.fill();

    const maxSize =
  platform === "story"
    ? 130
    : platform === "narrowcasting"
    ? 110
    : 90;

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

  console.log("CLUB LOGO START");

const logo =
  await loadImage(clubLogo);

console.log("CLUB LOGO SUCCESS");

  const maxSize =
  platform === "story"
    ? 220
    : platform === "narrowcasting"
    ? 150
    : platform === "instagram"
    ? 140
    : 160;

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