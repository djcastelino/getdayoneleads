declare module "next-pwa" {
  type NextConfig = import("next").NextConfig;

  export interface RuntimeCaching {
    urlPattern: RegExp | string;
    handler?:
      | "CacheFirst"
      | "NetworkFirst"
      | "NetworkOnly"
      | "StaleWhileRevalidate"
      | "CacheOnly";
    method?: "GET" | "POST" | "PUT" | "DELETE" | "HEAD";
    options?: {
      cacheName?: string;
      expiration?: {
        maxAgeSeconds?: number;
        maxEntries?: number;
      };
      cacheableResponse?: {
        statuses?: number[];
        headers?: Record<string, string>;
      };
      networkTimeoutSeconds?: number;
      matchOptions?: {
        ignoreSearch?: boolean;
        ignoreMethod?: boolean;
        ignoreVary?: boolean;
      };
    };
  }

  export interface WithPWAOptions {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
    runtimeCaching?: RuntimeCaching[];
    buildExcludes?: RegExp[];
    fallbacks?: Record<string, string>;
  }

  type WithPWA = (options?: WithPWAOptions) => (nextConfig?: NextConfig) => NextConfig;

  const withPWA: WithPWA;
  export default withPWA;
}
