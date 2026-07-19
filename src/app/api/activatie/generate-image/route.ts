import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";
import { CanvasRenderingContext2D } from "canvas";

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

function fitFontSize(
  ctx: CanvasRenderingContext2D,
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

// Template 2
cardX: 180,
cardY: 820,

cardWidth: 840,
cardHeight: 260,

cardRadius: 36,
// Company logo
companyLogoCardBoxX: 235,
companyLogoCardBoxY: 915,
companyLogoCardBoxSize: 90,

companyLogoCardMaxSize: 72,

// Club logo
cardClubLogoX: 910,
cardClubLogoY: 885,
cardClubLogoMaxSize: 60,

// Badge
badgeX: 260,
badgeY: 870,
badgeWidth: 150,
badgeHeight: 44,
badgeRadius: 22,

// Card title
cardTitleX: 350,
cardTitleY: 955,
cardTitleMaxWidth: 560,
cardTitleStartFontSize: 46,

// Card company
cardCompanyX: 350,
cardCompanyY: 1005,
cardCompanyFontSize: 28,
};


const LAYOUTS = {
  square: {
    ...BASE_LAYOUT,
  },

  story: {
  ...BASE_LAYOUT,

  photoX: -40,
  photoY: 420,
  photoWidth: 1160,
  photoHeight: 1080,

  companyLogoBoxX: 55,
  companyLogoBoxY: 70,
  companyLogoCenterX: 145,
  companyLogoCenterY: 160,
  companyLogoBoxSize: 170,
  companyLogoMaxSize: 140,

  companyX: 255,
  companyY: 215,

  titleX: 255,
  titleY: 145,

  clubLogoX: 850,
  clubLogoY: 1600,
  clubLogoMaxSize: 250,

  companyFontSize: 42,
  startFontSize: 64,
  titleMaxWidth: 700,

  topStripeY: 600,
  bottomStripeY: 1475,
},

  narrowcasting: {
  ...BASE_LAYOUT,

  photoX: 0,
  photoY: 160,
  photoWidth: 1920,
  photoHeight: 920,

  companyLogoBoxX: 200,
  companyLogoBoxY: 25,
  companyLogoCenterX: 285,
  companyLogoCenterY: 105,
  companyLogoBoxSize: 165,
  companyLogoMaxSize: 135,

  companyX: 370,
  companyY: 165,

  titleX: 370,
  titleY: 90,

  clubLogoX: 1650,
  clubLogoY: 930,
  clubLogoMaxSize: 220,

  companyFontSize: 50,
  startFontSize: 60,
  titleMaxWidth: 800,

  topStripeY: 477,
  bottomStripeY: 985,
},
};

type Layout = typeof LAYOUTS.square;

async function drawBackground(
  ctx: CanvasRenderingContext2D,
  backgroundImage: string,
  layout: Layout
) {
  const bg = await loadImage(backgroundImage);

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

  ctx.fillStyle = "rgba(0,0,0,0.12)";

  ctx.fillRect(
    layout.photoX,
    layout.photoY,
    layout.photoWidth,
    layout.photoHeight
  );
}

function drawStripes(
  ctx: CanvasRenderingContext2D,
  width: number,
  layout: Layout,
  primaryColor: string,
  secondaryColor: string
) {
  // bovenste balk
  ctx.fillStyle = primaryColor ?? "#4D9F5D";

  ctx.save();

  ctx.translate(0, layout.topStripeY);

  ctx.rotate(layout.topStripeAngle);

  ctx.fillRect(
  -400,
  -layout.stripeWidth / 2,
  width + 800,
  layout.stripeWidth
);

  ctx.restore();

  // onderste balk
  ctx.fillStyle = secondaryColor ?? "#003B70";

  ctx.save();

  ctx.translate(0, layout.bottomStripeY);

  ctx.rotate(layout.bottomStripeAngle);

  ctx.fillRect(
  -400,
  -layout.stripeWidth / 2,
  width + 800,
  layout.stripeWidth
);

  ctx.restore();
}

function drawTitle(
  ctx: CanvasRenderingContext2D,
  jobTitle: string,
  clubColor: string,
  layout: Layout
) {
  ctx.fillStyle = clubColor;

  ctx.textAlign = "left";

  const jobTitleSize = fitFontSize(
    ctx,
    jobTitle ?? "",
    layout.titleMaxWidth,
    layout.startFontSize,
    "MontserratBold"
  );

  ctx.font = `${jobTitleSize}px MontserratBold`;

  ctx.fillText(
    jobTitle ?? "",
    layout.titleX,
    layout.titleY
  );
}

function drawCompany(
  ctx: CanvasRenderingContext2D,
  companyName: string,
  layout: Layout
) {
  ctx.textAlign = "left";

  ctx.font = `${layout.companyFontSize}px MontserratSemi`;

  ctx.fillStyle = "#222222";

  ctx.fillText(
    companyName ?? "",
    layout.companyX,
    layout.companyY
  );
}

