import { useState, type FormEvent } from "react";
import { useGetDonor, getDonor, type Donor } from "@workspace/api-client-react";
import { Calendar, Award, Activity, History, ArrowRight, ShieldCheck, MapPin, HeartPulse, FileText, Loader2, AlertCircle, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { downloadDonorCardPng } from "@/lib/donor-card-download";

interface DashboardProps {
  donor: Donor | null;
  onDonorFound?: (donor: Donor) => void;
}

export default function Dashboard({ donor, onDonorFound }: DashboardProps) {
  // When no donor in session — show lookup form
  if (!donor || !donor.donorId) {
    return <DonorLookup onDonorFound={onDonorFound} />;
  }

  return <DonorDashboard donor={donor} />;
}

// ── Lookup form shown when no donor is in session ────────────────────────────
function DonorLookup({ onDonorFound }: { onDonorFound?: (d: Donor) => void }) {
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [found, setFound] = useState<Donor | null>(null);

  const handleLookup = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = id.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setError("");
    try {
      const donor = await getDonor(trimmed);
      setFound(donor);
      onDonorFound?.(donor);
    } catch {
      setError("Donor ID not found. Check the ID and try again.");
    } finally {
      setLoading(false);
    }
  };

  // If lookup succeeded, render the real dashboard
  if (found) {
    return <DonorDashboard donor={found} />;
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background bg-dots-pattern flex items-center justify-center">
      <div className="max-w-md w-full px-6">
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-accent/50 px-8 py-4 border-b border-border flex items-center gap-3">
            <Search className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-semibold text-sm">Access Your Dashboard</h2>
          </div>
          <div className="p-8 space-y-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Enter your Donor ID to load your profile. Your ID was assigned after registration and displayed on your confirmation screen.
            </p>

            <form onSubmit={handleLookup} className="space-y-4">
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground block">
                  Donor ID
                </label>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="e.g. D-2026-0891"
                  className="w-full h-11 px-3 text-sm font-mono bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  autoFocus
                />
                {error && (
                  <p className="text-xs text-destructive flex items-center gap-1.5">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90"
                disabled={loading || !id.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Looking up profile...
                  </>
                ) : (
                  "Load Profile"
                )}
              </Button>
            </form>

            <div className="bg-accent/30 border border-border rounded-md p-4 text-xs space-y-1.5">
              <p className="font-mono text-muted-foreground uppercase tracking-wider text-[10px] mb-2">Demo Credentials</p>
              <p className="font-mono"><span className="text-muted-foreground">ID: </span><span className="font-bold text-foreground">D-2026-0891</span> — Kabo Sithole · O+</p>
              <p className="font-mono"><span className="text-muted-foreground">ID: </span><span className="font-bold text-foreground">D-2026-0892</span> — Naledi Mosweu · A-</p>
              <p className="font-mono"><span className="text-muted-foreground">ID: </span><span className="font-bold text-foreground">D-2026-0893</span> — Tebogo Gabaitse · B+</p>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              New donor?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Begin Registration
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main dashboard (donor loaded) ────────────────────────────────────────────
function DonorDashboard({ donor }: { donor: Donor }) {
  const donorId = donor.donorId as string;
  const [downloadingCard, setDownloadingCard] = useState(false);
  // useGetDonor auto-enables when donorId is defined (generated hook behaviour)
  const { data: liveDonor } = useGetDonor(donorId);

  const displayDonor = liveDonor || donor;

  const totalDonations = displayDonor.totalDonations || 0;
  const livesSaved = totalDonations * 3;
  const airtimeEarned = displayDonor.airtimeEarned || 0;
  const hasHistory = totalDonations > 0;

  const handleDownloadCard = async () => {
    setDownloadingCard(true);
    try {
      await downloadDonorCardPng({
        name: displayDonor.name,
        donorId,
        bloodType: displayDonor.bloodType,
        district: displayDonor.district,
        nextEligibleDate: displayDonor.nextEligibleDate,
        status: displayDonor.status,
      });
    } finally {
      setDownloadingCard(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background bg-grid-pattern">
      <div className="container mx-auto px-6 max-w-6xl">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Donor Dashboard</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2 font-mono uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Secure Session Active
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Donation
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Identity Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm sticky top-24">
              <div className="bg-accent/50 px-6 py-4 border-b border-border flex justify-between items-center">
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Identity Card</span>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <div className={`w-2 h-2 rounded-full ${displayDonor.status === "active" ? "bg-green-500" : "bg-amber-500"}`}></div>
                  <span className="uppercase">{displayDonor.status || "Active"}</span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-border">
                  <div className="w-12 h-12 bg-primary/10 rounded border border-primary/20 flex items-center justify-center shrink-0">
                    <UserInitials name={displayDonor.name || "?"} />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg leading-tight">{displayDonor.name}</h2>
                    <p className="font-mono text-xs text-muted-foreground mt-1 tracking-tight">ID: {displayDonor.donorId}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6 pb-6 border-b border-border">
                  <span className="text-sm text-muted-foreground">Registered Phenotype</span>
                  <div className="bg-secondary/10 text-secondary border border-secondary/20 px-4 py-2 rounded font-mono font-bold text-xl">
                    {displayDonor.bloodType}
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-2"><MapPin className="w-4 h-4" /> District</span>
                    <span className="font-medium text-right">{displayDonor.district}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4" /> Reg. Date</span>
                    <span className="font-medium text-right font-mono">
                      {displayDonor.registeredAt
                        ? new Date(displayDonor.registeredAt).toLocaleDateString()
                        : "Today"}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-6"
                  onClick={handleDownloadCard}
                  disabled={downloadingCard}
                >
                  <Download className="w-4 h-4" />
                  {downloadingCard ? "Preparing card..." : "Download donor card"}
                </Button>
              </div>
            </div>
          </div>

          {/* Main Dashboard Area */}
          <div className="lg:col-span-8 space-y-6">

            {/* Clinical Readiness */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Clinical Readiness
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  {displayDonor.nextEligibleDate ? (
                    <div>
                      <p className="text-sm text-muted-foreground font-mono mb-2 uppercase tracking-wider">Next Eligible Date</p>
                      <p className="text-3xl font-bold font-mono mb-4">
                        {new Date(displayDonor.nextEligibleDate).toLocaleDateString()}
                      </p>
                      <Progress value={75} className="h-1.5 mb-2 bg-accent" />
                      <p className="text-xs text-muted-foreground text-right font-mono">RECOVERY IN PROGRESS</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-muted-foreground font-mono mb-2 uppercase tracking-wider">Status</p>
                      <p className="text-2xl font-bold text-green-600 mb-2">Cleared for Donation</p>
                      <p className="text-sm text-muted-foreground">Iron levels presumed fully replenished based on history.</p>
                    </div>
                  )}
                </div>
                <div className="bg-accent/50 p-4 rounded border border-border/50">
                  <p className="text-xs font-semibold mb-2">Pre-donation Checklist:</p>
                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li className="flex items-center gap-2"><CheckCircleIcon className="w-3 h-3 text-primary" /> Hydrate well (16oz water)</li>
                    <li className="flex items-center gap-2"><CheckCircleIcon className="w-3 h-3 text-primary" /> Eat a healthy meal</li>
                    <li className="flex items-center gap-2"><CheckCircleIcon className="w-3 h-3 text-primary" /> Bring valid ID</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Impact Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Clinical Impact</p>
                  <HeartPulse className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-bold font-mono">{livesSaved}</span>
                  </div>
                  <p className="text-sm font-medium">Estimated lives impacted</p>
                  <p className="text-xs text-muted-foreground mt-2">Based on {totalDonations} registered units.</p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Donor Rewards</p>
                  <Award className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xl font-bold text-muted-foreground">BWP</span>
                    <span className="text-4xl font-bold font-mono">{airtimeEarned.toFixed(2)}</span>
                  </div>
                  <p className="text-sm font-medium">Airtime value earned</p>
                  <p className="text-xs text-muted-foreground mt-2">Redeemable directly to registered mobile.</p>
                </div>
              </div>
            </div>

            {/* Donation Ledger */}
            <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
              <div className="bg-accent/50 px-6 py-4 border-b border-border flex justify-between items-center">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <History className="w-4 h-4 text-muted-foreground" />
                  Donation Ledger
                </h3>
                <Button variant="ghost" size="sm" className="h-6 text-xs font-mono">
                  VIEW FULL <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>

              {hasHistory ? (
                <div className="divide-y divide-border">
                  {Array.from({ length: Math.min(totalDonations, 3) }).map((_, i) => (
                    <div key={i} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-accent/20 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">Whole Blood Draw</h4>
                          <p className="text-xs text-muted-foreground font-mono mt-1">
                            BW-2026-{String(8000 + i * 100 + 21).padStart(6, "0")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-right">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs text-muted-foreground mb-1">DATE</span>
                          <span className="font-medium">
                            {new Date(Date.now() - (i + 1) * 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-mono text-xs text-muted-foreground mb-1">STATUS</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-green-500/10 text-green-600 font-bold border border-green-500/20 uppercase">
                            {i === 0 ? "Transfused" : "Available"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded bg-accent border border-border flex items-center justify-center mb-4">
                    <History className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-sm mb-2">No Clinical Records Found</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-6 leading-relaxed">
                    Your ledger is currently empty. Your first successful donation will generate an immutable record on the national bloodchain.
                  </p>
                  <Button variant="outline" size="sm" className="font-mono text-xs">
                    Locate Facility
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function UserInitials({ name }: { name: string }) {
  const parts = name.split(" ");
  const initials =
    parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : parts[0].substring(0, 2);
  return (
    <span className="font-bold text-lg uppercase text-primary font-mono">{initials}</span>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
