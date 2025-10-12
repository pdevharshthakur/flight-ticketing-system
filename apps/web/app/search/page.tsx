"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import { CalendarIcon, ArrowLeftRight, Plane } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@workspace/ui/lib/utils";
import { fetchAirports, Airport } from "../../lib/api";

interface AirportState {
  code: string;
  name: string;
  city: string;
}

export default function FlightSearch() {
  const router = useRouter();
  const [airports, setAirports] = useState<AirportState[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simplified state management
  const [searchData, setSearchData] = useState({
    from: null as AirportState | null,
    to: null as AirportState | null,
    date: undefined as Date | undefined,
  });

  const [popoverStates, setPopoverStates] = useState({
    from: false,
    to: false,
    date: false,
  });

  useEffect(() => {
    const loadAirports = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedAirports = await fetchAirports();
        setAirports(fetchedAirports);
      } catch (err) {
        setError("Failed to load airports. Please try again.");
        console.error("Error fetching airports:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAirports();
  }, []);

  // Simplified handlers
  const handleSwap = () => {
    setSearchData((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  const handleSearch = () => {
    if (searchData.from && searchData.to && searchData.date) {
      const searchParams = new URLSearchParams({
        from: searchData.from.code,
        to: searchData.to.code,
        date: format(searchData.date, "yyyy-MM-dd"),
      });
      router.push(`/search/results?${searchParams.toString()}`);
    }
  };

  const isSearchDisabled = !searchData.from || !searchData.to || !searchData.date || isLoading;

  // Reusable airport selector component
  const AirportSelector = ({
    type,
    selected,
    onSelect,
    isOpen,
    onOpenChange,
  }: {
    type: "from" | "to";
    selected: AirportState | null;
    onSelect: (airport: AirportState) => void;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
  }) => (
    <div className="space-y-2">
      <label className="text-muted-foreground font-mono text-sm">{type.toUpperCase()}</label>
      <Popover open={isOpen} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="border-input bg-background hover:bg-accent h-14 w-full justify-start font-mono text-base"
          >
            {isLoading ? (
              <span className="text-muted-foreground">Loading airports...</span>
            ) : selected ? (
              <div className="flex flex-col items-start">
                <span className="text-foreground font-medium">{selected.code}</span>
                <span className="text-muted-foreground text-xs">{selected.city}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">Select airport</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search airports..." className="font-mono" />
            <CommandList>
              <CommandEmpty className="text-muted-foreground py-6 text-center font-mono text-sm">
                {isLoading ? "Loading airports..." : "No airport found."}
              </CommandEmpty>
              <CommandGroup>
                {airports.map((airport) => (
                  <CommandItem
                    key={airport.code}
                    value={`${airport.code} ${airport.name} ${airport.city}`}
                    onSelect={() => {
                      onSelect(airport);
                      onOpenChange(false);
                    }}
                    className="font-mono"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {airport.code} - {airport.city}
                      </span>
                      <span className="text-muted-foreground text-xs">{airport.name}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-lg">
              <Plane className="text-primary-foreground h-5 w-5" />
            </div>
            <h1 className="text-foreground font-mono text-2xl font-medium">Search Flights</h1>
          </div>
          <div className="text-center">
            <p className="text-destructive font-mono text-lg">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="flex items-center gap-3">
          <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-lg">
            <Plane className="text-primary-foreground h-5 w-5" />
          </div>
          <h1 className="text-foreground font-mono text-2xl font-medium">Search Flights</h1>
        </div>

        <div className="space-y-6">
          {/* From and To Fields with Swap Button */}
          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr]">
            {/* From Field */}
            <AirportSelector
              type="from"
              selected={searchData.from}
              onSelect={(airport) => setSearchData((prev) => ({ ...prev, from: airport }))}
              isOpen={popoverStates.from}
              onOpenChange={(open) => setPopoverStates((prev) => ({ ...prev, from: open }))}
            />

            {/* Swap Button */}
            <div className="flex items-end pb-2 md:pb-0 md:pt-7">
              <Button
                variant="outline"
                size="icon"
                onClick={handleSwap}
                className="border-input bg-background hover:bg-accent h-10 w-10"
                disabled={!searchData.from && !searchData.to}
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>

            {/* To Field */}
            <AirportSelector
              type="to"
              selected={searchData.to}
              onSelect={(airport) => setSearchData((prev) => ({ ...prev, to: airport }))}
              isOpen={popoverStates.to}
              onOpenChange={(open) => setPopoverStates((prev) => ({ ...prev, to: open }))}
            />
          </div>

          {/* Date Field */}
          <div className="space-y-2">
            <label className="text-muted-foreground font-mono text-sm">DEPARTURE DATE</label>
            <Popover
              open={popoverStates.date}
              onOpenChange={(open) => setPopoverStates((prev) => ({ ...prev, date: open }))}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "border-input bg-background hover:bg-accent h-14 w-full justify-start font-mono text-base",
                    !searchData.date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-3 h-4 w-4" />
                  {searchData.date ? (
                    format(searchData.date, "PPP")
                  ) : (
                    <span>Select departure date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={searchData.date}
                  onSelect={(date) => {
                    setSearchData((prev) => ({ ...prev, date }));
                    setPopoverStates((prev) => ({ ...prev, date: false }));
                  }}
                  disabled={(date: Date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={isSearchDisabled}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-full font-mono text-base font-medium disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Search Flights"}
          </Button>
        </div>
      </div>
    </div>
  );
}
