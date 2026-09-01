import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/subscription";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { AdSlot } from "@/components/ads/ad-slot";

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const subscription = await getSubscription();

  return (
    <div className="flex min-h-screen flex-1 flex-col md:h-screen md:flex-row md:overflow-hidden">
      <Sidebar isPremium={subscription.isPremium} />
      <div className="flex flex-1 flex-col md:h-screen md:overflow-y-auto">
        <MobileNav />
        <main className="flex-1 bg-background px-4 py-5 pb-20 md:px-8 md:py-6 md:pb-6">
          {children}
          <div className="mx-auto mt-6 max-w-5xl">
            <AdSlot slot="painel-rodape" />
          </div>
        </main>
        <MobileTabBar />
      </div>
    </div>
  );
}
