"use client";

import { ReactNode, useEffect } from "react";
import { SWRConfig } from "swr";

const swrFetcher = async (input: string): Promise<unknown> => {
  const res = await fetch(input, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${input}`);
  }

  return res.json();
};

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.catch((error) => {
        console.error("Service worker registration failed", error);
      });
    }
  }, []);

  return (
    <SWRConfig
      value={{
        fetcher: swrFetcher,
        revalidateOnFocus: false,
        dedupingInterval: 60_000,
        provider: () => new Map(),
      }}
    >
      {children}
    </SWRConfig>
  );
}
