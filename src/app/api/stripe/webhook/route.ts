import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe, STRIPE_PRICE_IDS } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/service";

function planFromPriceId(priceId: string | undefined): "mensal" | "vitalicio" | null {
  if (priceId === STRIPE_PRICE_IDS.mensal) return "mensal";
  if (priceId === STRIPE_PRICE_IDS.vitalicio) return "vitalicio";
  return null;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Assinatura ausente." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json(
      { error: `Assinatura inválida: ${message}` },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      if (!userId) break;

      if (session.mode === "subscription" && session.subscription) {
        const stripeSub = await stripe.subscriptions.retrieve(
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id,
        );
        const priceId = stripeSub.items.data[0]?.price.id;
        const plan = planFromPriceId(priceId) ?? "mensal";
        const periodEndSeconds = stripeSub.items.data[0]?.current_period_end;

        await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            plan,
            status: "active",
            stripe_customer_id:
              typeof session.customer === "string" ? session.customer : session.customer?.id,
            stripe_subscription_id: stripeSub.id,
            current_period_end: periodEndSeconds
              ? new Date(periodEndSeconds * 1000).toISOString()
              : null,
          },
          { onConflict: "user_id" },
        );
      } else if (session.mode === "payment") {
        await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            plan: "vitalicio",
            status: "active",
            stripe_customer_id:
              typeof session.customer === "string" ? session.customer : session.customer?.id,
            current_period_end: null,
          },
          { onConflict: "user_id" },
        );
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const stripeSub = event.data.object as Stripe.Subscription;
      const userId = stripeSub.metadata?.user_id;
      const customerId =
        typeof stripeSub.customer === "string" ? stripeSub.customer : stripeSub.customer.id;

      const status = stripeSub.status === "active" ? "active"
        : stripeSub.status === "past_due" ? "past_due"
        : stripeSub.status === "canceled" ? "canceled"
        : "incomplete";

      const periodEndSeconds = stripeSub.items.data[0]?.current_period_end;
      const priceId = stripeSub.items.data[0]?.price.id;
      const plan = planFromPriceId(priceId);

      const match = userId
        ? { user_id: userId }
        : { stripe_customer_id: customerId };

      await supabase
        .from("subscriptions")
        .update({
          status,
          ...(plan ? { plan } : {}),
          current_period_end: periodEndSeconds
            ? new Date(periodEndSeconds * 1000).toISOString()
            : null,
        })
        .match(match);
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
