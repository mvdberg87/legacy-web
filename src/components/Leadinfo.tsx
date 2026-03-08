"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Leadinfo() {
  const [consent, setConsent] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookie_consent");
    if (cookieConsent === "accepted") {
      setConsent(true);
    }
  }, []);

  // Alleen deze routes tracken
  const isAllowed =
    pathname === "/" ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/verenigingen");

  if (!consent || !isAllowed) return null;

  return (
    <Script
      id="leadinfo"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
(function(l,e,a,d,i,n,f,o){
if(!l[i]){
l.GlobalLeadinfoNamespace=l.GlobalLeadinfoNamespace||[];
l.GlobalLeadinfoNamespace.push(i);
l[i]=function(){(l[i].q=l[i].q||[]).push(arguments)};
l[i].t=l[i].t||n;
f=e.createElement(a);
o=e.getElementsByTagName(a)[0];
f.async=1;
f.src=d;
o.parentNode.insertBefore(f,o);
}
}(window,document,'script','https://tracking.leadinfo.com/track.js','leadinfo','LI-69ADD5BB8FEE0'));
        `,
      }}
    />
  );
}