"use client";

import { useState, useTransition } from "react";
import { ArrowRight } from "lucide-react";
import { createCheckoutSession } from "@/app/(app)/lead-radar/actions";
import type { SectorKey } from "@/lib/leads";

interface StripeCheckoutButtonProps {
  selectedSectors: SectorKey[];
}

export function StripeCheckoutButton({ selectedSectors }: StripeCheckoutButtonProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCheckout = () => {
    startTransition(async () => {
      try {
        setError(null);
        const { url } = await createCheckoutSession({ email, sectors: selectedSectors });
        window.location.assign(url);
      } catch (err) {
        console.error(err);
        setError("Unable to start checkout. Please verify your billing setup.");
      }
    });
  };

  return (
    <div className="rounded-2xl border border-teal-400/60 bg-teal-500/10 p-5 text-sm text-teal-50">
      <p className="text-xs uppercase tracking-[0.3rem] text-teal-200">Upgrade</p>
      <h4 className="mt-2 text-lg font-semibold text-white">Unlock instant alerts</h4>
      <p className="mt-2 text-xs text-teal-100/80">
        Stripe-secured billing. Cancel anytime. Your filters sync to premium alerts automatically.
      </p>
      <label className="mt-4 flex flex-col gap-2 text-xs uppercase tracking-wide text-teal-100" htmlFor="checkout-email">
        Billing email
        <input
          id="checkout-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/60 focus:border-teal-300 focus:outline-none"
        />
      </label>
      <button
        type="button"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-400 to-teal-400 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:brightness-110"
        onClick={handleCheckout}
        disabled={isPending}
      >
        {isPending ? "Launching checkout..." : "Upgrade with Stripe"}
        <ArrowRight size={16} />
      </button>
      {error && <p className="mt-3 text-xs text-orange-200">{error}</p>}
    </div>
  );
}
