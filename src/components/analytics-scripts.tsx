import Script from "next/script";

/**
 * Optional analytics.
 * Vercel env: NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXX
 */
export function AnalyticsScripts() {
  const ga = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!ga) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${ga}', { send_page_view: true });
        `}
      </Script>
    </>
  );
}
