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

  // Fixed dates for testing - using specific dates in December 2025
  const FIXED_DATES = {
    // December 1, 2025
    DEC1_6AM: new Date("2025-12-01T06:00:00Z"),
    DEC1_9AM: new Date("2025-12-01T09:00:00Z"),
    DEC1_2PM: new Date("2025-12-01T14:00:00Z"),
    DEC1_6PM: new Date("2025-12-01T18:00:00Z"),
    DEC1_9PM: new Date("2025-12-01T21:00:00Z"),

    // December 5, 2025
    DEC5_6AM: new Date("2025-12-05T06:00:00Z"),
    DEC5_9AM: new Date("2025-12-05T09:00:00Z"),
    DEC5_2PM: new Date("2025-12-05T14:00:00Z"),
    DEC5_6PM: new Date("2025-12-05T18:00:00Z"),
    DEC5_9PM: new Date("2025-12-05T21:00:00Z"),

    // December 8, 2025
    DEC8_6AM: new Date("2025-12-08T06:00:00Z"),
    DEC8_9AM: new Date("2025-12-08T09:00:00Z"),
    DEC8_2PM: new Date("2025-12-08T14:00:00Z"),
    DEC8_6PM: new Date("2025-12-08T18:00:00Z"),
    DEC8_9PM: new Date("2025-12-08T21:00:00Z"),

    // December 12, 2025
    DEC12_6AM: new Date("2025-12-12T06:00:00Z"),
    DEC12_9AM: new Date("2025-12-12T09:00:00Z"),
    DEC12_2PM: new Date("2025-12-12T14:00:00Z"),
    DEC12_6PM: new Date("2025-12-12T18:00:00Z"),
    DEC12_9PM: new Date("2025-12-12T21:00:00Z"),

    // December 15, 2025
    DEC15_6AM: new Date("2025-12-15T06:00:00Z"),
    DEC15_9AM: new Date("2025-12-15T09:00:00Z"),
    DEC15_2PM: new Date("2025-12-15T14:00:00Z"),
    DEC15_6PM: new Date("2025-12-15T18:00:00Z"),
    DEC15_9PM: new Date("2025-12-15T21:00:00Z"),

    // December 18, 2025
    DEC18_6AM: new Date("2025-12-18T06:00:00Z"),
    DEC18_9AM: new Date("2025-12-18T09:00:00Z"),
    DEC18_2PM: new Date("2025-12-18T14:00:00Z"),
    DEC18_6PM: new Date("2025-12-18T18:00:00Z"),
    DEC18_9PM: new Date("2025-12-18T21:00:00Z"),

    // December 22, 2025
    DEC22_6AM: new Date("2025-12-22T06:00:00Z"),
    DEC22_9AM: new Date("2025-12-22T09:00:00Z"),
    DEC22_2PM: new Date("2025-12-22T14:00:00Z"),
    DEC22_6PM: new Date("2025-12-22T18:00:00Z"),
    DEC22_9PM: new Date("2025-12-22T21:00:00Z"),

    // December 25, 2025
    DEC25_6AM: new Date("2025-12-25T06:00:00Z"),
    DEC25_9AM: new Date("2025-12-25T09:00:00Z"),
    DEC25_2PM: new Date("2025-12-25T14:00:00Z"),
    DEC25_6PM: new Date("2025-12-25T18:00:00Z"),
    DEC25_9PM: new Date("2025-12-25T21:00:00Z"),

    // December 28, 2025
    DEC28_6AM: new Date("2025-12-28T06:00:00Z"),
    DEC28_9AM: new Date("2025-12-28T09:00:00Z"),
    DEC28_2PM: new Date("2025-12-28T14:00:00Z"),
    DEC28_6PM: new Date("2025-12-28T18:00:00Z"),
    DEC28_9PM: new Date("2025-12-28T21:00:00Z"),

    // December 31, 2025
    DEC31_6AM: new Date("2025-12-31T06:00:00Z"),
    DEC31_9AM: new Date("2025-12-31T09:00:00Z"),
    DEC31_2PM: new Date("2025-12-31T14:00:00Z"),
    DEC31_6PM: new Date("2025-12-31T18:00:00Z"),
    DEC31_9PM: new Date("2025-12-31T21:00:00Z"),
  };

  // Define specific flights with known data - December 2025
  const flightData = [
    // December 1, 2025 - 5 flights
    {
      flightNumber: "AI1201",
      airlineCode: "AI",
      departureCode: "DEL",
      arrivalCode: "BOM",
      departureTime: FIXED_DATES.DEC1_6AM,
      arrivalTime: new Date("2025-12-01T08:30:00Z"),
      price: 4500,
      availableSeats: 120,
    },
    {
      flightNumber: "6E1202",
      airlineCode: "6E",
      departureCode: "DEL",
      arrivalCode: "BOM",
      departureTime: FIXED_DATES.DEC1_9AM,
      arrivalTime: new Date("2025-12-01T11:30:00Z"),
      price: 5200,
      availableSeats: 150,
    },
    {
      flightNumber: "SG1203",
      airlineCode: "SG",
      departureCode: "BOM",
      arrivalCode: "BLR",
      departureTime: FIXED_DATES.DEC1_2PM,
      arrivalTime: new Date("2025-12-01T16:15:00Z"),
      price: 3800,
      availableSeats: 85,
    },
    {
      flightNumber: "UK1204",
      airlineCode: "UK",
      departureCode: "BLR",
      arrivalCode: "MAA",
      departureTime: FIXED_DATES.DEC1_6PM,
      arrivalTime: new Date("2025-12-01T19:30:00Z"),
      price: 4200,
      availableSeats: 100,
    },
    {
      flightNumber: "IX1205",
      airlineCode: "IX",
      departureCode: "MAA",
      arrivalCode: "HYD",
      departureTime: FIXED_DATES.DEC1_9PM,
      arrivalTime: new Date("2025-12-01T22:45:00Z"),
      price: 3500,
      availableSeats: 75,
    },

    // December 5, 2025 - 5 flights
    {
      flightNumber: "AI1206",
      airlineCode: "AI",
      departureCode: "HYD",
      arrivalCode: "CCU",
      departureTime: FIXED_DATES.DEC5_6AM,
      arrivalTime: new Date("2025-12-05T08:30:00Z"),
      price: 4800,
      availableSeats: 110,
    },
    {
      flightNumber: "6E1207",
      airlineCode: "6E",
      departureCode: "CCU",
      arrivalCode: "AMD",
      departureTime: FIXED_DATES.DEC5_9AM,
      arrivalTime: new Date("2025-12-05T11:30:00Z"),
      price: 4200,
      availableSeats: 140,
    },
    {
      flightNumber: "SG1208",
      airlineCode: "SG",
      departureCode: "AMD",
      arrivalCode: "PNQ",
      departureTime: FIXED_DATES.DEC5_2PM,
      arrivalTime: new Date("2025-12-05T15:15:00Z"),
      price: 3200,
      availableSeats: 80,
    },
    {
      flightNumber: "UK1209",
      airlineCode: "UK",
      departureCode: "PNQ",
      arrivalCode: "COK",
      departureTime: FIXED_DATES.DEC5_6PM,
      arrivalTime: new Date("2025-12-05T19:45:00Z"),
      price: 6800,
      availableSeats: 95,
    },
    {
      flightNumber: "G81210",
      airlineCode: "G8",
      departureCode: "COK",
      arrivalCode: "GOI",
      departureTime: FIXED_DATES.DEC5_9PM,
      arrivalTime: new Date("2025-12-05T22:30:00Z"),
      price: 4500,
      availableSeats: 90,
    },

    // December 8, 2025 - 5 flights
    {
      flightNumber: "AI1211",
      airlineCode: "AI",
      departureCode: "GOI",
      arrivalCode: "DEL",
      departureTime: FIXED_DATES.DEC8_6AM,
      arrivalTime: new Date("2025-12-08T08:30:00Z"),
      price: 5500,
      availableSeats: 125,
    },
    {
      flightNumber: "6E1212",
      airlineCode: "6E",
      departureCode: "DEL",
      arrivalCode: "BLR",
      departureTime: FIXED_DATES.DEC8_9AM,
      arrivalTime: new Date("2025-12-08T12:30:00Z"),
      price: 7200,
      availableSeats: 160,
    },
    {
      flightNumber: "SG1213",
      airlineCode: "SG",
      departureCode: "BLR",
      arrivalCode: "MAA",
      departureTime: FIXED_DATES.DEC8_2PM,
      arrivalTime: new Date("2025-12-08T16:15:00Z"),
      price: 3800,
      availableSeats: 85,
    },
    {
      flightNumber: "UK1214",
      airlineCode: "UK",
      departureCode: "MAA",
      arrivalCode: "HYD",
      departureTime: FIXED_DATES.DEC8_6PM,
      arrivalTime: new Date("2025-12-08T19:45:00Z"),
      price: 4200,
      availableSeats: 100,
    },
    {
      flightNumber: "IX1215",
      airlineCode: "IX",
      departureCode: "HYD",
      arrivalCode: "CCU",
      departureTime: FIXED_DATES.DEC8_9PM,
      arrivalTime: new Date("2025-12-08T23:15:00Z"),
      price: 3600,
      availableSeats: 70,
    },

    // December 12, 2025 - 5 flights
    {
      flightNumber: "AI1216",
      airlineCode: "AI",
      departureCode: "CCU",
      arrivalCode: "AMD",
      departureTime: FIXED_DATES.DEC12_6AM,
      arrivalTime: new Date("2025-12-12T08:30:00Z"),
      price: 4800,
      availableSeats: 115,
    },
    {
      flightNumber: "6E1217",
      airlineCode: "6E",
      departureCode: "AMD",
      arrivalCode: "PNQ",
      departureTime: FIXED_DATES.DEC12_9AM,
      arrivalTime: new Date("2025-12-12T11:30:00Z"),
      price: 3500,
      availableSeats: 145,
    },
    {
      flightNumber: "SG1218",
      airlineCode: "SG",
      departureCode: "PNQ",
      arrivalCode: "COK",
      departureTime: FIXED_DATES.DEC12_2PM,
      arrivalTime: new Date("2025-12-12T16:15:00Z"),
      price: 4200,
      availableSeats: 80,
    },
    {
      flightNumber: "UK1219",
      airlineCode: "UK",
      departureCode: "COK",
      arrivalCode: "GOI",
      departureTime: FIXED_DATES.DEC12_6PM,
      arrivalTime: new Date("2025-12-12T19:30:00Z"),
      price: 3800,
      availableSeats: 95,
    },
    {
      flightNumber: "G81220",
      airlineCode: "G8",
      departureCode: "GOI",
      arrivalCode: "DEL",
      departureTime: FIXED_DATES.DEC12_9PM,
      arrivalTime: new Date("2025-12-12T22:45:00Z"),
      price: 5200,
      availableSeats: 105,
    },

    // December 15, 2025 - 5 flights
    {
      flightNumber: "AI1221",
      airlineCode: "AI",
      departureCode: "DEL",
      arrivalCode: "BOM",
      departureTime: FIXED_DATES.DEC15_6AM,
      arrivalTime: new Date("2025-12-15T08:30:00Z"),
      price: 4800,
      availableSeats: 130,
    },
    {
      flightNumber: "6E1222",
      airlineCode: "6E",
      departureCode: "BOM",
      arrivalCode: "BLR",
      departureTime: FIXED_DATES.DEC15_9AM,
      arrivalTime: new Date("2025-12-15T12:30:00Z"),
      price: 6500,
      availableSeats: 155,
    },
    {
      flightNumber: "SG1223",
      airlineCode: "SG",
      departureCode: "BLR",
      arrivalCode: "MAA",
      departureTime: FIXED_DATES.DEC15_2PM,
      arrivalTime: new Date("2025-12-15T16:15:00Z"),
      price: 3600,
      availableSeats: 85,
    },
    {
      flightNumber: "UK1224",
      airlineCode: "UK",
      departureCode: "MAA",
      arrivalCode: "HYD",
      departureTime: FIXED_DATES.DEC15_6PM,
      arrivalTime: new Date("2025-12-15T19:45:00Z"),
      price: 4200,
      availableSeats: 100,
    },
    {
      flightNumber: "IX1225",
      airlineCode: "IX",
      departureCode: "HYD",
      arrivalCode: "CCU",
      departureTime: FIXED_DATES.DEC15_9PM,
      arrivalTime: new Date("2025-12-15T23:15:00Z"),
      price: 3800,
      availableSeats: 75,
    },

    // December 18, 2025 - 5 flights
    {
      flightNumber: "AI1226",
      airlineCode: "AI",
      departureCode: "CCU",
      arrivalCode: "AMD",
      departureTime: FIXED_DATES.DEC18_6AM,
      arrivalTime: new Date("2025-12-18T08:30:00Z"),
      price: 5200,
      availableSeats: 120,
    },
    {
      flightNumber: "6E1227",
      airlineCode: "6E",
      departureCode: "AMD",
      arrivalCode: "PNQ",
      departureTime: FIXED_DATES.DEC18_9AM,
      arrivalTime: new Date("2025-12-18T11:30:00Z"),
      price: 3800,
      availableSeats: 150,
    },
    {
      flightNumber: "SG1228",
      airlineCode: "SG",
      departureCode: "PNQ",
      arrivalCode: "COK",
      departureTime: FIXED_DATES.DEC18_2PM,
      arrivalTime: new Date("2025-12-18T16:15:00Z"),
      price: 4500,
      availableSeats: 80,
    },
    {
      flightNumber: "UK1229",
      airlineCode: "UK",
      departureCode: "COK",
      arrivalCode: "GOI",
      departureTime: FIXED_DATES.DEC18_6PM,
      arrivalTime: new Date("2025-12-18T19:30:00Z"),
      price: 4200,
      availableSeats: 95,
    },
    {
      flightNumber: "G81230",
      airlineCode: "G8",
      departureCode: "GOI",
      arrivalCode: "DEL",
      departureTime: FIXED_DATES.DEC18_9PM,
      arrivalTime: new Date("2025-12-18T22:45:00Z"),
      price: 5500,
      availableSeats: 110,
    },

    // December 22, 2025 - 5 flights
    {
      flightNumber: "AI1231",
      airlineCode: "AI",
      departureCode: "DEL",
      arrivalCode: "BOM",
      departureTime: FIXED_DATES.DEC22_6AM,
      arrivalTime: new Date("2025-12-22T08:30:00Z"),
      price: 5200,
      availableSeats: 135,
    },
    {
      flightNumber: "6E1232",
      airlineCode: "6E",
      departureCode: "BOM",
      arrivalCode: "BLR",
      departureTime: FIXED_DATES.DEC22_9AM,
      arrivalTime: new Date("2025-12-22T12:30:00Z"),
      price: 6800,
      availableSeats: 160,
    },
    {
      flightNumber: "SG1233",
      airlineCode: "SG",
      departureCode: "BLR",
      arrivalCode: "MAA",
      departureTime: FIXED_DATES.DEC22_2PM,
      arrivalTime: new Date("2025-12-22T16:15:00Z"),
      price: 3800,
      availableSeats: 85,
    },
    {
      flightNumber: "UK1234",
      airlineCode: "UK",
      departureCode: "MAA",
      arrivalCode: "HYD",
      departureTime: FIXED_DATES.DEC22_6PM,
      arrivalTime: new Date("2025-12-22T19:45:00Z"),
      price: 4500,
      availableSeats: 100,
    },
    {
      flightNumber: "IX1235",
      airlineCode: "IX",
      departureCode: "HYD",
      arrivalCode: "CCU",
      departureTime: FIXED_DATES.DEC22_9PM,
      arrivalTime: new Date("2025-12-22T23:15:00Z"),
      price: 4000,
      availableSeats: 75,
    },

    // December 25, 2025 - 5 flights
    {
      flightNumber: "AI1236",
      airlineCode: "AI",
      departureCode: "CCU",
      arrivalCode: "AMD",
      departureTime: FIXED_DATES.DEC25_6AM,
      arrivalTime: new Date("2025-12-25T08:30:00Z"),
      price: 5500,
      availableSeats: 125,
    },
    {
      flightNumber: "6E1237",
      airlineCode: "6E",
      departureCode: "AMD",
      arrivalCode: "PNQ",
      departureTime: FIXED_DATES.DEC25_9AM,
      arrivalTime: new Date("2025-12-25T11:30:00Z"),
      price: 4200,
      availableSeats: 155,
    },
    {
      flightNumber: "SG1238",
      airlineCode: "SG",
      departureCode: "PNQ",
      arrivalCode: "COK",
      departureTime: FIXED_DATES.DEC25_2PM,
      arrivalTime: new Date("2025-12-25T16:15:00Z"),
      price: 4800,
      availableSeats: 80,
    },
    {
      flightNumber: "UK1239",
      airlineCode: "UK",
      departureCode: "COK",
      arrivalCode: "GOI",
      departureTime: FIXED_DATES.DEC25_6PM,
      arrivalTime: new Date("2025-12-25T19:30:00Z"),
      price: 4500,
      availableSeats: 95,
    },
    {
      flightNumber: "G81240",
      airlineCode: "G8",
      departureCode: "GOI",
      arrivalCode: "DEL",
      departureTime: FIXED_DATES.DEC25_9PM,
      arrivalTime: new Date("2025-12-25T22:45:00Z"),
      price: 5800,
      availableSeats: 105,
    },

    // December 28, 2025 - 5 flights
    {
      flightNumber: "AI1241",
      airlineCode: "AI",
      departureCode: "DEL",
      arrivalCode: "BOM",
      departureTime: FIXED_DATES.DEC28_6AM,
      arrivalTime: new Date("2025-12-28T08:30:00Z"),
      price: 5000,
      availableSeats: 130,
    },
    {
      flightNumber: "6E1242",
      airlineCode: "6E",
      departureCode: "BOM",
      arrivalCode: "BLR",
      departureTime: FIXED_DATES.DEC28_9AM,
      arrivalTime: new Date("2025-12-28T12:30:00Z"),
      price: 7200,
      availableSeats: 160,
    },
    {
      flightNumber: "SG1243",
      airlineCode: "SG",
      departureCode: "BLR",
      arrivalCode: "MAA",
      departureTime: FIXED_DATES.DEC28_2PM,
      arrivalTime: new Date("2025-12-28T16:15:00Z"),
      price: 4000,
      availableSeats: 85,
    },
    {
      flightNumber: "UK1244",
      airlineCode: "UK",
      departureCode: "MAA",
      arrivalCode: "HYD",
      departureTime: FIXED_DATES.DEC28_6PM,
      arrivalTime: new Date("2025-12-28T19:45:00Z"),
      price: 4500,
      availableSeats: 100,
    },
    {
      flightNumber: "IX1245",
      airlineCode: "IX",
      departureCode: "HYD",
      arrivalCode: "CCU",
      departureTime: FIXED_DATES.DEC28_9PM,
      arrivalTime: new Date("2025-12-28T23:15:00Z"),
      price: 4200,
      availableSeats: 75,
    },

    // December 31, 2025 - 5 flights
    {
      flightNumber: "AI1246",
      airlineCode: "AI",
      departureCode: "CCU",
      arrivalCode: "AMD",
      departureTime: FIXED_DATES.DEC31_6AM,
      arrivalTime: new Date("2025-12-31T08:30:00Z"),
      price: 5800,
      availableSeats: 140,
    },
    {
      flightNumber: "6E1247",
      airlineCode: "6E",
      departureCode: "AMD",
      arrivalCode: "PNQ",
      departureTime: FIXED_DATES.DEC31_9AM,
      arrivalTime: new Date("2025-12-31T11:30:00Z"),
      price: 4500,
      availableSeats: 165,
    },
    {
      flightNumber: "SG1248",
      airlineCode: "SG",
      departureCode: "PNQ",
      arrivalCode: "COK",
      departureTime: FIXED_DATES.DEC31_2PM,
      arrivalTime: new Date("2025-12-31T16:15:00Z"),
      price: 5200,
      availableSeats: 90,
    },
    {
      flightNumber: "UK1249",
      airlineCode: "UK",
      departureCode: "COK",
      arrivalCode: "GOI",
      departureTime: FIXED_DATES.DEC31_6PM,
      arrivalTime: new Date("2025-12-31T19:30:00Z"),
      price: 4800,
      availableSeats: 105,
    },
    {
      flightNumber: "G81250",
      airlineCode: "G8",
      departureCode: "GOI",
      arrivalCode: "DEL",
      departureTime: FIXED_DATES.DEC31_9PM,
      arrivalTime: new Date("2025-12-31T22:45:00Z"),
      price: 6200,
      availableSeats: 115,
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
        bookingDate: new Date("2025-11-15T10:00:00Z"), // Fixed booking date
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
