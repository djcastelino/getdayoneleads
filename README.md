## Lead Radar PWA

Lead Radar surfaces USAspending awards for North Carolina the moment they post. The UI matches the Product Design Authority spec: hero dashboard, timeline grid, detail drawer, insights, and Stripe-powered upgrades.

### Tech Stack

- Next.js App Router (server actions for data + Stripe sessions)
- Tailwind CSS 4 with design tokens for the navy/teal/orange palette
- SWR for client-side caching and optimistic filter switches
- next-pwa for offline cache of the latest lead payloads
- Recharts for trade insights, custom heatmap for county intensity
- Stripe Checkout for premium alert upgrades

### Getting Started

1. Install dependencies:
	```bash
	npm install
	```
2. Copy environment variables:
	```bash
	cp .env.example .env.local
	```
3. Fill the required values:
	- `N8N_NC_LEADS_URL`: n8n webhook that returns `{ count, leads[] }`
	- `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
	- `NEXT_PUBLIC_APP_URL`: base URL for Stripe callbacks (defaults to http://localhost:3000)
4. Start the dev server:
	```bash
	npm run dev
	```
5. Visit [http://localhost:3000/lead-radar](http://localhost:3000/lead-radar).

### Key Paths

- `src/app/(app)/lead-radar/page.tsx`: server entry for the dashboard
- `src/app/(app)/lead-radar/lead-radar-client.tsx`: client orchestration (filters, SWR, drawer)
- `src/components/*`: hero cards, filters, grid, drawer, charts, alerts sidebar
- `src/app/(app)/lead-radar/actions.ts`: server actions for lead fetch + Stripe checkout
- `src/app/api/leads/route.ts`: SWR-friendly API proxy hitting the n8n webhook
- `next.config.ts`: next-pwa configuration and caching strategy

### PWA Notes

- Service worker caches `/api/leads` payloads for offline viewing.
- `NotifyFab` exposes mobile-first alerts and quick filter toggles.
- Provide real PNG icons in `public/icons/` before shipping to production.

### Stripe Testing

- Use Stripe test keys (`sk_test_...`, `pk_test_...`).
- Add a recurring price in your Stripe dashboard and drop the ID into `STRIPE_PRICE_ID`.
- Click “Upgrade with Stripe” to generate a checkout session; dev mode redirects in a new tab.

### Future Enhancements

- Replace fallback notify queue with Workbox Background Sync for offline share/email actions.
- Wire “Manage” links in Alerts sidebar to persisted preferences (Supabase/Redis).
- Populate detail drawer contacts once award metadata includes POC fields.
