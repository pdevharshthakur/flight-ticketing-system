/**
 * Flight Ticketing System - Database Seed Script
 *
 * This script generates mock data for the flight ticketing system.
 * It creates airports, airlines, and flights for testing flight search functionality.
 *
 * Note: This script assumes users are already logged in, so no user data is generated.
 *
 * @author Flight Ticketing System Team
 * @version 1.0.0
 */

import { PrismaClient, FlightStatus, BookingStatus } from "../generated/prisma/index.js";
import { faker } from "@faker-js/faker";

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
type User = Awaited<ReturnType<typeof prisma.user.create>>;
type Booking = Awaited<ReturnType<typeof prisma.booking.create>>;

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
 * Helper functions for generating realistic flight data
 * These functions use Faker.js to create realistic mock data
 */

/**
 * Generates realistic flight departure and arrival times
 *
 * @returns Object containing departure and arrival Date objects
 *
 * Features:
 * - Departure times spread over next 2 years (2025-2027)
 * - Flight times between 5 AM and 11 PM
 * - Minutes rounded to quarters (0, 15, 30, 45)
 * - Flight duration between 1-8 hours
 */
function generateFlightTime(): { departure: Date; arrival: Date } {
  // Generate departure time for 2025 and beyond (next 2 years)
  const departure = faker.date.future({ years: 2 });

  // Set realistic departure hours (5 AM to 11 PM)
  departure.setHours(
    faker.number.int({ min: 5, max: 23 }),
    faker.helpers.arrayElement([0, 15, 30, 45]), // Quarter-hour intervals
    0,
    0,
  );

  // Generate flight duration between 1-8 hours (60-480 minutes)
  const duration = faker.number.int({ min: 60, max: 480 });
  const arrival = new Date(departure.getTime() + duration * 60000);

  return { departure, arrival };
}

/**
 * Generates Indian phone numbers with realistic prefixes
 *
 * @returns Formatted Indian phone number string
 */
function generateIndianPhone(): string {
  const prefixes = ["9876", "9875", "9874", "9873", "9872", "9871", "9870", "9869", "9868", "9867"];
  const prefix = faker.helpers.arrayElement(prefixes);
  const suffix = faker.string.numeric(6);
  return `+91-${prefix}${suffix}`;
}

/**
 * Generates Indian names for realistic user data
 *
 * @returns Object containing firstName and lastName
 */
function generateIndianName(): { firstName: string; lastName: string } {
  const firstNames = [
    "Aarav",
    "Arjun",
    "Vikram",
    "Rahul",
    "Suresh",
    "Rajesh",
    "Kumar",
    "Amit",
    "Ravi",
    "Priya",
    "Anita",
    "Sunita",
    "Kavita",
    "Rekha",
    "Meera",
    "Sita",
    "Gita",
    "Rita",
    "Neha",
  ];
  const lastNames = [
    "Sharma",
    "Verma",
    "Gupta",
    "Singh",
    "Kumar",
    "Patel",
    "Jain",
    "Agarwal",
    "Malhotra",
    "Chopra",
    "Reddy",
    "Nair",
    "Iyer",
    "Menon",
    "Pillai",
    "Rao",
    "Naidu",
    "Gowda",
    "Shetty",
    "Bhat",
  ];

  return {
    firstName: faker.helpers.arrayElement(firstNames),
    lastName: faker.helpers.arrayElement(lastNames),
  };
}

/**
 * Generates unique booking reference numbers
 *
 * @returns Unique booking reference string
 */
function generateBookingRef(): string {
  return `BK${faker.string.alphanumeric(8).toUpperCase()}`;
}

/**
 * Generates seat numbers for bookings
 *
 * @param passengerCount Number of passengers
 * @returns Comma-separated seat numbers string
 */
