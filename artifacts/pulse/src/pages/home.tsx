import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Activity, ShieldCheck, Heart, FileText, MapPin, Loader2, AlertCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useGetNationalStats, getDonor, type Donor } from "@workspace/api-client-react";

interface HomeProps {
  onDonorFound?: (donor: Donor) => void;
}

export default function Home({ onDonorFound }: HomeProps) {
  const { data: stats } = useGetNationalStats();
  const [, setLocation] = useLocation();

  const [showLookup, setShowLookup] = useState(false);
  const [lookupId, setLookupId] = useState("");
  const [lookupError, setLookupError] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);

  const targetUnits = 45000;
  const currentUnits = 26000;
  const gapPercentage = Math.round(((targetUnits - currentUnits) / targetUnits) * 100);

  const bloodTypes = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

  const handleLookup = async (e: FormEvent) => {
    e.preventDefault();
    const id = lookupId.trim().toUpperCase();
    if (!id) return;
    setLookupLoading(true);
    setLookupError("");
    try {
      const donor = await getDonor(id);
      onDonorFound?.(donor);
      setLocation("/dashboard");
    } catch {
      setLookupError("Donor ID not found. Check the ID and try again.");
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative border-b border-border bg-card overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
        <div className="container mx-auto px-6 py-20 md:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-accent border border-border text-sm font-mono text-muted-foreground mb-6">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  BOTSWANA NATIONAL BLOOD GRID
                </div>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-foreground leading-[1.1]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                Official Donor Portal &<br /> Health Registry.
              </motion.h1>

              <motion.p
                className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                Pulse is the frontline system for national blood logistics. Register your profile to donate, track your clinical impact, and help stabilize the national supply chain.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-center gap-4 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Link href="/register" data-testid="hero-register-btn" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full h-12 px-8 text-base bg-primary hover:bg-primary/90">
                    <FileText className="mr-2 h-4 w-4" />
                    Begin Registration
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-12 px-8 text-base bg-card hover:bg-accent"
                  onClick={() => {
                    setShowLookup(!showLookup);
                    setLookupError("");
                    setLookupId("");
                  }}
                  data-testid="hero-dashboard-btn"
                >
                  Access Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>

              {/* Donor Lookup Inline */}
              {showLookup && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="overflow-hidden"
                >
                  <form onSubmit={handleLookup} className="bg-accent/40 border border-border rounded-lg p-4 space-y-3">
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                      Enter your Donor ID to load your profile
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={lookupId}
                        onChange={(e) => setLookupId(e.target.value)}
                        placeholder="e.g. D-2026-0891"
                        className="flex-1 h-10 px-3 text-sm font-mono bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                        autoFocus
                      />
                      <Button
                        type="submit"
                        size="sm"
                        disabled={lookupLoading || !lookupId.trim()}
                        className="h-10 px-4 bg-primary hover:bg-primary/90"
                      >
                        {lookupLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Load Profile"
                        )}
                      </Button>
                    </div>
                    {lookupError && (
                      <p className="text-xs text-destructive flex items-center gap-1.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {lookupError}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground font-mono">
                      Demo: <span className="text-foreground font-semibold">D-2026-0891</span>
                    </p>
                  </form>
                </motion.div>
              )}
            </div>

            <motion.div
              className="hidden lg:block relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-card border border-border shadow-sm rounded-lg p-8 relative z-10">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">System Telemetry</h3>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">LIVE</span>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-accent/50 p-4 rounded-md border border-border/50">
                      <p className="text-xs text-muted-foreground font-mono mb-1">UNITS IN STOCK</p>
                      <p className="text-2xl font-bold font-mono">{stats?.totalUnitsInStock?.toLocaleString() || "..."}</p>
                    </div>
                    <div className="bg-accent/50 p-4 rounded-md border border-border/50">
                      <p className="text-xs text-muted-foreground font-mono mb-1">FACILITIES ONLINE</p>
                      <p className="text-2xl font-bold font-mono">{stats?.facilitiesOnline || "..."}</p>
                    </div>
                  </div>
                  <div className="bg-destructive/5 border border-destructive/20 p-4 rounded-md flex items-center justify-between">
                    <div>
                      <p className="text-xs text-destructive font-mono mb-1">ACTIVE CRITICAL ALERTS</p>
                      <p className="text-2xl font-bold text-destructive font-mono">{stats?.activeAlerts ?? "..."}</p>
                    </div>
                    <ShieldCheck className="w-8 h-8 text-destructive/50" />
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 w-full h-full border border-border/50 rounded-lg -z-10 bg-accent/20"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Crisis Section */}
      <section className="py-20 bg-background border-b border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-1">
              <h2 className="text-2xl font-bold mb-4">National Deficit</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                The healthcare system requires {targetUnits.toLocaleString()} units annually for routine and emergency procedures. Current collection rates leave a significant margin of risk for vulnerable patients.
              </p>
            </div>

            <div className="md:col-span-2">
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-sm font-mono text-muted-foreground mb-1">CURRENT ANNUAL SUPPLY</p>
                    <p className="text-3xl font-bold font-mono">{currentUnits.toLocaleString()} <span className="text-lg text-muted-foreground font-sans font-normal">units</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-muted-foreground mb-1">TARGET</p>
                    <p className="text-3xl font-bold font-mono">{targetUnits.toLocaleString()}</p>
                  </div>
                </div>

                <div className="relative h-6 bg-accent rounded-sm overflow-hidden mb-3 border border-border/50">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-primary"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${100 - gapPercentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  >
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMikiIHN0cm9rZS13aWR0aD0iMiI+PGxpbmUgeDE9Ii0xMCIgeTE9IjQwIiB4Mj0iNDAiIHkxPSItMTAiLz48L2c+PC9zdmc+')] opacity-50"></div>
                  </motion.div>
                </div>

                <div className="flex justify-between text-xs font-mono text-muted-foreground">
                  <span>{100 - gapPercentage}% FULFILLED</span>
                  <span className="text-secondary font-medium">{gapPercentage}% DEFICIT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guidelines & Process */}
      <section className="py-24 bg-accent/20">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-2">Registration Protocol</h2>
            <p className="text-muted-foreground">Standard operating procedure for new donors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: "1. Digital Intake",
                desc: "Complete the national registry form. Personal identifiers are required for medical traceability and routing.",
              },
              {
                icon: MapPin,
                title: "2. District Assignment",
                desc: "Your profile is linked to regional facilities. The system will notify you when your blood type is critically needed locally.",
              },
              {
                icon: ShieldCheck,
                title: "3. Clinical Tracking",
                desc: "Once donated, your unit is securely logged. Monitor its temperature, status, and ultimate deployment via your dashboard.",
              },
            ].map((step, i) => (
              <div key={i} className="bg-card border border-border p-8 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center mb-6 text-primary border border-primary/20">
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blood Types Grid */}
      <section className="py-24 bg-card border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-2xl font-bold mb-2">Inventory by Phenotype</h2>
              <p className="text-muted-foreground text-sm">All blood groups are essential for grid stability.</p>
            </div>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {bloodTypes.map((type) => (
              <div
                key={type}
                className="aspect-square rounded-md border border-border bg-accent/30 flex flex-col items-center justify-center group hover:bg-primary/5 hover:border-primary/30 transition-colors"
              >
                <Heart className="w-4 h-4 text-secondary/40 mb-2 group-hover:text-secondary transition-colors" />
                <span className="text-xl font-bold font-mono text-foreground">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
