"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const GA_ID = "G-4W0DLDRY34";

export default function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const checkPreferences = () => {
      const preferences = localStorage.getItem("cookie_preferences");

      if (!preferences) {
        setEnabled(false);
        return;
      }

      try {
        const parsed = JSON.parse(preferences);
        setEnabled(!!parsed.analytics);
      } catch {
        setEnabled(false);
      }
    };

    checkPreferences();

    window.addEventListener(
      "cookiePreferencesUpdated",
      checkPreferences
    );

    return () => {
      window.removeEventListener(
        "cookiePreferencesUpdated",
        checkPreferences
      );
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_ID}', {
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  );
}