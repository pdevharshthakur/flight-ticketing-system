"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { fetchBookings } from "@/lib/api";
import { Booking } from "@/types/booking";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Calendar, Clock, Users, MapPin, Plane, Ticket } from "lucide-react";
import { Skeleton } from "@workspace/ui/components/skeleton";

const TEST_USER_EMAIL = "test@example.com";

export default function TripsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        const data = await fetchBookings(TEST_USER_EMAIL);
        setBookings(data);
      } catch (err) {
        setError("Failed to load bookings. Please try again.");
        console.error("Error loading bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="mb-2 h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold text-red-600">Error</h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">My Trips</h1>
          <p className="text-gray-600">View and manage your flight bookings</p>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Plane className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">No bookings found</h3>
              <p className="text-gray-600">
                You don't have any flight bookings yet. Start by searching for flights.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Ticket className="h-5 w-5 text-blue-600" />
                        {booking.bookingRef}
                      </CardTitle>
                      <p className="mt-1 text-sm text-gray-600">
                        Booked on {formatDate(booking.bookingDate)}
                      </p>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Flight Details */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Plane className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold">{booking.flight.flightNumber}</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-600">{booking.flight.airline.name}</span>
                      </div>
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          {booking.flight.departure.city} ({booking.flight.departure.code})
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className="font-medium">
                          {booking.flight.arrival.city} ({booking.flight.arrival.code})
                        </span>
                      </div>
                    </div>

                    {/* Time Details */}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{formatDate(booking.flight.departureTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {formatTime(booking.flight.departureTime)} -{" "}
                          {formatTime(booking.flight.arrivalTime)}
                        </span>
                      </div>
                    </div>

                    {/* Passenger and Price Info */}
                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {booking.passengerCount} passenger{booking.passengerCount > 1 ? "s" : ""}
                          {booking.seatNumbers && ` • Seats: ${booking.seatNumbers}`}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          ₹{booking.totalPrice.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          ₹{booking.flight.price.toLocaleString()} per passenger
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
