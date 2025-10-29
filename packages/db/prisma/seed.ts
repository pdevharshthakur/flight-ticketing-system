/**
 * Flight Ticketing System - Database Seed Script
 *
 * This script generates known test data for the flight ticketing system.
 * It creates airports, airlines, specific flights, and a test user with bookings
 * for testing flight search and "My Trips" functionality.
 *
 * Test User: test@example.com
 * - Has 4 confirmed upcoming bookings
 * - Bookings are for predictable flights with known details
 *
 * @author Flight Ticketing System Team
 * @version 2.0.0
 */

import { PrismaClient, FlightStatus } from "../generated/prisma/index.js";

// Initialize Prisma client for database operations
const prisma = new PrismaClient();

// Type definitions for seed data
type AirportData = {
  code: string; // IATA airport code (e.g., "DEL", "BOM")
  name: string; // Full airport name
  city: string; // City where airport is located
};

// Airline data structure for seed generation
type AirlineData = {
  code: string; // IATA airline code (e.g., "AI", "6E")
  name: string; // Full airline name
};

// Use Prisma's generated types
type Airport = Awaited<ReturnType<typeof prisma.airport.create>>;
type Airline = Awaited<ReturnType<typeof prisma.airline.create>>;
type Flight = Awaited<ReturnType<typeof prisma.flight.create>>;
// Removed User/Booking seeding for clean-slate flight data

/**
 * Seed data constants
 * These arrays contain the base data for creating airports and airlines
 */

