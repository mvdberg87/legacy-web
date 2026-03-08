"use client";

import Script from "next/script";

const GA_ID = "G-4W0DLDRY34";

export default function GoogleAnalytics() {
  if (typeof window === "undefined") return null;

  const consent = localStorage.getItem("cookie_consent");
  if (consent !== "accepted") return null;

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
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}