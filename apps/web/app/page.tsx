import { Header } from "@/components/header";
import { Button } from "@workspace/ui/components/button";
import { Search } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mt-10 flex-1">
        <section className="relative py-20 sm:py-32 lg:py-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              {/* Heading */}
              <h1 className="text-foreground mb-6 text-balance text-4xl font-bold sm:text-5xl lg:text-6xl">
                Find Your Perfect Flight
              </h1>

              {/* Subheading */}
              <p className="text-muted-foreground mb-10 text-pretty text-lg sm:text-xl">
                Search and compare flights from hundreds of airlines to get the best deals for your
                next journey.
              </p>

              {/* CTA Button */}
              <Button size="lg" className="h-auto p-3 text-base" variant={"outline"} asChild>
                <a href="/search">
                  <Search className="mr-2 h-5 w-5" />
                  Search Flights
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
