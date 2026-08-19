import { Link, useLocation } from "wouter";
import { Activity, LogIn, ChevronRight, User } from "lucide-react";
import { Button } from "./ui/button";
import { Donor } from "@workspace/api-client-react";

export function Navbar({ donor }: { donor: Donor | null }) {
  const [location] = useLocation();

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group" data-testid="link-home">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-lg tracking-tight text-foreground">PULSE</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Donor Portal</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link 
              href="/knowledge" 
              className={`transition-colors ${
                location === '/knowledge' 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Eligibility & Guidelines
            </Link>
            <Link 
              href="/facilities" 
              className={`transition-colors ${
                location === '/facilities' 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Facility Network
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {donor ? (
            <Link href="/dashboard" data-testid="link-dashboard">
              <Button variant="outline" className="gap-2 bg-background hover:bg-accent text-foreground font-mono text-sm shadow-sm">
                <User className="w-4 h-4 text-primary" />
                {donor.donorId?.substring(0,8)}
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/dashboard" data-testid="link-sign-in">
                <Button variant="ghost" className="hidden sm:flex text-muted-foreground hover:text-foreground">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link href="/register" data-testid="link-register">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                  Register as Donor
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
