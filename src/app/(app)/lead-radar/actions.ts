"use server";

import Stripe from "stripe";
import { fetchLeads, LeadsResponse, SectorKey } from "@/lib/leads";

export interface LeadsActionInput {
  sectors?: SectorKey[];
}

export async function loadLeadsAction(input: LeadsActionInput): Promise<LeadsResponse> {
  const sectors = input.sectors?.length ? Array.from(new Set(input.sectors)) : undefined;
  return fetchLeads({ sectors });
}

interface CheckoutInput {
  email?: string;
  sectors?: SectorKey[];
}

export async function createCheckoutSession(input: CheckoutInput): Promise<{ url: string }> {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!secretKey || !priceId) {
    throw new Error("Stripe environment variables are not configured.");
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2024-06-20",
  });

  const successUrl = new URL("/lead-radar?upgrade=success", appUrl).toString();
  const cancelUrl = new URL("/lead-radar?upgrade=cancel", appUrl).toString();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: input.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      sectors: input.sectors?.join(",") ?? "",
    },
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  return { url: session.url };
}

interface OutreachInput {
  awardId: string;
  action: "intro-email" | "schedule-call" | "share" | "bookmark";
  notes?: string;
}

export async function logOutreachAction(input: OutreachInput): Promise<{ ok: true }> {
  try {
    if (process.env.N8N_OUTREACH_WEBHOOK) {
      await fetch(process.env.N8N_OUTREACH_WEBHOOK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
    }
  } catch (err) {
    console.error("Failed to log outreach action", err);
  }

  return { ok: true };
}
