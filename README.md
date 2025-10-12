# Flight Ticketing System

A full-stack flight booking application built with Next.js, NestJS, and Prisma.

## Architecture

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Backend**: NestJS with TypeScript
- **Database**: SQLite with Prisma ORM
- **UI**: shadcn/ui components

## Project Structure

```
├── apps/
│   ├── web/          # Next.js frontend
│   └── server/       # NestJS backend
├── packages/
│   ├── db/           # Prisma database package
│   ├── ui/           # Shared UI components
│   └── typescript-config/ # Shared TypeScript configs
└── pnpm-workspace.yaml
```

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm

### Installation
```bash
pnpm install
```

### Database Setup
```bash
cd packages/db
pnpm run db:seed
```

### Development
```bash
# Start backend (port 3001)
cd apps/server && pnpm run dev

# Start frontend (port 3000)
cd apps/web && pnpm run dev
```

## Features

- **Flight Search**: Search flights by route and date
- **My Trips**: View booking history
- **Responsive Design**: Mobile and desktop support
- **Type Safety**: Full TypeScript implementation

## Test Data

The system includes test data with:
- 10 airports across India
- 6 major airlines
- 10 scheduled flights
- 1 test user with 4 bookings

**Test User**: `test@example.com`

## Available Scripts

```bash
# Root level
pnpm install          # Install all dependencies
pnpm run build        # Build all packages
pnpm run dev          # Start all services

# Database
cd packages/db
pnpm run db:seed      # Seed database with test data
pnpm run db:studio    # Open Prisma Studio

# Backend
cd apps/server
pnpm run dev          # Start development server
pnpm run build        # Build for production

# Frontend
cd apps/web
pnpm run dev          # Start development server
pnpm run build        # Build for production
```

## API Endpoints

- `GET /airports` - List all airports
- `GET /search/flights` - Search flights
- `GET /bookings?email=test@example.com` - Get user bookings

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: NestJS, TypeScript, Prisma
- **Database**: SQLite
- **Package Manager**: pnpm
- **Monorepo**: Turborepo