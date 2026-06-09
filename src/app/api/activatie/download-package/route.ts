import JSZip from "jszip";

export async function POST(
  req: Request
) {
  try {

    const payload =
      await req.json();

    const zip =
      new JSZip();

    const host =
      process.env.NEXT_PUBLIC_SITE_URL ??
      "https://www.sponsorjobs.nl";

    const templates = [
      {
        name: "social-post.png",
        template: "linkedin",
      },
      {
        name: "story.png",
        template: "story",
      },
      {
        name: "narrowcasting.png",
        template: "narrowcasting",
      },
    ];

    for (const item of templates) {

      const response =
        await fetch(
          `${host}/api/activatie/generate-image`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              ...payload,
              template:
                item.template,
            }),
          }
        );

        if (!response.ok) {
  throw new Error(
    `generate-image failed: ${response.status}`
  );
}

      const imageBuffer =
        await response.arrayBuffer();

      zip.file(
        item.name,
        imageBuffer
      );
    }

    zip.file(
      "vacature-post.txt",
      payload.generatedText ??
        ""
    );

    const zipBuffer =
  await zip.generateAsync({
    type: "uint8array",
  });

    const safeCompany =
  (payload.companyName ?? "bedrijf")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

const safeJob =
  (payload.jobTitle ?? "vacature")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

return new Response(
  new Uint8Array(zipBuffer),
  {
    headers: {
      "Content-Type":
        "application/zip",

      "Content-Disposition":
        `attachment; filename="${safeCompany}-${safeJob}.zip"`,
    },
  }
);

  } catch (error) {

    console.error(error);

    return Response.json(
      {
        error:
          "download-package failed",
      },
      {
        status: 500,
      }
    );
  }
}