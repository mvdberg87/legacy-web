"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ThumbsUp, X } from "lucide-react";

// --- Dummy data (replace with Supabase fetch later) ---
const JOBS = [
  {
    id: "1",
    title: "Accountmanager B2B",
    sponsor_name: "Blue10",
    location: "Delft",
    tags: ["Fulltime", "Sales"],
    description:
      "Bouw mee aan groei bij Blue10. Je onderhoudt relaties, signaleert kansen en sluit deals.",
    apply_url: "https://blue10.com/vacatures/accountmanager",
    sponsor_url: "https://blue10.com",
    logo_url:
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg",
  },
  {
    id: "2",
    title: "Marketing Specialist",
    sponsor_name: "Dopper",
    location: "Haarlem/Hybrid",
    tags: ["Parttime", "Marketing"],
    description:
      "Versterk Dopper's merk met campagnes rond duurzaamheid en community.",
    apply_url: "https://dopper.com/nl/jobs/marketing-specialist",
    sponsor_url: "https://dopper.com",
    logo_url:
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg",
  },
  {
    id: "3",
    title: "Junior Controller",
    sponsor_name: "Regal Rexnord",
    location: "Rotterdam",
    tags: ["Fulltime", "Finance"],
    description:
      "Ondersteun het finance team met analyses, rapportages en optimalisaties.",
    apply_url: "https://www.regalrexnord.com/careers",
    sponsor_url: "https://www.regalrexnord.com",
    logo_url:
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg",
  },
];

// --- Swipe Card ---
function SwipeCard({ job, onLike, onPass }: { job: any; onLike: () => void; onPass: () => void }) {
  const [exitX, setExitX] = useState<number | undefined>(undefined);

  return (
    <motion.div
      key={job.id}
      className="relative w-full max-w-xl mx-auto"
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ x: exitX, opacity: 0, rotate: exitX ? (exitX > 0 ? 12 : -12) : 0 }}
    >
      <motion.div
        drag="x"
        onDragEnd={(_, info) => {
          if (info.offset.x > 140) {
            setExitX(500);
            onLike();
          } else if (info.offset.x < -140) {
            setExitX(-500);
            onPass();
          }
        }}
        className="rounded-2xl shadow-lg bg-white p-5 border"
      >
        <div className="flex items-center gap-3">
          <img src={job.logo_url} alt="logo" className="h-10 w-10 rounded" />
          <div>
            <h3 className="text-lg font-semibold leading-tight">{job.title}</h3>
            <p className="text-sm opacity-70">{job.sponsor_name} • {job.location}</p>
          </div>
        </div>
        <p className="mt-3 text-sm opacity-90 line-clamp-4">{job.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {job.tags?.map((t: string) => (
            <span key={t} className="px-2 py-1 rounded-full text-xs border">{t}</span>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={() => {
              setExitX(-500);
              onPass();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border"
          >
            <X size={18} /> Overslaan
          </button>
          <a
            href={job.apply_url}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              setExitX(500);
              onLike();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white"
          >
            <ThumbsUp size={18} /> Bekijk & solliciteer
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Main MVP page ---
export default function LegacySwipeAndList() {
  const [index, setIndex] = useState(0);
  const current = JOBS[index];

  const handleLike = () => {
    // TODO: call /api/swipe {direction:"like"}
    setIndex((i) => i + 1);
  };
  const handlePass = () => {
    // TODO: call /api/swipe {direction:"pass"}
    setIndex((i) => i + 1);
  };

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

      {/* Swipe deck */}
      <section className="max-w-6xl mx-auto px-4 pt-6">
        <h2 className="text-xl font-semibold mb-3">Swipe door vacatures</h2>
        <div className="relative min-h-[380px] flex items-start">
          <div className="w-full">
            <AnimatePresence mode="popLayout">
              {current ? (
                <SwipeCard key={current.id} job={current} onLike={handleLike} onPass={handlePass} />
              ) : (
                <div className="max-w-xl mx-auto p-10 text-center bg-white border rounded-2xl shadow">
                  <p className="text-lg font-medium">Je bent helemaal bij 🎉</p>
                  <p className="text-sm opacity-70">Nieuwe vacatures verschijnen hier automatisch.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Divider & CTA text */}
      <section className="max-w-6xl mx-auto px-4 mt-8">
        <div className="rounded-xl bg-white border p-4">
          <p className="text-sm">Liever direct de vacatures doornemen?</p>
        </div>
      </section>

      {/* List of all jobs */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {JOBS.map((job) => (
            <a
              key={job.id}
              href={job.apply_url}
              target="_blank"
              rel="noreferrer"
              className="group block rounded-2xl bg-white border hover:shadow-md transition p-4"
            >
              <div className="flex items-center gap-3">
                <img src={job.logo_url} alt="logo" className="h-8 w-8 rounded" />
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold truncate">{job.title}</h3>
                  <p className="text-xs opacity-70 truncate">{job.sponsor_name} • {job.location}</p>
                </div>
              </div>
              <p className="mt-3 text-sm line-clamp-3 opacity-90">{job.description}</p>
              <div className="mt-3 flex items-center gap-2 text-sm">
                <ExternalLink size={16} className="opacity-70" />
                <span className="underline decoration-dotted">Naar vacaturewebsite</span>
              </div>
            </a>
          ))}
        </div>

        {/* Optional: sponsor links row */}
        <div className="mt-10">
          <h4 className="text-sm font-semibold mb-2">Sponsors</h4>
          <div className="flex flex-wrap gap-3">
            {JOBS.map((job) => (
              <a
                key={job.id + "s"}
                href={job.sponsor_url}
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
