"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ClubNavbar from "@/components/club/ClubNavbar";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import { getCompanyLogo } from "@/lib/companyLogo";

type Job = {
  id: string;
  title: string;
  company_name: string;
  activation_image_url: string | null;
  company_logo_url: string | null;
  apply_url: string | null;
};

type ClubData = {
  id: string;
  name: string;
  logo_url: string | null;
  activation_image_url: string | null;

  primary_color: string | null;
  secondary_color: string | null;

  activation_accent_color:
    string | null;

  activation_template:
    string | null;
};

export default function ActivatiePage() {
  const params = useParams();

  const slug =
    params.slug as string;

  const supabase =
    getSupabaseBrowser();

  const [jobs, setJobs] =
    useState<Job[]>([]);

  const [selectedJob, setSelectedJob] =
    useState("");

  const [
    activationType,
    setActivationType,
  ] = useState("linkedin");

  const [loading, setLoading] =
    useState(true);

const [tone, setTone] =
  useState("Professioneel");

const [generatedText, setGeneratedText] =
  useState("");

const [generating, setGenerating] =
  useState(false);

  const [imageUrl, setImageUrl] =
  useState("");

  const [clubData, setClubData] =
  useState<ClubData | null>(null);

  const [copied, setCopied] =
  useState(false);

  const [generatingImage, setGeneratingImage] =
  useState(false);

const [imageDownloaded, setImageDownloaded] =
  useState(false);

const [packageDownloading, setPackageDownloading] =
  useState(false);

const [packageDownloaded, setPackageDownloaded] =
  useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      const { data: club } =
        await supabase
          .from("clubs")
          .select(`
  id,
  name,
  logo_url,
  activation_image_url,

  primary_color,
  secondary_color,

  activation_accent_color,
  activation_template
`)
          .eq("slug", slug)
          .single();

      if (!club) {
  return;
}

setClubData(club);

      const { data: jobsData } =
  await supabase
    .from("jobs")
    .select(`
      id,
      title,
      company_name,
      apply_url,
      activation_image_url,
      company_logo_url
    `)
          .eq("club_id", club.id)
          .is("archived_at", null)
          .order("created_at", {
            ascending: false,
          });

      setJobs(jobsData ?? []);

      if (
        jobsData &&
        jobsData.length > 0
      ) {
        setSelectedJob(
          jobsData[0].id
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function slugifyFileName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getSelectedJob() {
  return jobs.find(
    (j) => j.id === selectedJob
  );
}

  async function generatePost() {

  if (!selectedJob) return;

  setGenerating(true);

  const job =
    jobs.find(
      (j) => j.id === selectedJob
    );

  const response = await fetch(
    "/api/activatie/generate-post",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },


      body: JSON.stringify({
  companyName: job?.company_name,
  jobTitle: job?.title,
  applyUrl: job?.apply_url,
  platform: activationType,
  tone,
  clubName: slug,
}),
    }
  );

  const data =
    await response.json();

  setGeneratedText(
    data.text ?? ""
  );

  setGenerating(false);
}

async function copyPost() {

  await navigator.clipboard.writeText(
    generatedText
  );

  setCopied(true);

  setTimeout(() => {
    setCopied(false);
  }, 2000);
}

async function generateImage() {
  const job = getSelectedJob();

  if (!job) return;

  setGeneratingImage(true);

  try {
    const response =
      await fetch(
        "/api/activatie/generate-image",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
  platform: activationType,

  activationTemplate:
    clubData?.activation_template ?? "1",

  primaryColor:
    clubData?.primary_color,

  secondaryColor:
    clubData?.secondary_color,

  accentColor:
    clubData?.activation_accent_color,

  clubLogo:
    clubData?.logo_url,

  companyLogo:
    getCompanyLogo(
      job.apply_url,
      job.company_logo_url
    ),

  backgroundImage:
    job.activation_image_url ??
    clubData?.activation_image_url,

  companyName:
    job.company_name,

  jobTitle:
    job.title,
}),
        }
      );

    const blob =
      await response.blob();

    const url =
      URL.createObjectURL(blob);

    setImageUrl(url);
  } finally {
    setGeneratingImage(false);
  }
}

function downloadImage() {
  const job = getSelectedJob();

  if (!job || !imageUrl) return;

  setImageDownloaded(true);

  const fileName =
    `${activationType}_${slugifyFileName(job.title)}.png`;

  const a =
    document.createElement("a");

  a.href = imageUrl;
  a.download = fileName;
  a.click();

  setTimeout(() => {
    setImageDownloaded(false);
  }, 2000);
}

