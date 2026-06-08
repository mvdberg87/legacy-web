"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ClubNavbar from "@/components/club/ClubNavbar";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

type Job = {
  id: string;
  title: string;
  company_name: string;
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

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      const { data: club } =
        await supabase
          .from("clubs")
          .select("id")
          .eq("slug", slug)
          .single();

      if (!club) {
        setLoading(false);
        return;
      }

      const { data: jobsData } =
        await supabase
          .from("jobs")
          .select(`
            id,
            title,
            company_name
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
        companyName:
          job?.company_name,

        jobTitle:
          job?.title,

        platform: activationType,

        tone,
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

            <button
  onClick={generatePost}
              className="
                bg-[#0d1b2a]
                text-white
                px-6
                py-3
                rounded-lg
                hover:opacity-90
              "
            >
              {generating
  ? "Genereren..."
  : "Genereer post"}
            </button>

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

  </div>
        )}

        </>
)}

</div>

    </main>
  );
}