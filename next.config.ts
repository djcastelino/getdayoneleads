import type { NextConfig } from "next";
import withPWAInit from "next-pwa";
import type { RuntimeCaching } from "next-pwa";

const runtimeCaching: RuntimeCaching[] = [
  {
    urlPattern: /\/api\/leads/,
    handler: "NetworkFirst",
    method: "GET",
    options: {
      cacheName: "lead-data",
      networkTimeoutSeconds: 5,
      expiration: {
        maxEntries: 60,
        maxAgeSeconds: 3600,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
  {
    urlPattern: /^https:\/\/(?:cdnjs|fonts\.gstatic|fonts\.googleapis)\./,
    handler: "CacheFirst",
    options: {
      cacheName: "static-assets",
      expiration: {
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      },
    },
  },
];

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching,
});

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default withPWA(nextConfig);
