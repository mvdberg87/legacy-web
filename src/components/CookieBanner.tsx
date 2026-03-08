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
          Sponsorjobs gebruikt cookies om de website goed te laten functioneren
          en om inzicht te krijgen in het gebruik van het platform. 
          Lees meer in onze{" "}
          <a href="/privacy" className="underline font-medium">
            privacyverklaring
          </a>.
        </p>

        <div className="flex gap-3">
          <button
            onClick={rejectCookies}
            className="px-4 py-2 text-sm border rounded-lg"
          >
            Weigeren
          </button>

          <button
            onClick={acceptCookies}
            className="px-4 py-2 text-sm bg-black text-white rounded-lg"
          >
            Accepteren
          </button>
        </div>
      </div>
    </div>
  );
}