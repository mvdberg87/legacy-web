"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Leadinfo() {
  const [enabled, setEnabled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkPreferences = () => {
      const preferences = localStorage.getItem("cookie_preferences");

      if (!preferences) {
        setEnabled(false);
        return;
      }

      try {
        const parsed = JSON.parse(preferences);
        setEnabled(!!parsed.marketing);
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

  // Alleen marketingpagina's
  const isAllowed =
    pathname === "/" ||
    pathname?.startsWith("/signup") ||
    pathname?.startsWith("/verenigingen");

  if (!enabled || !isAllowed) return null;

  return (
    <Script
      id="leadinfo-script"
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
f.src='https://cdn.leadinfo.net/ping.js';
o.parentNode.insertBefore(f,o);
}
}(window,document,'script','https://cdn.leadinfo.net/ping.js','leadinfo','LI-69ADD5BB8FEE0'));
        `,
      }}
    />
  );
}