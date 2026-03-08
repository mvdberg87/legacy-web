"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export default function Leadinfo() {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookie_consent");
    if (cookieConsent === "accepted") {
      setConsent(true);
    }
  }, []);

  if (!consent) return null;

  return (
    <Script
      id="leadinfo"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
(function(l,e,a,d,i,n,f,o){if(!l[i]){
l.GlobalLeadinfoNamespace=l.GlobalLeadinfoNamespace||[];
l.GlobalLeadinfoNamespace.push(i);l[i]=function(){
(l[i].q=l[i].q||[]).push(arguments)};
n=e.createElement(a);f=e.getElementsByTagName(a)[0];
n.async=1;n.src=d;f.parentNode.insertBefore(n,f);
}})(window,document,"script","https://cdn.leadinfo.net/ping.js","leadinfo");
leadinfo("init","LI-69ADD5BB8FEE0");
`,
      }}
    />
  );
}