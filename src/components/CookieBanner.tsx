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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
      <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row items-center gap-4 justify-between">

        <p className="text-sm text-gray-700">
          SponsorJobs gebruikt functionele cookies om het platform goed te laten
          werken en analytische cookies om inzicht te krijgen in het gebruik van
          het platform, zoals pageviews en klikken op vacatures. Deze gegevens
          helpen ons om het platform te verbeteren. Lees meer in onze{" "}
          <a href="/privacy" className="underline font-medium">
            privacy- en cookieverklaring
          </a>.
        </p>

        <div className="flex gap-3">

          <button
            onClick={rejectCookies}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Weigeren
          </button>

          <button
            onClick={acceptCookies}
            className="px-4 py-2 text-sm bg-[#0d1b2a]text-white rounded-lg hover:bg-gray-800"
          >
            Accepteren
          </button>

        </div>
      </div>
    </div>
  );
}