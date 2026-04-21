"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");

    if (!consent) {
      setVisible(true);
    }
  }, []);

  function acceptCookies() {
    localStorage.setItem("cookie_consent", "accepted");

    setVisible(false);

    // Event zodat scripts (Leadinfo / GA) direct kunnen laden
    window.dispatchEvent(new Event("cookieConsentAccepted"));
  }

  function rejectCookies() {
    localStorage.setItem("cookie_consent", "rejected");

    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white text-gray-800 border-t border-gray-200 shadow-xl">
  <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row items-center gap-4 md:gap-6 justify-between">

    <p className="text-sm w-full md:w-auto text-center md:text-left">
  Sponsorjobs gebruikt cookies om het platform goed te laten werken en het gebruik te analyseren.{" "}
  <a href="/cookies" className="underline font-medium">
    Lees meer
  </a>
</p>

    <div className="flex gap-3 w-full md:w-auto justify-center md:justify-end">

      <button
        onClick={rejectCookies}
        className="px-4 py-2 text-sm bg-gray-100 text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-200 transition"
      >
        Alleen noodzakelijke cookies 
      </button>

      <button
        onClick={acceptCookies}
        className="px-4 py-2 text-sm bg-[#0d1b2a] text-white rounded-lg hover:opacity-90 transition"
      >
        Alles accepteren
      </button>

    </div>
  </div>
</div>
  );
}