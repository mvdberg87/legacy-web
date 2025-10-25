/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ThumbsUp, X } from "lucide-react";

type Job = {
  id: string;
  title: string;
  sponsor_name: string;
  location?: string;
  description?: string;
  apply_url: string;
  sponsor_url?: string;
  logo_url?: string;
  tags?: string[];
};

function SwipeCard({
  job,
  onLike,
  onPass,
  onClickApply,
  trackLike,
  trackPass,
}: {
  job: Job;
  onLike: () => void;
  onPass: () => void;
  onClickApply: () => void;
  trackLike: (jobId: string) => void;
  trackPass: (jobId: string) => void;
}) {
  const [exitX, setExitX] = useState<number | undefined>(undefined);
  const logo = job.logo_url || "https://placehold.co/64x64?text=Logo";

  return (
    <motion.div
      key={job.id}
      className="relative w-full max-w-xl mx-auto"
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{
        x: exitX,
        opacity: 0,
        rotate: exitX ? (exitX > 0 ? 12 : -12) : 0,
      }}
    >
      <motion.div
        drag="x"
        onDragEnd={(_, info) => {
          if (info.offset.x > 140) {
            trackLike(job.id);
            setExitX(500);
            onLike();
          } else if (info.offset.x < -140) {
            trackPass(job.id);
            setExitX(-500);
            onPass();
          }
        }}
        className="rounded-2xl shadow-lg bg-white p-5 border"
      >
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt=""
            className="h-10 w-10 rounded object-contain"
            loading="lazy"
          />
          <div>
            <h3 className="text-lg font-semibold leading-tight">{job.title}</h3>
            <p className="text-sm opacity-70">
              {job.sponsor_name}
              {job.location ? ` • ${job.location}` : ""}
            </p>
          </div>
        </div>

        {job.description && (
          <p className="mt-3 text-sm opacity-90 line-clamp-4">
            {job.description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {job.tags?.map((t) => (
            <span
              key={t}
              className="px-2 py-1 rounded-full text-xs border border-gray-300"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={() => {
              trackPass(job.id);
              setExitX(-500);
              onPass();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
          >
            <X size={18} /> Overslaan
          </button>

          <a
            href={job.apply_url}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              onClickApply();
              trackLike(job.id);
              setExitX(500);
              onLike();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition"
          >
            <ThumbsUp size={18} /> Bekijk & solliciteer
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LegacySwipeAndList({
  initialJobs,
  club_id,
}: {
  initialJobs: Job[];
  club_id?: string;
}) {
  // ---------- TAG-FILTER ----------
  const uniqueTags = useMemo(() => {
    const set = new Set<string>();
    for (const j of initialJobs) (j.tags ?? []).forEach((t) => set.add(t));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [initialJobs]);

  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredJobs = useMemo(() => {
    if (!selectedTag) return initialJobs;
    return initialJobs.filter((j) => (j.tags ?? []).includes(selectedTag));
  }, [initialJobs, selectedTag]);

  // ---------- SWIPE-STATE ----------
  const [index, setIndex] = useState(0);
  const current = filteredJobs[index];

  useEffect(() => {
    setIndex(0);
  }, [selectedTag]);

  // ---------- TRACKING ----------
  async function track(payload: {
    club_id?: string;
    job_id?: string;
    action: "click" | "like" | "pass" | "view";
  }) {
    try {
      await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.warn("Track failed", e);
    }
  }

  const trackLike = (jobId: string) =>
    track({ club_id, job_id: jobId, action: "like" });
  const trackPass = (jobId: string) =>
    track({ club_id, job_id: jobId, action: "pass" });
  const trackClick = (jobId: string) =>
    track({ club_id, job_id: jobId, action: "click" });

  const handleLike = () => setIndex((i) => i + 1);
  const handlePass = () => setIndex((i) => i + 1);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-black" />
            <span className="font-semibold">Legacy</span>
          </div>
          <nav className="text-sm opacity-80">Beta MVP</nav>
        </div>
      </header>

      {/* Swipe Section */}
      <section className="max-w-6xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Swipe door vacatures</h2>

          {/* Tag-filter knoppen */}
          {uniqueTags.length > 0 && (
            <div className="flex flex-wrap gap-2 text-sm">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 rounded-full border ${
                  selectedTag === null
                    ? "bg-black text-white"
                    : "hover:bg-gray-50"
                }`}
              >
                Alle
              </button>
              {uniqueTags.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTag(t)}
                  className={`px-3 py-1 rounded-full border ${
                    selectedTag === t ? "bg-black text-white" : "hover:bg-gray-50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative min-h-[380px] flex items-start">
          <div className="w-full">
            <AnimatePresence mode="popLayout">
              {current ? (
                <SwipeCard
                  key={current.id}
                  job={current}
                  onLike={handleLike}
                  onPass={handlePass}
                  onClickApply={() => trackClick(current.id)}
                  trackLike={trackLike}
                  trackPass={trackPass}
                />
              ) : selectedTag ? (
                <div className="max-w-xl mx-auto p-10 text-center bg-white border rounded-2xl shadow">
                  <p className="text-lg font-medium">
                    Geen vacatures met tag “{selectedTag}”.
                  </p>
                  <p className="text-sm opacity-70 mt-1">
                    Kies een andere tag of toon{" "}
                    <button
                      className="underline"
                      onClick={() => setSelectedTag(null)}
                    >
                      alle vacatures
                    </button>
                    .
                  </p>
                </div>
              ) : (
                <div className="max-w-xl mx-auto p-10 text-center bg-white border rounded-2xl shadow">
                  <p className="text-lg font-medium">Je bent helemaal bij 🎉</p>
                  <p className="text-sm opacity-70">
                    Nieuwe vacatures verschijnen hier automatisch.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Job List */}
      <section className="max-w-6xl mx-auto px-4 mt-8">
        <div className="rounded-xl bg-white border p-4 mb-4">
          <p className="text-sm">
            Liever direct de vacatures doornemen?
            {selectedTag && (
              <>
                {" "}
                <span className="px-2 py-0.5 rounded-full border text-xs">
                  Filter: {selectedTag}
                </span>{" "}
                <button
                  className="text-xs underline ml-2"
                  onClick={() => setSelectedTag(null)}
                >
                  wissen
                </button>
              </>
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => {
            const logo = job.logo_url || "https://placehold.co/64x64?text=Logo";
            return (
              <a
                key={job.id}
                href={job.apply_url}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackClick(job.id)}
                className="group block rounded-2xl bg-white border hover:shadow-md transition p-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={logo}
                    alt=""
                    className="h-8 w-8 rounded object-contain"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold truncate">
                      {job.title}
                    </h3>
                    <p className="text-xs opacity-70 truncate">
                      {job.sponsor_name}
                      {job.location ? ` • ${job.location}` : ""}
                    </p>
                  </div>
                </div>
                {job.description && (
                  <p className="mt-3 text-sm line-clamp-3 opacity-90">
                    {job.description}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <ExternalLink size={16} className="opacity-70" />
                  <span className="underline decoration-dotted">
                    Naar vacaturewebsite
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-10">
          <h4 className="text-sm font-semibold mb-2">Sponsors</h4>
          <div className="flex flex-wrap gap-3">
            {filteredJobs.map((job) => (
              <a
                key={job.id + "_s"}
                href={job.sponsor_url ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="text-sm underline decoration-dotted"
              >
                {job.sponsor_name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 text-xs opacity-70">
          © {new Date().getFullYear()} Legacy — legacy.eu
        </div>
      </footer>
    </div>
  );
}