// Major Indian airports with their IATA codes and full names
// These airports are selected to provide good route coverage across India
const AIRPORTS: AirportData[] = [
  { code: "DEL", name: "Indira Gandhi International Airport", city: "New Delhi" },
  { code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport", city: "Mumbai" },
  { code: "BLR", name: "Kempegowda International Airport", city: "Bangalore" },
  { code: "MAA", name: "Chennai International Airport", city: "Chennai" },
  { code: "HYD", name: "Rajiv Gandhi International Airport", city: "Hyderabad" },
  { code: "CCU", name: "Netaji Subhas Chandra Bose International Airport", city: "Kolkata" },
  { code: "AMD", name: "Sardar Vallabhbhai Patel International Airport", city: "Ahmedabad" },
  { code: "PNQ", name: "Pune Airport", city: "Pune" },
  { code: "COK", name: "Cochin International Airport", city: "Kochi" },
  { code: "GOI", name: "Dabolim Airport", city: "Goa" },
];

// Popular Indian airlines with their IATA codes and full names
// These airlines represent the major carriers operating in India
const AIRLINES: AirlineData[] = [
  { code: "AI", name: "Air India" },
  { code: "6E", name: "IndiGo" },
  { code: "SG", name: "SpiceJet" },
  { code: "G8", name: "GoAir" },
  { code: "IX", name: "Air India Express" },
  { code: "UK", name: "Vistara" },
];

/**
 * Main seed function
 *
 * This function orchestrates the entire seeding process:
 * 1. Clears existing data to ensure clean state
 * 2. Creates airports from predefined data
 * 3. Creates airlines from predefined data
 * 4. Generates flights with realistic data
 * 5. Creates users for booking functionality
 * 6. Generates booking history
 *
 * @returns Promise<void>
 */
async function main() {
  console.log("🌱 Starting the seed script for flight booking system...");

  // Step 1: Clear existing data to ensure clean state
  // Order matters: delete dependent records first (bookings, flights) then independent ones
  console.log("🧹 Clearing existing data...");
  await prisma.booking.deleteMany();
  await prisma.flight.deleteMany();
  await prisma.airline.deleteMany();
  await prisma.airport.deleteMany();
  await prisma.user.deleteMany();

  // Step 2: Create Airports
  // Creates all airports from the predefined AIRPORTS array
  console.log("✈️ Creating airports...");
  const airports: Airport[] = await Promise.all(
    AIRPORTS.map((airportData: AirportData) =>
      prisma.airport.create({
        data: {
          code: airportData.code,
          name: airportData.name,
          city: airportData.city,
          country: "India", // All airports are in India for this demo
        },
      }),
    ),
  );

  // Step 3: Create Airlines
  // Creates all airlines from the predefined AIRLINES array
  console.log("🏢 Creating airlines...");
  const airlines: Airline[] = await Promise.all(
    AIRLINES.map((airlineData: AirlineData) =>
      prisma.airline.create({
        data: {
          code: airlineData.code,
          name: airlineData.name,
        },
      }),
    ),
  );

  // Step 4: Generate Flights for December 2025 (clean-slate)
  console.log("🛫 Generating flights for December 2025...");
  const flights: Flight[] = [];

  type FlightSeed = {
    flightNumber: string;
    airlineCode: string;
    departureCode: string;
    arrivalCode: string;
    departureTime: Date;
    arrivalTime: Date;
    price: number;
    availableSeats: number;
  };

  const flightData: FlightSeed[] = [];

  // 15+ origin-destination pairs
  const ROUTE_PAIRS: Array<{ from: string; to: string }> = [
    { from: "DEL", to: "BOM" },
    { from: "BOM", to: "DEL" },
    { from: "DEL", to: "BLR" },
    { from: "BLR", to: "DEL" },
    { from: "BLR", to: "HYD" },
    { from: "HYD", to: "BLR" },
    { from: "MAA", to: "DEL" },
    { from: "DEL", to: "MAA" },
    { from: "CCU", to: "DEL" },
    { from: "DEL", to: "CCU" },
    { from: "BOM", to: "HYD" },
    { from: "HYD", to: "BOM" },
    { from: "AMD", to: "DEL" },
    { from: "DEL", to: "AMD" },
    { from: "PNQ", to: "DEL" },
  ];

  // Five departure slots across December 2025
  const DEC_DATES: Date[] = [
    new Date("2025-12-01T06:00:00Z"),
    new Date("2025-12-05T09:00:00Z"),
    new Date("2025-12-08T14:00:00Z"),
    new Date("2025-12-12T18:00:00Z"),
    new Date("2025-12-15T21:00:00Z"),
  ];

  const durationMinutesFor = (pair: { from: string; to: string }): number => {
    const medium = new Set([
      "DEL-BLR",
      "BLR-DEL",
      "DEL-CCU",
      "CCU-DEL",
      "BOM-HYD",
      "HYD-BOM",
      "DEL-AMD",
      "AMD-DEL",
    ]);
    const long = new Set(["DEL-GOI", "GOI-DEL"]);
    const key = `${pair.from}-${pair.to}`;
    if (medium.has(key)) return 150; // 2h30m
    if (long.has(key)) return 180; // 3h
    return 120; // 2h
  };

  // Deterministic generator ensuring 5 flights per route per date
  (function appendGeneratedFlights() {
    let serial = 2000; // Avoid collision with any legacy series
    const airlineCodes = AIRLINES.map((a) => a.code);
    const hourOffsets = [0, 3, 8, 12, 15]; // 6am, 9am, 2pm, 6pm, 9pm

    for (const [pairIdx, pair] of ROUTE_PAIRS.entries()) {
      for (let dateIdx = 0; dateIdx < DEC_DATES.length; dateIdx++) {
        const baseDate = DEC_DATES[dateIdx];
        if (!baseDate) continue;

        // Generate 5 flights for this route+date combination
        for (let flightIdx = 0; flightIdx < 5; flightIdx++) {
          const departureTime = new Date(baseDate);
          // Different departure times: 6am, 9am, 2pm, 6pm, 9pm
          departureTime.setHours(departureTime.getHours() + (hourOffsets[flightIdx] ?? 0));

          const minutes = durationMinutesFor(pair);
          const arrivalTime = new Date(departureTime.getTime() + minutes * 60_000);

          // Round-robin through airlines for variety
          const airlineCode = airlineCodes[flightIdx % airlineCodes.length] ?? "AI";
          const flightNumber = `${airlineCode}${serial++}`;

          // Vary prices and seats for each flight
          const basePrice = 3200 + ((pairIdx * 137 + dateIdx * 311 + flightIdx * 47) % 3000);
          const price = Math.min(7200, Math.max(3200, basePrice));
          const availableSeats = 85 + ((pairIdx * 17 + dateIdx * 29 + flightIdx * 13) % 80);

          flightData.push({
            flightNumber,
            airlineCode,
            departureCode: pair.from,
            arrivalCode: pair.to,
            departureTime,
            arrivalTime,
            price,
            availableSeats,
          });
        }
      }
    }
  })();

  // Create flights from the defined data
  for (const flightInfo of flightData) {
    const airline = airlines.find((a) => a.code === flightInfo.airlineCode);
    const departureAirport = airports.find((a) => a.code === flightInfo.departureCode);
    const arrivalAirport = airports.find((a) => a.code === flightInfo.arrivalCode);

    if (airline && departureAirport && arrivalAirport) {
      const flight: Flight = await prisma.flight.create({
        data: {
          flightNumber: flightInfo.flightNumber,
          airlineId: airline.id,
          departureId: departureAirport.id,
          arrivalId: arrivalAirport.id,
          departureTime: flightInfo.departureTime,
          arrivalTime: flightInfo.arrivalTime,
          price: flightInfo.price,
          availableSeats: flightInfo.availableSeats,
          status: FlightStatus.SCHEDULED,
        },
      });

      flights.push(flight);
    }
  }

  // Step 5: Display completion summary
  console.log("✅ Seed script completed successfully!");
  console.log(`📊 Created:`);
  console.log(`   - ${airports.length} airports`);
  console.log(`   - ${airlines.length} airlines`);
  console.log(`   - ${flights.length} flights`);
  console.log("\n🎯 Ready for flight search and booking functionality!");
}

/**
 * Execute the seed script
 *
 * This section handles the script execution with proper error handling
 * and cleanup of database connections.
 */
main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Always disconnect from the database, even if an error occurs
    await prisma.$disconnect();
  });
