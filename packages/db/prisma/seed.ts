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

import { PrismaClient, FlightStatus, BookingStatus } from "../generated/prisma/index.js";

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

  // Step 4: Create Known Flights
  // Creates specific, predictable flights for testing
  console.log("🛫 Creating known flights...");
  const flights: Flight[] = [];

  // Helper function to create dates for next week and next month
  const getNextWeekDate = (dayOffset: number, hour: number, minute: number = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + 7 + dayOffset);
    date.setHours(hour, minute, 0, 0);
    return date;
  };

  const getNextMonthDate = (dayOffset: number, hour: number, minute: number = 0) => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    date.setDate(date.getDate() + dayOffset);
    date.setHours(hour, minute, 0, 0);
    return date;
  };

  // Define specific flights with known data
  const flightData = [
    // Next week flights
    {
      flightNumber: "AI101",
      airlineCode: "AI",
      departureCode: "DEL",
      arrivalCode: "BOM",
      departureTime: getNextWeekDate(1, 9, 0), // Monday 9:00 AM
      arrivalTime: getNextWeekDate(1, 11, 30), // Monday 11:30 AM
      price: 5000,
      availableSeats: 120,
    },
    {
      flightNumber: "6E202",
      airlineCode: "6E",
      departureCode: "BOM",
      arrivalCode: "BLR",
      departureTime: getNextWeekDate(2, 14, 0), // Tuesday 2:00 PM
      arrivalTime: getNextWeekDate(2, 16, 15), // Tuesday 4:15 PM
      price: 8000,
      availableSeats: 150,
    },
    {
      flightNumber: "SG303",
      airlineCode: "SG",
      departureCode: "BLR",
      arrivalCode: "MAA",
      departureTime: getNextWeekDate(3, 18, 0), // Wednesday 6:00 PM
      arrivalTime: getNextWeekDate(3, 19, 30), // Wednesday 7:30 PM
      price: 3500,
      availableSeats: 80,
    },
    {
      flightNumber: "UK404",
      airlineCode: "UK",
      departureCode: "MAA",
      arrivalCode: "HYD",
      departureTime: getNextWeekDate(4, 10, 30), // Thursday 10:30 AM
      arrivalTime: getNextWeekDate(4, 12, 0), // Thursday 12:00 PM
      price: 4500,
      availableSeats: 100,
    },
    {
      flightNumber: "AI505",
      airlineCode: "AI",
      departureCode: "HYD",
      arrivalCode: "CCU",
      departureTime: getNextWeekDate(5, 15, 0), // Friday 3:00 PM
      arrivalTime: getNextWeekDate(5, 17, 45), // Friday 5:45 PM
      price: 12000,
      availableSeats: 90,
    },
    // Next month flights
    {
      flightNumber: "6E606",
      airlineCode: "6E",
      departureCode: "CCU",
      arrivalCode: "AMD",
      departureTime: getNextMonthDate(1, 8, 0), // 1st of next month 8:00 AM
      arrivalTime: getNextMonthDate(1, 10, 30), // 1st of next month 10:30 AM
      price: 7000,
      availableSeats: 140,
    },
    {
      flightNumber: "SG707",
      airlineCode: "SG",
      departureCode: "AMD",
      arrivalCode: "PNQ",
      departureTime: getNextMonthDate(2, 13, 0), // 2nd of next month 1:00 PM
      arrivalTime: getNextMonthDate(2, 14, 15), // 2nd of next month 2:15 PM
      price: 4000,
      availableSeats: 75,
    },
    {
      flightNumber: "UK808",
      airlineCode: "UK",
      departureCode: "PNQ",
      arrivalCode: "COK",
      departureTime: getNextMonthDate(3, 16, 30), // 3rd of next month 4:30 PM
      arrivalTime: getNextMonthDate(3, 18, 45), // 3rd of next month 6:45 PM
      price: 9000,
      availableSeats: 110,
    },
    {
      flightNumber: "AI909",
      airlineCode: "AI",
      departureCode: "COK",
      arrivalCode: "GOI",
      departureTime: getNextMonthDate(4, 11, 0), // 4th of next month 11:00 AM
      arrivalTime: getNextMonthDate(4, 12, 30), // 4th of next month 12:30 PM
      price: 6000,
      availableSeats: 95,
    },
    {
      flightNumber: "6E1010",
      airlineCode: "6E",
      departureCode: "GOI",
      arrivalCode: "DEL",
      departureTime: getNextMonthDate(5, 19, 0), // 5th of next month 7:00 PM
      arrivalTime: getNextMonthDate(5, 21, 30), // 5th of next month 9:30 PM
      price: 11000,
      availableSeats: 160,
    },
  ];

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

  // Step 5: Create Test User
  // Creates a single test user for booking functionality
  console.log("👥 Creating test user...");
  const testUser: User = await prisma.user.create({
    data: {
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      phone: "+91-9876543210",
    },
  });

  // Step 6: Create Test Bookings
  // Creates 3-4 confirmed upcoming bookings for the test user
  console.log("🎫 Creating test bookings...");

  // Create bookings for the first 4 flights (all upcoming)
  const testBookings = [
    {
      flightIndex: 1, // 6E202 - Mumbai to Bangalore
      passengerCount: 2,
      seatNumbers: "15B,15C",
      bookingRef: "BK00000002",
    },
    {
      flightIndex: 2, // SG303 - Bangalore to Chennai
      passengerCount: 1,
      seatNumbers: "8D",
      bookingRef: "BK00000003",
    },
    {
      flightIndex: 3, // UK404 - Chennai to Hyderabad
      passengerCount: 2,
      seatNumbers: "20A,20B",
      bookingRef: "BK00000004",
    },
  ];
  for (const [i, bookingInfo] of testBookings.entries()) {
    const flight = flights[bookingInfo.flightIndex];

    if (!flight) {
      console.warn(
        `Flight at index ${bookingInfo.flightIndex} not found, skipping booking ${bookingInfo.bookingRef}`,
      );
      continue;
    }

    const totalPrice = flight.price * bookingInfo.passengerCount;

    const booking: Booking = await prisma.booking.create({
      data: {
        userId: testUser.id,
        flightId: flight.id,
        bookingRef: bookingInfo.bookingRef,
        status: BookingStatus.COMPLETED,
        totalPrice,
        bookingDate: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000), // Past dates
        passengerCount: bookingInfo.passengerCount,
        seatNumbers: bookingInfo.seatNumbers,
      },
    });

    // Decrease available seats for the flight
    await prisma.flight.update({
      where: { id: flight.id },
      data: { availableSeats: Math.max(0, flight.availableSeats - bookingInfo.passengerCount) },
    });
  }

  // Step 7: Display completion summary
  console.log("✅ Seed script completed successfully!");
  console.log(`📊 Created:`);
  console.log(`   - ${airports.length} airports`);
  console.log(`   - ${airlines.length} airlines`);
  console.log(`   - ${flights.length} flights`);
  console.log(`   - 1 test user (test@example.com)`);
  console.log(`   - ${testBookings.length} test bookings`);
  console.log("\n🎯 Ready for flight search and booking functionality!");
  console.log("📋 Test user has bookings for 'My Trips' testing");
  console.log("🔑 Test user email: test@example.com");
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
