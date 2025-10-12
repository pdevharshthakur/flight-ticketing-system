export interface FlightSearchParams {
  from: string;
  to: string;
  date: string;
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: {
    code: string;
    name: string;
  };
  departure: {
    code: string;
    city: string;
  };
  arrival: {
    code: string;
    city: string;
  };
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
  status: string;
}