/* =====================================
   TEMPLATE 2
===================================== */

async function drawRoundedPhoto(
  ctx: CanvasRenderingContext2D,
  backgroundImage: string,
  layout: Layout
) {
  const bg = await loadImage(backgroundImage);

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

ctx.roundRect(
  layout.photoX,
  layout.photoY,
  layout.photoWidth,
  layout.photoHeight,
  layout.cardRadius
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

  // Donkere overlay
  ctx.save();

  ctx.beginPath();

ctx.roundRect(
  layout.photoX,
  layout.photoY,
  layout.photoWidth,
  layout.photoHeight,
  layout.cardRadius
);

ctx.clip();

  ctx.fillStyle = "rgba(0,0,0,0.08)";

  ctx.fillRect(
    layout.photoX,
    layout.photoY,
    layout.photoWidth,
    layout.photoHeight
  );

  ctx.restore();
}

function drawFloatingCard(
  ctx: CanvasRenderingContext2D,
  layout: Layout
) {

  const x = layout.cardX;
const y = layout.cardY;

const width = layout.cardWidth;
const height = layout.cardHeight;

  ctx.save();

  ctx.shadowColor = "rgba(0,0,0,0.15)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 10;

  ctx.fillStyle = "#FFFFFF";

  ctx.beginPath();

  ctx.roundRect(
  x,
  y,
  width,
  height,
  layout.cardRadius
);

  ctx.fill();

  ctx.restore();
}

function drawTemplate2Badge(
  ctx: CanvasRenderingContext2D,
  layout: Layout,
  primaryColor: string
) {
  ctx.fillStyle = primaryColor;

  ctx.beginPath();

  ctx.roundRect(
  layout.badgeX,
  layout.badgeY,
  layout.badgeWidth,
  layout.badgeHeight,
  layout.badgeRadius
);

  ctx.fill();

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "22px MontserratBold";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(
    "VACATURE",
    layout.badgeX + layout.badgeWidth / 2,
layout.badgeY + layout.badgeHeight / 2
  );
}

function drawTemplate2Title(
  ctx: CanvasRenderingContext2D,
  layout: Layout,
  jobTitle: string
) {
  const size = fitFontSize(
    ctx,
    jobTitle,
    layout.cardTitleMaxWidth,
    layout.cardTitleStartFontSize,
    "MontserratBold"
  );

  ctx.font = `${size}px MontserratBold`;
  ctx.fillStyle = "#111111";
  ctx.textAlign = "left";

  ctx.fillText(
    jobTitle,
    layout.cardTitleX,
    layout.cardTitleY
  );
}

function drawTemplate2Company(
  ctx: CanvasRenderingContext2D,
  layout: Layout,
  companyName: string
) {
  ctx.font = `${layout.cardCompanyFontSize}px MontserratSemi`;
  ctx.fillStyle = "#777777";
  ctx.textAlign = "left";

  ctx.fillText(
    companyName,
    layout.cardCompanyX,
    layout.cardCompanyY
  );
}

async function drawLogo(
  ctx: CanvasRenderingContext2D,
  logoUrl: string,
  options: {
  centerX?: number;
  centerY?: number;

  x?: number;
  y?: number;

  boxX?: number;
  boxY?: number;
  boxSize?: number;

  maxSize: number;

  background?: boolean;
}
) {
  try {

    const logo = await loadImage(logoUrl);

    if (options.background) {
      ctx.fillStyle = "#FFFFFF";

      ctx.beginPath();

      ctx.roundRect(
        options.boxX!,
        options.boxY!,
        options.boxSize!,
        options.boxSize!,
        20
      );

      ctx.fill();
    }

    if (
  options.x === undefined &&
  (options.centerX === undefined ||
    options.centerY === undefined)
) {
  throw new Error(
    "drawLogo requires x/y or centerX/centerY"
  );
}

    const ratio = Math.min(
      options.maxSize / logo.width,
      options.maxSize / logo.height
    );

    const logoWidth = logo.width * ratio;
    const logoHeight = logo.height * ratio;

    let drawX;
let drawY;

if (
  options.boxX !== undefined &&
  options.boxY !== undefined &&
  options.boxSize !== undefined &&
  options.x === undefined &&
  options.centerX === undefined
) {
  drawX =
    options.boxX +
    (options.boxSize - logoWidth) / 2;

  drawY =
    options.boxY +
    (options.boxSize - logoHeight) / 2;

} else {

  drawX =
    options.x ??
    (options.centerX! - logoWidth / 2);

  drawY =
    options.y ??
    (options.centerY! - logoHeight / 2);

}

ctx.drawImage(
  logo,
  drawX,
  drawY,
  logoWidth,
  logoHeight
);

  } catch (error) {

    console.log("Logo kon niet geladen worden");

  }
}

async function drawTemplate2({
  ctx,
  layout,
  backgroundImage,
  companyLogo,
  clubLogo,
  companyName,
  jobTitle,
  primaryColor,
}: {
  ctx: CanvasRenderingContext2D;
  layout: Layout;

  backgroundImage?: string;

  companyLogo?: string;

  clubLogo?: string;

  companyName: string;

  jobTitle: string;

  primaryColor: string;
}) {

  // 1. Achtergrondfoto
  if (backgroundImage) {
    await drawRoundedPhoto(
      ctx,
      backgroundImage,
      layout
    );
  }

  // 2. Zwevende kaart
  drawFloatingCard(ctx, layout);

drawTemplate2Badge(
  ctx,
  layout,
  primaryColor
);

drawTemplate2Title(
  ctx,
  layout,
  jobTitle
);

drawTemplate2Company(
  ctx,
  layout,
  companyName
);

if (companyLogo) {
  await drawLogo(
  ctx,
  companyLogo,
  {
    boxX: layout.companyLogoCardBoxX,
    boxY: layout.companyLogoCardBoxY,
    boxSize: layout.companyLogoCardBoxSize,
    maxSize: layout.companyLogoCardMaxSize,
  }
);
}

if (clubLogo) {
  await drawLogo(
    ctx,
    clubLogo,
    {
      x: layout.cardClubLogoX,
      y: layout.cardClubLogoY,
      maxSize: layout.cardClubLogoMaxSize,
    }
  );
}

}

async function loadTemplate(
  platform: string,
  activationTemplate?: string
) {
  const templateFile =
    `${activationTemplate ?? "1"}-${platform}.png`;

  const templatePath = path.join(
    process.cwd(),
    "public",
    "templates",
    templateFile
  );

  try {
    return await loadImage(templatePath);
  } catch {
    return await loadImage(
      path.join(
        process.cwd(),
        "public",
        "templates",
        "1-linkedin.png"
      )
    );
  }
}

async function createCanvasFromTemplate(
  platform: string,
  activationTemplate?: string
) {
  const templateImage = await loadTemplate(
    platform,
    activationTemplate
  );

  const canvas = createCanvas(
    templateImage.width,
    templateImage.height
  );

  const ctx = canvas.getContext("2d");

  return {
    canvas,
    ctx,
    templateImage,
  };
}

function getLayout(platform: string): Layout {
  const layoutMap = {
    linkedin: LAYOUTS.square,
    facebook: LAYOUTS.square,
    instagram: LAYOUTS.square,
    story: LAYOUTS.story,
    narrowcasting: LAYOUTS.narrowcasting,
  } as const;

  return (
    layoutMap[
      platform as keyof typeof layoutMap
    ] ?? LAYOUTS.square
  );
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

console.log({
  platform,
  activationTemplate,
});

    const {
  canvas,
  ctx,
  templateImage,
} = await createCanvasFromTemplate(
  platform,
  activationTemplate
);

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

  const layout = getLayout(platform);

  if (activationTemplate === "2") {

  ctx.drawImage(
    templateImage,
    0,
    0,
    canvas.width,
    canvas.height
  );

  await drawTemplate2({
    ctx,
    layout,
    backgroundImage,
    companyLogo,
    clubLogo,
    companyName,
    jobTitle,
    primaryColor:
      primaryColor ?? "#4D9F5D",
  });

} else {

  if (backgroundImage) {
    await drawBackground(
      ctx,
      backgroundImage,
      layout
    );
  }

  ctx.drawImage(
    templateImage,
    0,
    0,
    canvas.width,
    canvas.height
  );

  drawStripes(
    ctx,
    canvas.width,
    layout,
    primaryColor ?? "#4D9F5D",
    secondaryColor ?? "#003B70"
  );

  drawTitle(
    ctx,
    jobTitle ?? "",
    clubColor,
    layout
  );

  drawCompany(
    ctx,
    companyName ?? "",
    layout
  );

  if (companyLogo) {
    await drawLogo(
      ctx,
      companyLogo,
      {
        centerX: layout.companyLogoCenterX,
        centerY: layout.companyLogoCenterY,
        maxSize: layout.companyLogoMaxSize,
        background: true,
        boxX: layout.companyLogoBoxX,
        boxY: layout.companyLogoBoxY,
        boxSize: layout.companyLogoBoxSize,
      }
    );
  }

  if (clubLogo) {
    await drawLogo(
      ctx,
      clubLogo,
      {
        centerX: layout.clubLogoX,
        centerY: layout.clubLogoY,
        maxSize: layout.clubLogoMaxSize,
      }
    );
  }
}

const buffer = canvas.toBuffer("image/png");

return new Response(
  new Uint8Array(buffer),
  {
    headers: {
      "Content-Type": "image/png",
    },
  }
);


    } catch (error) {

  console.error("IMAGE API ERROR:", error);

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