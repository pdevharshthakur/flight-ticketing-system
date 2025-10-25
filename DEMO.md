# Demo: Search and Book a Flight

This guide shows a clean, repeatable demo of searching and booking flights using the December 2025 flight data.

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

Open the web app and go to Search. Here are successful search examples:

### Popular Routes with Multiple Options:

#### **DEL → BOM (Multiple flights available)**
- From: `DEL`
- To: `BOM` 
- Date: `2025-12-01`
- **Expected:** 2 flights (AI1201 at 6:00 AM, 6E1202 at 9:00 AM)

#### **BOM → BLR (Multiple flights available)**
- From: `BOM`
- To: `BLR`
- Date: `2025-12-15` 
- **Expected:** 1 flight (6E1222 at 9:00 AM)

#### **BLR → MAA (Multiple flights available)**
- From: `BLR`
- To: `MAA`
- Date: `2025-12-22`
- **Expected:** 1 flight (SG1233 at 2:00 PM)

### Other Successful Search Dates:
- **December 1, 2025:** DEL→BOM, BOM→BLR, BLR→MAA, MAA→HYD, HYD→CCU
- **December 5, 2025:** HYD→CCU, CCU→AMD, AMD→PNQ, PNQ→COK, COK→GOI
- **December 8, 2025:** GOI→DEL, DEL→BLR, BLR→MAA, MAA→HYD, HYD→CCU
- **December 12, 2025:** CCU→AMD, AMD→PNQ, PNQ→COK, COK→GOI, GOI→DEL
- **December 15, 2025:** DEL→BOM, BOM→BLR, BLR→MAA, MAA→HYD, HYD→CCU
- **December 18, 2025:** CCU→AMD, AMD→PNQ, PNQ→COK, COK→GOI, GOI→DEL
- **December 22, 2025:** DEL→BOM, BOM→BLR, BLR→MAA, MAA→HYD, HYD→CCU
- **December 25, 2025:** CCU→AMD, AMD→PNQ, PNQ→COK, COK→GOI, GOI→DEL
- **December 28, 2025:** DEL→BOM, BOM→BLR, BLR→MAA, MAA→HYD, HYD→CCU
- **December 31, 2025:** CCU→AMD, AMD→PNQ, PNQ→COK, COK→GOI, GOI→DEL

Submit any of these searches. You should see matching flights with price and availability.

## 4) Book a flight (demo)

Click the "Book" button on any result:
- A processing screen shows for ~3 seconds.
- You are redirected to a confirmation page with booking reference, seats, and itinerary.

Notes:
- Bookings are stored under the demo user: `test@example.com`.
- Seats and reference are generated for demonstration.
- The seed data includes 50 flights across 10 December dates (Dec 1, 5, 8, 12, 15, 18, 22, 25, 28, 31).
- Each date has 5 flights with different routes, airlines, and times.
- Popular routes like DEL→BOM appear multiple times with different airlines and departure times.

## 5) Verify in My Trips

Navigate to `My Trips`:
- You should see the new booking listed as upcoming for `test@example.com`.

If needed, re-run `pnpm reset` to return the project to the initial demo state.


