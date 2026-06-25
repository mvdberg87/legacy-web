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

const BASE_LAYOUT = {
  photoX: 0,
  photoY: 180,
  photoWidth: 1200,
  photoHeight: 820,

  titleX: 380,
  titleY: 105,

  companyX: 380,
  companyY: 160,

  companyLogoBoxX: 135,
  companyLogoBoxY: 40,
  companyLogoCenterX: 205,
  companyLogoCenterY: 105,
  companyLogoBoxSize: 140,

  clubLogoX: 1000,
  clubLogoY: 1040,

  stripeWidth: 80,
  topStripeAngle: -0.185,
  topStripeY: 435,

  bottomStripeAngle: -0.145,
  bottomStripeY: 943,

  titleMaxWidth: 800,
  startFontSize: 56,

  companyFontSize: 26,

  companyLogoMaxSize: 110,
  clubLogoMaxSize: 230,
};

const LAYOUTS = {
  square: {
    ...BASE_LAYOUT,
  },

  story: {
    ...BASE_LAYOUT,
  },

  narrowcasting: {
    ...BASE_LAYOUT,
  },
};

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

      ctx.fillStyle = "#FFFFFF";
ctx.fillRect(
  0,
  0,
  canvas.width,
  canvas.height
);

      const clubColor =
  accentColor ??
  primaryColor ??
  "#4D9F5D";

  const layout =
  platform === "story"
    ? LAYOUTS.story
    : platform === "narrowcasting"
    ? LAYOUTS.narrowcasting
    : LAYOUTS.square;

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

if (
  platform === "linkedin" ||
  platform === "facebook" ||
  platform === "instagram"
) {

  // FOTO

  photoX = 0;
photoY = 180;
layout.photoWidth = 1200;
layout.photoHeight = 820;

  // TITEL

  titleX = 380;
  titleY = 105;

  // BEDRIJFSNAAM

  companyX = 380;
  companyY = 160;

  // BEDRIJFSLOGO

  companyLogoBoxX = 135;
companyLogoBoxY = 40;

layout.companyLogoCenterX = 205;
layout.companyLogoCenterY = 105;

layout.companyLogoBoxSize = 140;

  // CLUBLOGO

  clubLogoX = 1000;
clubLogoY = 1040;
}

if (platform === "story") {

  photoX = 0;
  photoY = 520;
  layout.photoWidth = 1080;
  layout.photoHeight = 1200;

  titleX = 380;
  titleY = 380;

  companyX = 240;
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
  layout.photoWidth = 1840;
  layout.photoHeight = 800;

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

  const bg =
    await loadImage(
      backgroundImage
    );

const scale =
  Math.max(
    layout.photoWidth / bg.width,
    layout.photoHeight / bg.height
  ) * 1.02;

const width = bg.width * scale;
const height = bg.height * scale;

const x =
  layout.photoX +
  (layout.photoWidth - width) / 2;

const y =
  layout.photoY +
  (layout.photoHeight - height) / 2;

ctx.save();

ctx.beginPath();
ctx.rect(
  layout.photoX,
  layout.photoY,
  layout.photoWidth,
  layout.photoHeight
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
  "rgba(0,0,0,0.12)";

ctx.fillRect(
  layout.photoX,
  layout.photoY,
  layout.photoWidth,
  layout.photoHeight
);
}

if (
  platform === "linkedin" ||
  platform === "facebook" ||
  platform === "instagram"
) {
}

ctx.drawImage(
  templateImage,
  0,
  0,
  canvas.width,
  canvas.height
);

      const stripeWidth = layout.stripeWidth;
const topStripeAngle = layout.topStripeAngle;
const bottomStripeAngle = layout.bottomStripeAngle;

// ===== BOVENSTE BALK =====

ctx.fillStyle =
  primaryColor ?? "#4D9F5D";

ctx.save();

ctx.translate(0, layout.topStripeY);

ctx.rotate(topStripeAngle);

ctx.fillRect(
  -400,
  -stripeWidth / 2,
  canvas.width + 800,
  stripeWidth
);

ctx.restore();

// ===== ONDERSTE BALK =====

ctx.fillStyle =
  secondaryColor ?? "#003B70";

ctx.save();

ctx.translate(0, layout.bottomStripeY);

ctx.rotate(bottomStripeAngle);

ctx.fillRect(
  -400,
  -stripeWidth / 2,
  canvas.width + 800,
  stripeWidth
);

ctx.restore();

   // TITEL FUNCTIE

ctx.fillStyle =
  clubColor;

ctx.textAlign = "left";

const titleMaxWidth = layout.titleMaxWidth;
const startFontSize = layout.startFontSize;

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
  layout.titleX,
  layout.titleY
);

    // BEDRIJFSNAAM

    ctx.textAlign = "left";

const companyFontSize = layout.companyFontSize;

ctx.font =
  `${companyFontSize}px MontserratSemi`;

ctx.fillStyle =
  "#222222";

ctx.fillText(
  companyName ?? "",
  layout.companyX,
  layout.companyY
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
  layout.companyLogoBoxX,
  layout.companyLogoBoxY,
  layout.companyLogoBoxSize,
  layout.companyLogoBoxSize,
  20
);

    ctx.fill();

    const maxSize = layout.companyLogoMaxSize;

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
      layout.companyLogoCenterX - logoWidth / 2,
layout.companyLogoCenterY - logoHeight / 2,
      logoWidth,
      logoHeight
    );

    if (
  platform === "linkedin" ||
  platform === "facebook" ||
  platform === "instagram"
) {

}

  } catch (error) {

    console.log(
      "Company logo kon niet geladen worden"
    );

  }
}

if (clubLogo) {

const logo =
  await loadImage(clubLogo);

  const maxSize = layout.clubLogoMaxSize;

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
  layout.clubLogoX - logoWidth / 2,
  layout.clubLogoY - logoHeight / 2,
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