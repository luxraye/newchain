import React from "react";
import { 
  useGetFacilityInventory, 
  useGetNationalStats, 
  useGetLedgerStats,
  getGetFacilityInventoryQueryKey
} from "@workspace/api-client-react";
import { AlertTriangle, Activity, Database, CheckCircle2, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Overview({ facilityId }: { facilityId: string }) {
  const { data: inventoryData, isLoading: invLoading } = useGetFacilityInventory(facilityId, {
    query: { enabled: !!facilityId, refetchInterval: 10000 }
  });
  
  const { data: natStats, isLoading: natLoading } = useGetNationalStats({
    query: { refetchInterval: 15000 }
  });

  const { data: ledgerStats, isLoading: ledgerLoading } = useGetLedgerStats({
    query: { refetchInterval: 5000 }
  });

  const bloodTypes = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-end justify-between border-b border-secondary/20 pb-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white uppercase tracking-tight">Command Centre</h1>
          <p className="text-secondary/60 font-mono text-sm mt-1 uppercase tracking-widest">Facility telemetry & global sync</p>
        </div>
        <div className="text-right font-mono">
          <div className="text-xs text-secondary/50 uppercase">System Time</div>
          <div className="text-secondary font-bold">{new Date().toISOString().replace('T', ' ').slice(0, 19)}Z</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Grid: Inventory */}
        <div className="lg:col-span-2 space-y-6">
          <div className="terminal-panel p-6 border-l-2 border-l-secondary">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-mono text-secondary uppercase tracking-widest text-sm flex items-center gap-2">
                <Activity className="w-4 h-4" /> Local Inventory Grid
              </h2>
              {invLoading && <span className="text-xs font-mono text-secondary/50 animate-pulse">SYNCING...</span>}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {bloodTypes.map(bt => {
                const inv = inventoryData?.inventory?.[bt];
                // Fallback display if missing
                const current = inv !== undefined ? inv : 0;
                // We'll hardcode a minimum of 10 if not provided by API
                const min = 10;
                
                let status = "HEALTHY";
                let statusColor = "text-cyan-500";
                let bgBorder = "border-cyan-500/20 bg-cyan-950/20";
                
                if (current === 0) {
                  status = "CRITICAL";
                  statusColor = "text-primary";
                  bgBorder = "border-primary/50 bg-primary/10 shadow-[0_0_15px_rgba(225,29,72,0.15)]";
                } else if (current < min) {
                  status = "LOW";
                  statusColor = "text-accent";
                  bgBorder = "border-accent/40 bg-accent/10";
                }

                return (
                  <div key={bt} className={cn("p-4 border font-mono flex flex-col relative overflow-hidden", bgBorder)}>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-2xl font-bold text-white">{bt}</span>
                      <span className={cn("text-[10px] tracking-wider px-1.5 py-0.5 border uppercase", 
                        status === 'CRITICAL' ? "border-primary text-primary" : 
                        status === 'LOW' ? "border-accent text-accent" : "border-cyan-500/50 text-cyan-500"
                      )}>
                        {status}
                      </span>
                    </div>
                    
                    <div className="mt-auto flex justify-between items-end">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase">Current</div>
                        <div className={cn("text-3xl font-bold leading-none", statusColor)}>
                          {current.toString().padStart(2, '0')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-500 uppercase">Min</div>
                        <div className="text-sm text-slate-400">{min.toString().padStart(2, '0')}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="terminal-panel p-6 border-l-2 border-l-accent">
              <h2 className="font-mono text-accent uppercase tracking-widest text-sm flex items-center gap-2 mb-4">
                <ShieldAlert className="w-4 h-4" /> Active Alerts
              </h2>
              <div className="space-y-3 font-mono text-xs">
                {inventoryData?.criticals && inventoryData.criticals.length > 0 ? (
                  inventoryData.criticals.map((crit, i) => (
                    <div key={i} className="bg-primary/10 border border-primary/30 p-3 text-primary flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">CRITICAL SHORTAGE: {crit.type}</div>
                        <div className="text-primary/70 mt-1">Stock at {crit.units} units (Min: {crit.threshold}). Urgent restock required.</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-2 text-cyan-500/70 p-3 border border-cyan-500/20 bg-cyan-950/20">
                    <CheckCircle2 className="w-4 h-4" /> No local alerts active.
                  </div>
                )}
              </div>
            </div>

            <div className="terminal-panel p-6 border-l-2 border-l-secondary">
              <h2 className="font-mono text-secondary uppercase tracking-widest text-sm flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4" /> National Grid Stats
              </h2>
              <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-slate-400">Total Network Stock</span>
                  <span className="text-white font-bold">{natStats?.totalUnitsInStock || '---'} UNITS</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-slate-400">Collected Today</span>
                  <span className="text-cyan-500 font-bold">+{natStats?.unitsCollectedToday || '---'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-slate-400">Facilities Online</span>
                  <span className="text-white font-bold">{natStats?.facilitiesOnline || '---'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Network Alerts</span>
                  <span className={cn("font-bold", (natStats?.activeAlerts || 0) > 0 ? "text-accent" : "text-white")}>
                    {natStats?.activeAlerts || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Ledger Feed */}
        <div className="terminal-panel p-0 flex flex-col border-t-2 border-t-secondary">
          <div className="p-4 border-b border-secondary/20 bg-secondary/5">
            <h2 className="font-mono text-secondary uppercase tracking-widest text-sm flex items-center justify-between">
              <span className="flex items-center gap-2"><Database className="w-4 h-4" /> Live Ledger</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-secondary/20 border border-secondary/30">
                BLK: {ledgerStats?.blockHeight || 'SYNC'}
              </span>
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[10px] min-h-[400px]">
            {ledgerStats?.recentEvents?.slice(0, 15).map((ev, i) => (
              <div key={ev.eventId || i} className="border-l-2 border-secondary/50 pl-3 py-1 group hover:border-secondary hover:bg-secondary/5 transition-colors">
                <div className="flex justify-between text-secondary/50 mb-1">
                  <span>{new Date(ev.timestamp || '').toLocaleTimeString()}</span>
                  <span className="truncate max-w-[100px] ml-2 text-slate-600" title={ev.chainHash}>
                    {ev.chainHash?.substring(0, 8)}...
                  </span>
                </div>
                <div className="text-white">
                  <span className={cn(
                    "font-bold mr-2",
                    ev.action === 'LOG_UNIT' ? 'text-cyan-500' :
                    ev.action === 'TRANSFER' ? 'text-accent' :
                    ev.action === 'DISCARD' ? 'text-primary' : 'text-slate-300'
                  )}>
                    [{ev.action}]
                  </span>
                  {ev.bloodType} Unit <span className="text-slate-400">{ev.unitId?.substring(0, 6)}</span> 
                </div>
                <div className="text-slate-500 mt-1">@ {ev.facilityId}</div>
              </div>
            ))}
            
            {(!ledgerStats?.recentEvents || ledgerStats.recentEvents.length === 0) && (
              <div className="text-center text-slate-500 py-8 animate-pulse">
                AWAITING CHAIN DATA...
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-secondary/20 text-center">
            <a href="/ledger" className="text-[10px] text-secondary hover:text-white uppercase tracking-widest font-mono">
              View Full Stream &rarr;
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
