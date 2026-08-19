import React, { useState } from "react";
import { useRouteBloodRequest, useGetNationalShortage, useGetFacilities } from "@workspace/api-client-react";
import { ArrowRightLeft, Target, AlertTriangle, ShieldAlert, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Transfers({ facilityId }: { facilityId: string }) {
  const { data: shortageData, isLoading: shortageLoading } = useGetNationalShortage({
    query: { refetchInterval: 30000 }
  });

  const routeMutation = useRouteBloodRequest();

  const [formData, setFormData] = useState({
    bloodType: "O-",
    units: 5,
    urgency: "urgent" as "routine" | "urgent" | "emergency"
  });

  const [dispatchedCandidates, setDispatchedCandidates] = useState<Record<string, boolean>>({});

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    routeMutation.mutate({
      data: {
        bloodType: formData.bloodType,
        units: formData.units,
        requestingFacilityId: facilityId,
        urgency: formData.urgency
      }
    });
  };

  const handleDispatch = (candidateId: string) => {
    setDispatchedCandidates(prev => ({ ...prev, [candidateId]: true }));
    // In a real app, this would hit an API endpoint to confirm the transfer execution
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="border-b border-secondary/20 pb-4">
        <h1 className="text-3xl font-display font-bold text-white uppercase tracking-tight">Routing Control</h1>
        <p className="text-secondary/60 font-mono text-sm mt-1 uppercase tracking-widest">Emergency torrent pathfinding & logistics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Request Form */}
        <div className="space-y-6">
          <div className="terminal-panel p-6 border-t-2 border-t-secondary">
            <h2 className="font-mono text-secondary uppercase tracking-widest text-sm flex items-center gap-2 mb-6">
              <Target className="w-4 h-4" /> Request Route
            </h2>
            
            <form onSubmit={handleSearch} className="space-y-5 font-mono text-sm">
              <div className="space-y-2">
                <label className="text-secondary uppercase tracking-widest text-[10px] block">Target Blood Type</label>
                <select 
                  value={formData.bloodType}
                  onChange={(e) => setFormData(prev => ({...prev, bloodType: e.target.value}))}
                  className="w-full bg-black/50 border border-secondary/30 p-2 text-white focus:outline-none focus:border-secondary"
                >
                  {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(bt => (
                    <option key={bt} value={bt}>{bt}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-secondary uppercase tracking-widest text-[10px] block">Required Units</label>
                <input 
                  type="number"
                  min="1"
                  max="100"
                  value={formData.units}
                  onChange={(e) => setFormData(prev => ({...prev, units: parseInt(e.target.value)}))}
                  className="w-full bg-black/50 border border-secondary/30 p-2 text-white focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-secondary uppercase tracking-widest text-[10px] block">Urgency Protocol</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["routine", "urgent", "emergency"] as const).map(urg => (
                    <button
                      key={urg}
                      type="button"
                      onClick={() => setFormData(prev => ({...prev, urgency: urg}))}
                      className={cn(
                        "p-2 text-[10px] uppercase border transition-colors",
                        formData.urgency === urg 
                          ? urg === 'emergency' ? "bg-primary border-primary text-white shadow-[0_0_10px_rgba(225,29,72,0.5)]" 
                            : urg === 'urgent' ? "bg-accent border-accent text-black"
                            : "bg-secondary border-secondary text-black"
                          : "bg-black/50 border-white/10 text-slate-500 hover:border-white/30"
                      )}
                    >
                      {urg}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                disabled={routeMutation.isPending}
                className="w-full py-3 mt-4 bg-transparent border border-secondary text-secondary hover:bg-secondary hover:text-black uppercase tracking-widest text-xs font-bold transition-all disabled:opacity-50"
              >
                {routeMutation.isPending ? "COMPUTING ROUTES..." : "EXECUTE ROUTE SEARCH"}
              </button>
            </form>
          </div>

          <div className="terminal-panel p-6 border border-primary/20 bg-[#12080a]">
            <h2 className="font-mono text-primary uppercase tracking-widest text-xs flex items-center gap-2 mb-4">
              <ShieldAlert className="w-4 h-4" /> Global Shortages
            </h2>
            <div className="space-y-2 font-mono text-[10px]">
              {shortageLoading ? (
                <div className="text-primary/50 animate-pulse">Scanning net...</div>
              ) : shortageData?.shortages?.filter(s => s.shortage).length ? (
                shortageData.shortages.filter(s => s.shortage).map((s, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-primary/10 pb-2">
                    <span className="text-primary font-bold text-lg">{s.bloodType}</span>
                    <div className="text-right">
                      <div className="text-primary/80">NET STOCK: {s.totalStock}</div>
                      <div className="text-primary/50">{s.criticalFacilities} Facilities Critical</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-green-500">No active shortages detected.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Route Candidates */}
        <div className="lg:col-span-2 terminal-panel p-0 flex flex-col h-full min-h-[500px] border-l-2 border-l-cyan-500">
          <div className="p-4 border-b border-white/10 bg-black/20">
            <h2 className="font-mono text-white uppercase tracking-widest text-sm">Calculated Trajectories</h2>
          </div>

          <div className="flex-1 p-6">
            {!routeMutation.data && !routeMutation.isPending && (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 font-mono space-y-4">
                <ArrowRightLeft className="w-12 h-12 opacity-20" />
                <div>AWAITING ROUTE PARAMETERS...</div>
              </div>
            )}

            {routeMutation.isPending && (
              <div className="h-full flex flex-col items-center justify-center text-secondary font-mono space-y-4">
                <div className="w-12 h-12 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                <div className="animate-pulse tracking-widest">OPTIMIZING TORRENT PATHS...</div>
              </div>
            )}

            {routeMutation.data?.candidates && routeMutation.data.candidates.length > 0 && (
              <div className="space-y-4">
                {routeMutation.data.candidates.map((candidate, idx) => {
                  const isDispatched = dispatchedCandidates[candidate.facilityId!];
                  
                  return (
                    <div 
                      key={candidate.facilityId} 
                      className={cn(
                        "border p-4 font-mono relative overflow-hidden transition-all",
                        isDispatched 
                          ? "border-green-500/30 bg-green-950/20" 
                          : idx === 0 
                            ? "border-secondary/50 bg-secondary/10 shadow-[inset_4px_0_0_rgba(0,212,255,1)]" 
                            : "border-white/10 bg-black/20"
                      )}
                    >
                      {/* Score Badge */}
                      <div className="absolute top-0 right-0 bg-black/50 border-b border-l border-white/10 px-2 py-1 text-[10px] text-slate-500">
                        Match Score: {(candidate.score || 0).toFixed(2)}
                      </div>

                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                          <div className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                            {candidate.name} 
                            {idx === 0 && !isDispatched && <span className="text-[10px] bg-secondary text-black px-1.5 py-0.5 uppercase tracking-widest">Optimal</span>}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-widest">
                            ID: {candidate.facilityId} | Dist: {candidate.district}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6 text-center">
                          <div>
                            <div className="text-[10px] text-slate-500 uppercase">Available</div>
                            <div className={cn("text-lg font-bold", (candidate.availableUnits || 0) >= formData.units ? "text-green-500" : "text-accent")}>
                              {candidate.availableUnits}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-500 uppercase">Distance</div>
                            <div className="text-lg text-white">{candidate.distanceKm} <span className="text-xs">km</span></div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-500 uppercase">ETA</div>
                            <div className="text-lg text-white">{candidate.etaMinutes} <span className="text-xs">m</span></div>
                          </div>
                        </div>

                        <div className="md:w-32 flex-shrink-0">
                          <button
                            onClick={() => handleDispatch(candidate.facilityId!)}
                            disabled={isDispatched}
                            className={cn(
                              "w-full py-2 text-xs uppercase tracking-widest font-bold border transition-colors",
                              isDispatched
                                ? "bg-green-500/20 text-green-500 border-green-500/30 cursor-not-allowed flex items-center justify-center gap-1"
                                : "bg-transparent text-white border-white/30 hover:border-white hover:bg-white hover:text-black"
                            )}
                          >
                            {isDispatched ? <><Check className="w-3 h-3" /> Sent</> : "Dispatch"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {routeMutation.data?.candidates && routeMutation.data.candidates.length === 0 && (
              <div className="bg-primary/10 border border-primary/30 p-6 text-primary font-mono text-center">
                <AlertTriangle className="w-8 h-8 mx-auto mb-3" />
                <div className="font-bold text-lg mb-1">NO VIABLE ROUTES</div>
                <div className="text-xs uppercase">Insufficient stock across network to fulfill request parameters.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
