import Link from "next/link";
import { Plane } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

export function Header() {
  return (
    <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-18 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Plane className="text-primary h-6 w-6" />
            <span className="text-foreground font-mono text-xl font-semibold">SkyBook</span>
          </Link>
          {/* Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/trips"
              className="text-foreground hover:text-primary text-sm font-medium transition-colors"
            >
              <Button variant={"outline"}>My Trips</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
