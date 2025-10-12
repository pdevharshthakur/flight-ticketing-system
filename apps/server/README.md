# Flight Booking API

NestJS backend API for the flight ticketing system.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

API runs on `http://localhost:3001`

## Structure

```
├── src/
│   ├── airport/            # Airport endpoints
│   ├── booking/            # Booking endpoints
│   ├── search/             # Flight search
│   ├── prisma/             # Database service
│   ├── app.module.ts       # Main module
│   └── main.ts             # Application entry
└── test/                   # E2E tests
```

## API Endpoints

### Airports
- `GET /airports` - List all airports

### Flight Search
- `GET /search/flights?from=DEL&to=BOM&date=2025-10-20` - Search flights

### Bookings
- `GET /bookings?email=test@example.com` - Get user bookings

## Database

- **ORM**: Prisma
- **Database**: SQLite
- **Location**: `packages/db/prisma/dev.db`

### Models
- `Airport` - Airport information
- `Airline` - Airline details
- `Flight` - Flight schedules
- `User` - User accounts
- `Booking` - Flight bookings

## Test Data

Seeded with:
- 10 Indian airports
- 6 major airlines
- 10 scheduled flights
- 1 test user with 4 bookings

## Configuration

### CORS
Configured for `http://localhost:3000` (frontend)

### Validation
- Uses class-validator for DTOs
- Global validation pipe enabled

## Sample Data

### Working Search Examples
```bash
# Delhi to Mumbai
GET /search/flights?from=DEL&to=BOM&date=2025-10-20

# Mumbai to Bangalore  
GET /search/flights?from=BOM&to=BLR&date=2025-10-21

# Bangalore to Chennai
GET /search/flights?from=BLR&to=MAA&date=2025-10-22
```

### Available Airports
- DEL (Delhi), BOM (Mumbai), BLR (Bangalore)
- MAA (Chennai), HYD (Hyderabad), CCU (Kolkata)
- AMD (Ahmedabad), PNQ (Pune), COK (Kochi), GOI (Goa)

## Development

```bash
# Build
pnpm run build

# Start production
pnpm run start:prod

# Run tests
pnpm run test
pnpm run test:e2e
```