import { NextResponse, type NextRequest } from "next/server";
import { stripe, STRIPE_PRICE_IDS } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { plan } = (await request.json()) as { plan: "mensal" | "vitalicio" };
  if (plan !== "mensal" && plan !== "vitalicio") {
    return NextResponse.json({ error: "Plano inválido." }, { status: 400 });
  }

  const priceId = STRIPE_PRICE_IDS[plan];
  if (!priceId) {
    console.error(`STRIPE_PRICE_${plan.toUpperCase()} não está configurado.`);
    return NextResponse.json(
      { error: "Assinatura ainda não configurada. Tente novamente mais tarde." },
      { status: 500 },
    );
  }

  try {
    const service = createServiceClient();
    const { data: subscription } = await service
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    let customerId = subscription?.stripe_customer_id ?? undefined;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;
      await service
        .from("subscriptions")
        .update({ stripe_customer_id: customerId })
        .eq("user_id", user.id);
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: plan === "mensal" ? "subscription" : "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: { user_id: user.id, plan },
      success_url: `${siteUrl}/assinatura?status=sucesso`,
      cancel_url: `${siteUrl}/assinatura?status=cancelado`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Erro ao criar checkout do Stripe:", err);
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json(
      { error: `Não foi possível iniciar o pagamento: ${message}` },
      { status: 500 },
    );
  }
}
