import axios from "axios";
import { Booking } from "@/types/booking";
import { Flight } from "@/types/flight";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  timeout: 10000,
});

export interface Airport {
  id: string;
  code: string;
  name: string;
  city: string;
  country: string;
}

export const fetchAirports = async (): Promise<Airport[]> => {
  const response = await api.get<Airport[]>("/airports");
  return response.data;
};

export const fetchBookings = async (email: string): Promise<Booking[]> => {
  const response = await api.get<Booking[]>("/bookings", {
    params: { email },
  });
  return response.data;
};

export interface CreateBookingRequest {
  flightId: string;
  passengerCount: number;
  email: string;
}

export const createBooking = async (payload: CreateBookingRequest): Promise<Booking> => {
  const response = await api.post<Booking>("/bookings", payload);
  return response.data;
};
