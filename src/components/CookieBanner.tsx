"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
const [marketing, setMarketing] = useState(false);

  useEffect(() => {
  const loadPreferences = () => {
    const consent = localStorage.getItem("cookie_consent");

    if (!consent) {
      setVisible(true);
    }

    const preferences = localStorage.getItem("cookie_preferences");

    if (preferences) {
      try {
        const parsed = JSON.parse(preferences);

        setAnalytics(!!parsed.analytics);
        setMarketing(!!parsed.marketing);
      } catch {
        console.warn("Cookievoorkeuren konden niet worden geladen.");
      }
    }
  };

  const openCookieSettings = () => {
    loadPreferences();
    setVisible(true);
    setShowSettings(true);
  };

  loadPreferences();

  window.addEventListener("openCookieSettings", openCookieSettings);

  return () => {
    window.removeEventListener("openCookieSettings", openCookieSettings);
  };
}, []);

  function acceptCookies() {
  setAnalytics(true);
  setMarketing(true);

  localStorage.setItem("cookie_consent", "accepted");

  localStorage.setItem(
    "cookie_preferences",
    JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
    })
  );

  setVisible(false);

  window.dispatchEvent(new Event("cookiePreferencesUpdated"));
}

  function rejectCookies() {
  setAnalytics(false);
  setMarketing(false);

  localStorage.setItem("cookie_consent", "rejected");

  localStorage.setItem(
    "cookie_preferences",
    JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
    })
  );

  setVisible(false);

  window.dispatchEvent(new Event("cookiePreferencesUpdated"));
}

function savePreferences(
  analyticsAllowed: boolean,
  marketingAllowed: boolean
) {
  localStorage.setItem("cookie_consent", "custom");

  localStorage.setItem(
    "cookie_preferences",
    JSON.stringify({
      necessary: true,
      analytics: analyticsAllowed,
      marketing: marketingAllowed,
    })
  );

  setVisible(false);

  window.dispatchEvent(new Event("cookiePreferencesUpdated"));
}

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white text-gray-800 border-t border-gray-200 shadow-xl">
  <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row items-start gap-4 md:gap-6 justify-between">

    <div className="text-sm w-full md:max-w-3xl">

  {!showSettings ? (
    <p className="text-center md:text-left">
      Sponsorjobs gebruikt cookies om het platform goed te laten werken en het
      gebruik te analyseren.{" "}
      <a href="/cookies" className="underline font-medium">
        Lees meer
      </a>
    </p>
  ) : (
    <div className="space-y-5">

      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold">
              Noodzakelijke cookies
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Nodig om Sponsorjobs veilig en correct te laten werken.
            </p>
          </div>

          <span className="text-xs font-semibold bg-gray-200 rounded-full px-3 py-1">
            Altijd actief
          </span>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <label className="flex justify-between items-center cursor-pointer">
          <div>
            <h3 className="font-semibold">
              Analytische cookies
            </h3>

            <p className="text-gray-600 text-sm mt-1">
              Helpen ons Sponsorjobs te verbeteren.
            </p>
          </div>

          <input
  type="checkbox"
  checked={analytics}
  onChange={() => setAnalytics(!analytics)}
  className="h-5 w-5 rounded border-gray-300 accent-[#0d1b2a]"
/>
        </label>
      </div>

      <div className="border rounded-lg p-4">
        <label className="flex justify-between items-center cursor-pointer">
          <div>
            <h3 className="font-semibold">
              Marketingcookies
            </h3>

            <p className="text-gray-600 text-sm mt-1">
              Voor Leadinfo en toekomstige campagnes.
            </p>
          </div>

          <input
            type="checkbox"
            checked={marketing}
            onChange={() => setMarketing(!marketing)}
            className="h-5 w-5 rounded border-gray-300 accent-[#0d1b2a]"
          />
        </label>
      </div>
      <div className="pt-2">
  <button
    onClick={() => savePreferences(analytics, marketing)}
    className="w-full rounded-lg bg-[#0d1b2a] px-4 py-3 font-medium text-white hover:opacity-90 transition"
  >
    Voorkeuren opslaan
  </button>
</div>

    </div>
  )}

</div>
    <div className="flex flex-wrap gap-3 w-full md:w-auto justify-center md:justify-end">

  <button
  onClick={() => setShowSettings(!showSettings)}
  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition"
>
  {showSettings ? "Terug" : "Cookie-instellingen"}
</button>

  {!showSettings && (
  <>
    <button
      onClick={rejectCookies}
      className="px-4 py-2 text-sm bg-gray-100 text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-200 transition"
    >
      Alleen noodzakelijke
    </button>

    <button
      onClick={acceptCookies}
      className="px-4 py-2 text-sm bg-[#0d1b2a] text-white rounded-lg hover:opacity-90 transition"
    >
      Alles accepteren
    </button>
  </>
)}

</div>
  </div>
</div>
  );
}