async function downloadPackage() {
  const job = getSelectedJob();

  if (!job) return;

  setPackageDownloading(true);
  setPackageDownloaded(false);

  try {
    const response =
      await fetch(
        "/api/activatie/download-package",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            companyName:
              job.company_name,

            jobTitle:
              job.title,

            applyUrl:
              job.apply_url,

            generatedText,

            clubLogo:
              clubData?.logo_url,

            companyLogo:
              getCompanyLogo(
                job.apply_url,
                job.company_logo_url
              ),

            backgroundImage:
              job.activation_image_url ??
              clubData?.activation_image_url,

            primaryColor:
              clubData?.primary_color,

            secondaryColor:
              clubData?.secondary_color,
          }),
        }
      );

    const blob =
      await response.blob();

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download =
      `activatiepakket_${slugifyFileName(job.title)}.zip`;

    a.click();

    setPackageDownloaded(true);

    setTimeout(() => {
      setPackageDownloaded(false);
    }, 2000);
  } finally {
    setPackageDownloading(false);
  }
}

  return (
    <main className="min-h-screen p-6 bg-[#0d1b2a]">

      <ClubNavbar slug={slug} />

      <div className="max-w-6xl mx-auto bg-white border-2 rounded-2xl p-10 shadow-md mt-6">

        <h1 className="text-3xl font-semibold mb-4">
          Activatie
        </h1>

        <p className="text-gray-600 mb-8">
          Genereer social media content en narrowcasting voor vacatures.
        </p>

        {loading ? (
          <p>Laden...</p>
        ) : (
          <>
            <div className="mb-6">

              <label className="block text-sm font-medium mb-2">
                Kies een vacature
              </label>

              <select
                value={selectedJob}
                onChange={(e) =>
                  setSelectedJob(
                    e.target.value
                  )
                }
                className="w-full border-2 rounded-lg p-3"
              >
                {jobs.map((job) => (
                  <option
                    key={job.id}
                    value={job.id}
                  >
                    {job.company_name}
                    {" - "}
                    {job.title}
                  </option>
                ))}
              </select>

            </div>

            <div className="mb-8">

              <label className="block text-sm font-medium mb-2">
                Activatietype
              </label>

              <select
                value={activationType}
                onChange={(e) =>
                  setActivationType(
                    e.target.value
                  )
                }
                className="w-full border-2 rounded-lg p-3"
              >
                <option value="linkedin">
                  LinkedIn post
                </option>

                <option value="facebook">
                  Facebook post
                </option>

                <option value="instagram">
                  Instagram post
                </option>

                <option value="story">
                  Instagram Story
                </option>

                <option value="narrowcasting">
                  Narrowcasting
                </option>
              </select>

            </div>

<div className="mb-8">

  <label className="block text-sm font-medium mb-2">
    Tone of voice
  </label>

  <select
    value={tone}
    onChange={(e) =>
      setTone(e.target.value)
    }
    className="w-full border-2 rounded-lg p-3"
  >
    <option>Professioneel</option>
    <option>Zakelijk</option>
    <option>Enthousiast</option>
    <option>Sportief</option>
  </select>

</div>

            <div className="flex flex-col sm:flex-row gap-3">
  <button
    onClick={generatePost}
    className="
      bg-[#0d1b2a]
      text-white
      px-6
      py-3
      rounded-lg
      hover:opacity-90
      w-full sm:w-auto
    "
  >
    {generating
      ? "Genereren..."
      : "Genereer post"}
  </button>

  <button
    onClick={generateImage}
    disabled={generatingImage}
    className="
      bg-green-700
      text-white
      px-6
      py-3
      rounded-lg
      disabled:opacity-60
      w-full sm:w-auto
    "
  >
    {generatingImage
      ? "Afbeelding genereren..."
      : "Genereer afbeelding"}
  </button>
</div>

<p className="text-xs text-gray-500 mt-3">
  Als er bij de vacature geen eigen achtergrondfoto is toegevoegd,
  gebruiken we automatisch de standaardfoto uit Club bewerken:
  Achtergrondfoto vacaturetemplate.
</p>

            {generatedText && (

  <div className="mt-8">

    <h2 className="font-semibold mb-3">
      Gegenereerde post
    </h2>

    <textarea
      value={generatedText}
      readOnly
      className="
        w-full
        h-64
        border-2
        rounded-xl
        p-4
      "
    />

    <button
  onClick={copyPost}
  className="
    mt-4
    bg-green-600
    text-white
    px-4
    py-2
    rounded-lg
  "
>
  {copied
    ? "✓ Gekopieerd"
    : "Kopieer post"}
</button>

  </div>
        )}

        {imageUrl && (

  <div className="mt-8">

    <h2 className="font-semibold mb-3">
      Preview afbeelding
    </h2>

    <img
      src={imageUrl}
      alt="Preview"
      className="
        max-w-[600px]
        w-full
        border-2
        rounded-xl
      "
    />
<div className="flex flex-col sm:flex-row gap-3 mt-4">

  <button
    onClick={downloadImage}
    className="
      bg-[#0d1b2a]
      text-white
      px-4
      py-2
      rounded-lg
      w-full sm:w-auto
    "
  >
    {imageDownloaded
      ? "✓ Download gestart"
      : "Download afbeelding"}
  </button>

  <button
    onClick={downloadPackage}
    disabled={packageDownloading}
    className="
      bg-green-700
      text-white
      px-4
      py-2
      rounded-lg
      disabled:opacity-60
      w-full sm:w-auto
    "
  >
    {packageDownloading
      ? "Pakket maken..."
      : packageDownloaded
      ? "✓ Download gestart"
      : "Download activatiepakket"}
  </button>

</div>

  </div>

)}

        </>
)}

</div>

    </main>
  );
}