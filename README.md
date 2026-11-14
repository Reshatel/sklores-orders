# Glass Unit Orders

SSR app for browsing insulated glass unit orders. Trainee Frontend test task.

**Stack:** React 19, TypeScript, TanStack Start, TanStack Router, TanStack Query, Mantine, Tailwind CSS, Zod.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Script | What it does |
| --- | --- |
| `npm run dev` | dev server with SSR |
| `npm run build` | production build (Nitro) |
| `npm run start` | run the production build with Node |
| `npm run typecheck` | TypeScript check |

`API_FAILURE_RATE=1 npm run dev` simulates API errors (0–1 = failure chance).

## Why TanStack Start

It is the stack the team uses. Type-safe routes and search params make URL-synced filters simple, and server functions run the same code during SSR and client navigation.

## Server vs client

- **Server:** first HTML of every page with data already loaded and filtered, real HTTP 404 for unknown orders and pages, reading `orders.json`, filtering, creating orders, the 300–800 ms delay.
- **Client:** navigation after the first load, debounced search, status filter and sorting (all synced to the URL), loading / error / empty states, live price in the form, theme switch.

## Data fetching

`orders.json` lives in `src/server/data` and is imported only by `src/server/orders.server.ts`, so it never reaches the browser bundle.

- `GET /api/orders?q=&status=` and `GET /api/orders/:id` (404 if missing) are for external clients.
- Pages use server functions (`createServerFn`) that call the same `findOrders` / `findOrderById`: no HTTP call from the server to itself, typed results, Zod-validated input.

## Pricing

Calculated in integers (mm² and kopecks) to avoid float errors. Billable area per piece is at least 0.5 m². Each item is rounded to kopecks, then summed (order 1016 = 7 837.26 UAH).

## New order form

Validated with one Zod schema in the form and on the server. The phone field accepts any common Ukrainian format and saves `+380XXXXXXXXX`.

**Storage:** in server memory. Limits: orders disappear on restart, `orders.json` is not changed, and on serverless hosting (Vercel) each instance has its own memory, so a new order may not be visible on the next request.

## Deploy

Built with Nitro, which outputs the Vercel format automatically. On Vercel: build command `npm run build`, output directory empty.

## Testing

Manual test plan: [TESTING.md](./TESTING.md).
