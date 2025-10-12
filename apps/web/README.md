# Flight Booking Web App

Next.js frontend for the flight ticketing system.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

Visit `http://localhost:3000`

## Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── search/             # Search pages
│   │   ├── page.tsx        # Search form
│   │   └── results/        # Search results
│   └── trips/              # My Trips page
├── components/
│   ├── header.tsx          # Navigation header
│   └── providers.tsx       # App providers
├── lib/
│   └── api.ts              # API client
└── types/
    ├── flight.ts           # Flight types
    └── booking.ts          # Booking types
```

## Features

- **Flight Search**: Search by route and date
- **My Trips**: View booking history
- **Responsive Design**: Mobile-first approach
- **Type Safety**: Full TypeScript support

## Configuration

### Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### API Integration

- Uses axios for HTTP requests
- Configured in `lib/api.ts`
- Connects to NestJS backend

## Pages

- **Home** (`/`): Landing page with search CTA
- **Search** (`/search`): Flight search form
- **Results** (`/search/results`): Search results display
- **My Trips** (`/trips`): User booking history

## UI Components

Built with shadcn/ui components:

- Cards, Buttons, Badges
- Form inputs and validation
- Loading states and skeletons
- Responsive layouts

## Testing

Test with the provided seed data:

- **Test User**: `test@example.com`
- **Sample Routes**: DEL→BOM, BOM→BLR, BLR→MAA, MAA→HYD
- **Sample Dates**: 2025-10-20 to 2025-10-23
