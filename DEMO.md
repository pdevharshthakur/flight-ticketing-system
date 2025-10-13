# Demo: Search and Book a Flight

This guide shows a clean, repeatable demo of searching and booking a flight from DEL → BOM on 20 Oct 2025.

## 1) Reset and seed the project

Use pnpm and Turbo to fully reset the DB and rebuild apps.

```bash
pnpm i
pnpm reset
```

What this does:
- Resets SQLite via Prisma migrate reset and seeds demo data.
- Cleans and rebuilds the server and web apps.

## 2) Start the apps

In separate terminals (or background panes):

```bash
pnpm --filter server dev
```

```bash
pnpm --filter web dev
```

Defaults:
- API: `http://localhost:3001`
- Web: `http://localhost:3000`

Ensure `NEXT_PUBLIC_API_URL` in the web app points to the API (defaults to `http://localhost:3001`).

## 3) Run the search

Open the web app and go to Search. Use:
- From: `DEL`
- To: `BOM`
- Date: `2025-10-20`

Submit the search. You should see matching flights with price and availability.

## 4) Book a flight (demo)

Click the "Book" button on any result:
- A processing screen shows for ~3 seconds.
- You are redirected to a confirmation page with booking reference, seats, and itinerary.

Notes:
- Bookings are stored under the demo user: `test@example.com`.
- Seats and reference are generated for demonstration.

## 5) Verify in My Trips

Navigate to `My Trips`:
- You should see the new booking listed as upcoming for `test@example.com`.

If needed, re-run `pnpm reset` to return the project to the initial demo state.


