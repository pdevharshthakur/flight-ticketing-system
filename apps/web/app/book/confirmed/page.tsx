"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { fetchBookings } from "@/lib/api";
import { Booking } from "@/types/booking";

const TEST_USER_EMAIL = "test@example.com";

export default function BookingConfirmedPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ref = params.get("ref") || "";

  useEffect(() => {
    const load = async () => {
      try {
        const bookings = await fetchBookings(TEST_USER_EMAIL);
        const b = bookings.find((x) => x.bookingRef === ref) || null;
        if (!b) {
          setError("Booking not found.");
        } else {
          setBooking(b);
        }
      } catch {
        setError("Failed to load booking.");
      }
    };
    if (ref) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  const title = useMemo(
    () => (booking ? `Booking ${booking.bookingRef}` : "Booking confirmed"),
    [booking],
  );

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mx-auto w-full max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              {!ref ? (
                <p className="text-muted-foreground">Missing booking reference.</p>
              ) : error ? (
                <p className="text-destructive">{error}</p>
              ) : !booking ? (
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                  <div className="border-primary h-10 w-10 animate-spin rounded-full border-b-2" />
                  <p className="text-muted-foreground">Loading booking details…</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-muted-foreground text-sm">Status</div>
                      <Badge>{booking.status}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-muted-foreground text-sm">Total</div>
                      <div className="text-2xl font-bold">
                        ₹{booking.totalPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <div className="text-muted-foreground text-sm">Flight</div>
                      <div className="font-semibold">
                        {booking.flight.flightNumber} • {booking.flight.airline.name}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-sm">Passenger(s)</div>
                      <div className="font-semibold">{booking.passengerCount}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-sm">Seats</div>
                      <div className="font-semibold">
                        {booking.seatNumbers || "Assigned at check-in"}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-sm">Route</div>
                      <div className="font-semibold">
                        {booking.flight.departure.city} ({booking.flight.departure.code}) →{" "}
                        {booking.flight.arrival.city} ({booking.flight.arrival.code})
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-sm">Departure</div>
                      <div className="font-semibold">
                        {new Date(booking.flight.departureTime).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-sm">Arrival</div>
                      <div className="font-semibold">
                        {new Date(booking.flight.arrivalTime).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <Button variant="outline" onClick={() => router.push("/search")}>
                Book another
              </Button>
              <Button onClick={() => router.push("/trips")}>Go to My Trips</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
