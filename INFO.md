# Database Info

This project uses Prisma with SQLite (file-based) for a simple, reproducible DBMS setup. The DB is packaged in `packages/db` and shared via the Prisma Client across apps.

## Setup

- Schema: `packages/db/prisma/schema.prisma`
- Client output: `packages/db/generated/prisma`
- Seed script: `packages/db/prisma/seed.ts`
- Migrations: `packages/db/prisma/migrations/*`
- Database file: `packages/db/prisma/dev.db`

Environment:
- Datasource is `sqlite` with `DATABASE_URL` read from environment. For local dev, the URL points to the `dev.db` file.

## Models

- `Airport` — IATA airport data, related to flights via `departureFlights` and `arrivalFlights`.
- `Airline` — Airline catalog; one-to-many to `Flight`.
- `Flight` — Core flight info: number, airline, airports, times, price, `availableSeats`, `status`.
- `User` — Minimal profile keyed by unique email.
- `Booking` — Join of `User` and `Flight` with `bookingRef`, `status`, `totalPrice`, `bookingDate`, `passengerCount`, `seatNumbers`.

Enums provide strong typing for `FlightStatus` and `BookingStatus`.

## How the app uses the DB

- Search (`GET /search/flights`) queries `Flight` with joined `Airline`, `Airport` data for a given route/date.
- Bookings list (`GET /bookings?email=`) pulls a user's bookings with included `flight`, `airline`, `departure`, `arrival` data.
- Create booking (`POST /bookings`) performs:
  1. Validate request: `{ flightId, passengerCount, email }`.
  2. Find flight and ensure `availableSeats >= passengerCount`.
  3. Upsert `User` by `email` (creates demo user on first run).
  4. Transaction: decrement `Flight.availableSeats` and create `Booking`.
  5. Return a DTO used by the web `Trips` and confirmation pages.

This keeps inventory (available seats) consistent and ensures booking operations are atomic.

## Reset flow for demos

- `pnpm reset` orchestrates:
  - `packages/db`: `prisma migrate reset --force` + seed demo data.
  - Rebuild server and web with fresh outputs.
- Use `DEMO.md` to run the DEL → BOM search for `2025-10-20` and book a flight.

## Notes for DBMS focus

- Design demonstrates relational integrity: `Booking.userId -> User.id`, `Booking.flightId -> Flight.id`, with Prisma-managed relations.
- Transactions ensure seat decrement and booking creation are all-or-nothing.
- Seed data creates airports (e.g., DEL, BOM), airlines, flights with realistic timings/prices to support searches.
- Prisma Client is instantiated in the server (`apps/server/src/prisma/prisma.service.ts`) and re-used via Nest DI.

For schema details, see the Prisma schema file.
