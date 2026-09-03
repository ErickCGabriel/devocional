import "server-only";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-08-26.dahlia",
  typescript: true,
});

export const STRIPE_PRICE_IDS = {
  mensal: process.env.STRIPE_PRICE_MENSAL!,
  anual: process.env.STRIPE_PRICE_ANUAL!,
  vitalicio: process.env.STRIPE_PRICE_VITALICIO!,
} as const;
