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

async function drawLogo(
  ctx: CanvasRenderingContext2D,
  logoUrl: string,
  options: {
    centerX: number;
    centerY: number;
    maxSize: number;
    background?: boolean;
    boxX?: number;
    boxY?: number;
    boxSize?: number;
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

    const ratio = Math.min(
      options.maxSize / logo.width,
      options.maxSize / logo.height
    );

    const logoWidth = logo.width * ratio;
    const logoHeight = logo.height * ratio;

    ctx.drawImage(
      logo,
      options.centerX - logoWidth / 2,
      options.centerY - logoHeight / 2,
      logoWidth,
      logoHeight
    );

  } catch (error) {

    console.log("Logo kon niet geladen worden");

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