import { NextResponse, type NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const service = createServiceClient();
  const { data: subscription } = await service
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!subscription?.stripe_customer_id) {
    return NextResponse.json(
      { error: "Nenhuma assinatura encontrada." },
      { status: 400 },
    );
  }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${siteUrl}/assinatura`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Erro ao abrir o portal do Stripe:", err);
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json(
      { error: `Não foi possível abrir o portal: ${message}` },
      { status: 500 },
    );
  }
}
