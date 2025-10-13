"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { createBooking } from "@/lib/api";

const TEST_USER_EMAIL = "test@example.com";

export default function ProcessingBookingPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const flightId = params.get("flightId");
      const count = Number(params.get("count") || "1");
      if (!flightId) {
        setError("Missing flightId");
        return;
      }
      try {
        const booking = await createBooking({
          flightId,
          passengerCount: Number.isFinite(count) && count > 0 ? count : 1,
          email: TEST_USER_EMAIL,
        });
        await new Promise((resolve) => setTimeout(resolve, 3000));
        router.replace(`/book/confirmed?ref=${encodeURIComponent(booking.bookingRef)}`);
      } catch (e) {
        setError("Failed to create booking. Please try again.");
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mx-auto w-full max-w-xl">
          <Card>
            <CardHeader>
              <CardTitle>Processing your booking</CardTitle>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="space-y-4 text-center">
                  <p className="text-destructive">{error}</p>
                  <Button variant="outline" onClick={() => router.back()}>
                    Go Back
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                  <div className="border-primary h-10 w-10 animate-spin rounded-full border-b-2" />
                  <p className="text-muted-foreground">Hold on while we confirm your seat…</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
