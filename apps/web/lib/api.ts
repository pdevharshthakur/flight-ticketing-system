import axios from "axios";

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
