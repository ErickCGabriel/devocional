import Script from "next/script";
import { getSubscription } from "@/lib/subscription";

/**
 * Renderiza um bloco de anúncio do Google AdSense apenas para usuários do
 * plano gratuito. Assinantes premium nunca veem anúncios.
 */
export async function AdSlot({ slot }: { slot: string }) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  if (!clientId) return null;

  const { isPremium } = await getSubscription();
  if (isPremium) return null;

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-dashed border-border bg-surface/50 p-2 text-center">
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Script id={`adsbygoogle-push-${slot}`} strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </div>
  );
}
