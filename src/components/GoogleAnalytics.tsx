"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const GA_ID = "G-4W0DLDRY34";

export default function GoogleAnalytics() {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const cookieConsent = localStorage.getItem("cookie_consent");
      if (cookieConsent === "accepted") {
        setConsent(true);
      }
    };

    checkConsent();

    window.addEventListener("cookieConsentAccepted", checkConsent);

    return () => {
      window.removeEventListener("cookieConsentAccepted", checkConsent);
    };
  }, []);

  if (!consent) return null;

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