function generateSeatNumbers(passengerCount: number): string {
  const seats = [];
  for (let i = 0; i < passengerCount; i++) {
    const row = faker.number.int({ min: 1, max: 30 });
    const letter = faker.helpers.arrayElement(["A", "B", "C", "D", "E", "F"]);
    seats.push(`${row}${letter}`);
  }
  return seats.join(",");
}

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

  // Step 4: Create Flights
  // Generates realistic flights with random routes, times, and pricing
  console.log("🛫 Creating flights...");
  const flights: Flight[] = [];
  const flightCount = 150; // Generate 150 flights for better search results

  for (let i = 0; i < flightCount; i++) {
    // Randomly select airline and airports for this flight
    const airline: Airline = faker.helpers.arrayElement(airlines);
    const departureAirport: Airport = faker.helpers.arrayElement(airports);

    // Ensure arrival airport is different from departure airport
    const arrivalAirport: Airport = faker.helpers.arrayElement(
      airports.filter((airport) => airport.id !== departureAirport.id),
    );

    // Generate realistic flight timing
    const { departure, arrival } = generateFlightTime();

    // Generate realistic pricing (₹3,000 - ₹20,000)
    const price = faker.number.float({ min: 3000, max: 20000, fractionDigits: 2 });

    // Generate available seats (5-180 seats)
    const availableSeats = faker.number.int({ min: 5, max: 180 });

    // Create flight record in database
    const flight: Flight = await prisma.flight.create({
      data: {
        flightNumber: `${airline.code}${faker.number.int({ min: 100, max: 9999 })}`,
        airlineId: airline.id,
        departureId: departureAirport.id,
        arrivalId: arrivalAirport.id,
        departureTime: departure,
        arrivalTime: arrival,
        price,
        availableSeats,
        // 75% scheduled, 25% delayed for realistic data
        status: faker.helpers.arrayElement([
          FlightStatus.SCHEDULED,
          FlightStatus.SCHEDULED,
          FlightStatus.SCHEDULED,
          FlightStatus.DELAYED,
        ]),
      },
    });

    flights.push(flight);
  }

  // Step 5: Create Users
  // Creates users for booking functionality
  console.log("👥 Creating users...");
  const users: User[] = [];
  const userCount = 30;

  for (let i = 0; i < userCount; i++) {
    const { firstName, lastName } = generateIndianName();

    const user: User = await prisma.user.create({
      data: {
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        firstName,
        lastName,
        phone: generateIndianPhone(),
      },
    });

    users.push(user);
  }

  // Step 6: Create Bookings
  // Generates realistic booking history
  console.log("🎫 Creating bookings...");
  const bookingCount = 80;

  for (let i = 0; i < bookingCount; i++) {
    const flight: Flight = faker.helpers.arrayElement(flights);
    const user: User = faker.helpers.arrayElement(users);

    // Only create booking if flight has available seats
    if (flight.availableSeats > 0) {
      const passengerCount = faker.number.int({ min: 1, max: 4 }); // 1-4 passengers
      const totalPrice = flight.price * passengerCount;
      const seatNumbers = generateSeatNumbers(passengerCount);

      const booking: Booking = await prisma.booking.create({
        data: {
          userId: user.id,
          flightId: flight.id,
          bookingRef: generateBookingRef(),
          status: faker.helpers.arrayElement([
            BookingStatus.CONFIRMED,
            BookingStatus.CONFIRMED,
            BookingStatus.CONFIRMED,
            BookingStatus.CANCELLED,
            BookingStatus.COMPLETED,
          ]),
          totalPrice,
          bookingDate: faker.date.recent({ days: 30 }), // Bookings from last month
          passengerCount,
          seatNumbers,
        },
      });

      // Decrease available seats if booking is confirmed
      if (booking.status === BookingStatus.CONFIRMED) {
        await prisma.flight.update({
          where: { id: flight.id },
          data: { availableSeats: Math.max(0, flight.availableSeats - passengerCount) },
        });
      }
    }
  }

  // Step 7: Display completion summary
  console.log("✅ Seed script completed successfully!");
  console.log(`📊 Created:`);
  console.log(`   - ${airports.length} airports`);
  console.log(`   - ${airlines.length} airlines`);
  console.log(`   - ${flights.length} flights`);
  console.log(`   - ${users.length} users`);
  console.log(`   - ${bookingCount} bookings`);
  console.log("\n🎯 Ready for flight search and booking functionality!");
  console.log("📋 Booking history and user data included");
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
