export interface Booking {
  id: string;
  bookingRef: string;
  status: string;
  totalPrice: number;
  bookingDate: string;
  passengerCount: number;
  seatNumbers: string;
  flight: {
    id: string;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
    status: string;
    airline: {
      id: string;
      code: string;
      name: string;
    };
    departure: {
      id: string;
      code: string;
      name: string;
      city: string;
      country: string;
    };
    arrival: {
      id: string;
      code: string;
      name: string;
      city: string;
      country: string;
    };
  };
}

export type BookingStatus = "CONFIRMED" | "CANCELLED" | "COMPLETED" | "PENDING" | "REFUNDED";
