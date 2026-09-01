import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Lora, Caveat } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meu Devocional",
  description:
    "Seu devocional diário online: versículo, reflexão, oração e sequência de dias com Deus.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let theme = "feminino";

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("theme")
        .eq("id", user.id)
        .single();
      if (profile?.theme) theme = profile.theme;
    }
  } catch {
    // ambiente sem Supabase configurado ainda (ex.: primeiro build) — usa tema padrão
  }

  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html
      lang="pt-BR"
      data-theme={theme}
      className={`${inter.variable} ${lora.variable} ${caveat.variable} h-full antialiased`}
    >
      {adsenseClientId && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      )}
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
