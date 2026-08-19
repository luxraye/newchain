import { useGetNationalShortage, useGetFacilities, useRouteBloodRequest } from "@workspace/api-client-react";
import { AlertTriangle, ArrowRight, Route, ShieldAlert, Crosshair, Map } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

const routeSchema = z.object({
  bloodType: z.string().min(1, "Required"),
  requestingFacilityId: z.string().min(1, "Required"),
  units: z.coerce.number().min(1, "Minimum 1 unit").max(100),
  urgency: z.enum(["routine", "urgent", "emergency"])
});

type RouteFormValues = z.infer<typeof routeSchema>;

export function AlertsPage() {
  const { data: shortageData, isLoading: shortageLoading } = useGetNationalShortage({ query: { refetchInterval: 30000 } });
  const { data: facilitiesData } = useGetFacilities();
  const routeMutation = useRouteBloodRequest();
  const { toast } = useToast();

  const [routingResult, setRoutingResult] = useState<any>(null);

  const form = useForm<RouteFormValues>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      bloodType: "",
      requestingFacilityId: "",
      units: 1,
      urgency: "urgent"
    }
  });

  const onSubmit = (data: RouteFormValues) => {
    setRoutingResult(null);
    routeMutation.mutate({ data }, {
      onSuccess: (res) => {
        setRoutingResult(res);
        toast({
          title: "Routing Simulation Complete",
          description: `Found ${res.candidates?.length || 0} potential source facilities.`,
        });
      },
      onError: (err) => {
        toast({
          title: "Routing Failed",
          description: "Could not calculate routes. Try different parameters.",
          variant: "destructive"
        });
      }
    });
  };

  const shortages = shortageData?.shortages?.filter(s => s.shortage) || [];

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <div className="mb-6">
        <h2 className="font-mono text-xl tracking-widest uppercase text-foreground flex items-center gap-3">
          <Route className="w-5 h-5 text-secondary" />
          Alert Routing Simulator
        </h2>
        <p className="font-mono text-xs text-muted-foreground mt-1">CALCULATE OPTIMAL BLOOD TRANSFERS BETWEEN NODES</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Shortages */}
        <div className="border border-border bg-card/40 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-destructive m-1" />
          <div className="p-4 border-b border-border/50 bg-black/20 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-destructive" />
            <h3 className="font-mono text-sm tracking-widest uppercase">System Shortages</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {shortageLoading ? (
              <div className="font-mono text-xs text-muted-foreground animate-pulse">ANALYZING NETWORK...</div>
            ) : shortages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-success opacity-70">
                <div className="font-mono text-sm border border-success/30 px-4 py-2 bg-success/5">SYSTEM NOMINAL — NO SHORTAGES</div>
              </div>
            ) : (
              shortages.map((s, i) => (
                <div key={i} className="border border-destructive/30 bg-destructive/5 p-4 flex items-center justify-between group cursor-pointer hover:bg-destructive/10 transition-colors"
                  onClick={() => form.setValue('bloodType', s.bloodType || "")}
                >
                  <div className="flex items-center gap-4">
                    <div className="font-display text-2xl font-bold text-destructive w-12 text-center">{s.bloodType}</div>
                    <div className="h-10 w-[1px] bg-destructive/20" />
                    <div>
                      <div className="font-mono text-xs text-muted-foreground mb-1">AFFECTED NODES: {s.criticalFacilities}</div>
                      <div className="font-mono text-sm text-foreground">TOTAL DEFICIT: {s.totalThreshold && s.totalStock ? s.totalThreshold - s.totalStock : 0} U</div>
                    </div>
                  </div>
                  <div className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 font-mono text-[10px]">
                    USE IN SIM <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Simulator */}
        <div className="border border-border bg-card/40 flex flex-col">
          <div className="p-4 border-b border-border/50 bg-black/20 flex items-center gap-2">
            <Crosshair className="h-4 w-4 text-secondary" />
            <h3 className="font-mono text-sm tracking-widest uppercase">Torrent Route Calculator</h3>
          </div>
          
          <div className="p-4 border-b border-border/30">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-muted-foreground uppercase">Target Blood Type</label>
                  <select 
                    {...form.register("bloodType")}
                    className="w-full bg-black/40 border border-border/50 focus:border-secondary font-mono text-xs p-2.5 text-foreground outline-none"
                  >
                    <option value="">SELECT TYPE...</option>
                    {["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-muted-foreground uppercase">Units Required</label>
                  <input 
                    type="number" 
                    {...form.register("units")}
                    className="w-full bg-black/40 border border-border/50 focus:border-secondary font-mono text-xs p-2.5 text-foreground outline-none"
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-muted-foreground uppercase">Requesting Node</label>
                  <select 
                    {...form.register("requestingFacilityId")}
                    className="w-full bg-black/40 border border-border/50 focus:border-secondary font-mono text-xs p-2.5 text-foreground outline-none"
                  >
                    <option value="">SELECT NODE...</option>
                    {facilitiesData?.facilities?.map(f => (
                      <option key={f.facilityId} value={f.facilityId}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-muted-foreground uppercase">Urgency Level</label>
                  <select 
                    {...form.register("urgency")}
                    className="w-full bg-black/40 border border-border/50 focus:border-secondary font-mono text-xs p-2.5 text-foreground outline-none"
                  >
                    <option value="routine">ROUTINE</option>
                    <option value="urgent">URGENT</option>
                    <option value="emergency">EMERGENCY</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={routeMutation.isPending}
                className="w-full bg-secondary/10 hover:bg-secondary/20 border border-secondary text-secondary font-mono text-xs py-3 font-bold tracking-widest uppercase transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {routeMutation.isPending ? "CALCULATING VECTORS..." : "INITIALIZE ROUTING SEQUENCE"}
              </button>
            </form>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-black/20">
            {!routingResult && !routeMutation.isPending && (
              <div className="h-full flex flex-col items-center justify-center opacity-30 font-mono text-xs gap-2">
                <Map className="w-8 h-8" />
                AWAITING SIMULATION PARAMETERS
              </div>
            )}

            {routeMutation.isPending && (
              <div className="font-mono text-xs text-secondary animate-pulse space-y-2">
                <div>&gt; ESTIMATING DISTANCES...</div>
                <div>&gt; CHECKING NODE INVENTORIES...</div>
                <div>&gt; OPTIMIZING PATHS...</div>
              </div>
            )}

            {routingResult && (
              <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                <div className="font-mono text-xs text-muted-foreground border-b border-border/50 pb-2 flex justify-between">
                  <span>SIMULATION RESULTS</span>
                  <span className="text-secondary">[{routingResult.candidates?.length} CANDIDATES FOUND]</span>
                </div>

                {routingResult.candidates?.map((candidate: any, idx: number) => (
                  <div key={candidate.facilityId} className="border border-border/50 bg-card p-3 relative">
                    {idx === 0 && (
                      <div className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground font-mono text-[9px] px-2 py-0.5 font-bold tracking-widest border border-secondary">
                        OPTIMAL
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-mono text-sm font-bold text-primary-foreground">{candidate.name}</div>
                      <div className="font-mono text-lg font-bold text-success">{candidate.availableUnits} U</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-muted-foreground">
                      <div className="bg-black/30 p-1.5 border border-border/30 text-center">
                        <div className="opacity-60 mb-0.5">DISTANCE</div>
                        <div className="text-foreground">{candidate.distanceKm} KM</div>
                      </div>
                      <div className="bg-black/30 p-1.5 border border-border/30 text-center">
                        <div className="opacity-60 mb-0.5">EST. TIME</div>
                        <div className="text-foreground">{candidate.etaMinutes} MIN</div>
                      </div>
                      <div className="bg-black/30 p-1.5 border border-border/30 text-center">
                        <div className="opacity-60 mb-0.5">VIABILITY SCORE</div>
                        <div className="text-secondary">{Math.round(candidate.score || 0)}</div>
                      </div>
                    </div>
                  </div>
                ))}

                {routingResult.candidates?.length === 0 && (
                  <div className="border border-destructive/50 bg-destructive/10 p-4 text-center">
                    <AlertTriangle className="w-6 h-6 text-destructive mx-auto mb-2" />
                    <div className="font-mono text-xs text-destructive">NO VIABLE SOURCES FOUND IN NETWORK</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
