"use client";

import { useMemo, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { format, parseISO, isValid as isValidDate } from "date-fns";
import { ArrowLeft } from "lucide-react";

import { Header } from "@/components/header";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { api } from "@/lib/api";
import { Flight } from "@/types/flight";

type ValidParams = {
  from: string;
  to: string;
  date: string;
};

export default function ResultsPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simplified validation
  const validated = useMemo(() => {
    const from = params.get("from")?.toUpperCase() ?? "";
    const to = params.get("to")?.toUpperCase() ?? "";
    const date = params.get("date") ?? "";

    const isValidAirportCode = (code: string) => /^[A-Z]{3}$/.test(code);
    const isValidDateString = (dateStr: string) => {
      if (!dateStr) return false;
      const dateObj = parseISO(dateStr);
      return isValidDate(dateObj);
    };

    const isValid = isValidAirportCode(from) && isValidAirportCode(to) && isValidDateString(date);

    return {
      ok: isValid,
      data: isValid ? ({ from, to, date } as ValidParams) : null,
    };
  }, [params]);

  useEffect(() => {
    if (validated.ok && validated.data) {
      const { from, to, date } = validated.data;
      fetchFlights(from, to, date);
    } else if (!validated.ok) {
      setLoading(false);
    }
  }, [validated]);

  const fetchFlights = async (from: string, to: string, date: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/search/flights", {
        params: { from, to, date },
      });
      setFlights(response.data);
    } catch (err) {
      setError("Failed to fetch flights. Please try again.");
      console.error("Error fetching flights:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!validated.ok) {
    return (
      <div className="bg-background flex min-h-screen flex-col">
        <Header />
        <main className="container mx-auto flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-xl text-center">
            <h1 className="mb-2 text-2xl font-semibold">Invalid search</h1>
            <p className="text-muted-foreground mb-6 text-sm">
              Please go back and enter valid details.
            </p>
            <Button onClick={() => router.push("/search")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to search
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const { from, to, date } = validated.data || { from: "", to: "", date: "" };
  const dateLabel = date ? format(parseISO(date), "PPP") : "";

  const formatTime = (isoString: string) => {
    return format(parseISO(isoString), "HH:mm");
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              {from} → {to}
            </h1>
            <p className="text-muted-foreground text-sm">{dateLabel}</p>
          </div>
          <Button variant="ghost" onClick={() => router.push("/search")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Modify search
          </Button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="border-primary mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
            <div className="text-muted-foreground">Searching for flights...</div>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-destructive mb-4 text-center">{error}</div>
            <Button variant="outline" onClick={() => window.location.reload()} className="mt-2">
              Try Again
            </Button>
          </div>
        )}

        {!loading && !error && flights.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-muted-foreground mb-4 text-center">
              No flights found for your search criteria.
            </div>
            <div className="text-muted-foreground mb-6 text-center text-sm">
              Try adjusting your search parameters or selecting a different date.
            </div>
            <Button variant="outline" onClick={() => router.push("/search")}>
              Modify Search
            </Button>
          </div>
        )}

        {!loading && !error && flights.length > 0 && (
          <div className="grid gap-4">
            {flights.map((flight) => (
              <Card key={flight.id} className="overflow-hidden transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg font-semibold">{flight.airline.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {flight.flightNumber}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-primary text-2xl font-bold">
                      {formatPrice(flight.price)}
                    </div>
                    <div className="text-muted-foreground text-xs">per person</div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="text-center sm:text-left">
                      <div className="text-muted-foreground text-sm">Departure</div>
                      <div className="text-xl font-semibold">
                        {formatTime(flight.departureTime)}
                      </div>
                      <div className="text-muted-foreground text-sm">{flight.departure.code}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-muted-foreground text-sm">Duration</div>
                      <div className="font-medium">{flight.duration}</div>
                      <div className="text-muted-foreground mt-1 text-xs">Direct flight</div>
                    </div>
                    <div className="text-center sm:text-right">
                      <div className="text-muted-foreground text-sm">Arrival</div>
                      <div className="text-xl font-semibold">{formatTime(flight.arrivalTime)}</div>
                      <div className="text-muted-foreground text-sm">{flight.arrival.code}</div>
                    </div>
                  </div>
                  <div className="mt-4 border-t pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {flight.availableSeats} seats available
                      </span>
                      <Badge
                        variant={flight.status === "on-time" ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {flight.status}
                      </Badge>
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
