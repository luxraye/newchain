import React from "react";
import { useGetLedgerStats, useGetUnits } from "@workspace/api-client-react";
import { Database, Link as LinkIcon, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Ledger({ facilityId }: { facilityId: string }) {
  const { data: ledgerStats, isLoading: ledgerLoading } = useGetLedgerStats({
    query: { refetchInterval: 5000 }
  });

  const { data: unitsData, isLoading: unitsLoading } = useGetUnits({ facilityId }, {
    query: { refetchInterval: 10000 }
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="border-b border-secondary/20 pb-4 flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold text-white uppercase tracking-tight">Chain Ledger</h1>
          <p className="text-secondary/60 font-mono text-sm mt-1 uppercase tracking-widest">Immutable audit log & cryptography stream</p>
        </div>
        <div className="text-right font-mono flex gap-6">
          <div>
            <div className="text-[10px] text-secondary/50 uppercase">Network Status</div>
            <div className="text-green-500 font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> SECURE
            </div>
          </div>
          <div>
            <div className="text-[10px] text-secondary/50 uppercase">Current Block</div>
            <div className="text-secondary font-bold text-xl leading-none">#{ledgerStats?.blockHeight || '---'}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden min-h-0">
        
        {/* Main Feed: Stream */}
        <div className="lg:col-span-2 terminal-panel border border-secondary/20 flex flex-col h-full overflow-hidden">
          <div className="p-3 border-b border-secondary/20 bg-secondary/5 flex items-center justify-between shrink-0">
            <h2 className="font-mono text-secondary uppercase tracking-widest text-xs flex items-center gap-2">
              <Database className="w-4 h-4" /> Real-time Event Stream
            </h2>
            {ledgerLoading && <span className="font-mono text-[10px] text-secondary/50 animate-pulse">SYNCING...</span>}
          </div>
          
          <div className="flex-1 overflow-y-auto p-0">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead className="bg-[#090d14] sticky top-0 border-b border-white/5 shadow-sm">
                <tr>
                  <th className="py-3 px-4 text-slate-500 font-normal uppercase tracking-widest w-32">Timestamp</th>
                  <th className="py-3 px-4 text-slate-500 font-normal uppercase tracking-widest w-24">Action</th>
                  <th className="py-3 px-4 text-slate-500 font-normal uppercase tracking-widest w-24">Unit ID</th>
                  <th className="py-3 px-4 text-slate-500 font-normal uppercase tracking-widest">Facility</th>
                  <th className="py-3 px-4 text-slate-500 font-normal uppercase tracking-widest text-right">Chain Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ledgerStats?.recentEvents?.map((ev, i) => (
                  <tr key={ev.eventId || i} className="hover:bg-secondary/5 transition-colors">
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(ev.timestamp || '').toLocaleTimeString([], { hour12: false })}
                      <span className="text-[10px] text-slate-600 block">.{new Date(ev.timestamp || '').getMilliseconds()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        "px-1.5 py-0.5 border text-[10px]",
                        ev.action === 'LOG_UNIT' ? 'border-cyan-500/30 text-cyan-500 bg-cyan-950/20' :
                        ev.action === 'TRANSFER' ? 'border-accent/30 text-accent bg-accent/10' :
                        ev.action === 'DISCARD' ? 'border-primary/30 text-primary bg-primary/10' : 
                        'border-slate-500/30 text-slate-300'
                      )}>
                        {ev.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white font-bold">
                      {ev.unitId?.substring(0, 8)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-300">{ev.facilityId}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2 group cursor-crosshair">
                        <LinkIcon className="w-3 h-3 text-secondary/30 group-hover:text-secondary" />
                        <span className="text-secondary/60 group-hover:text-secondary group-hover:blur-none blur-[1px] transition-all font-bold">
                          {ev.chainHash || '0x0000...0000'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!ledgerStats?.recentEvents || ledgerStats.recentEvents.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-600">No events found in the current block window.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar: Local Vault */}
        <div className="terminal-panel border border-white/10 flex flex-col h-full overflow-hidden bg-[#090b10]">
          <div className="p-3 border-b border-white/10 shrink-0">
            <h2 className="font-mono text-slate-300 uppercase tracking-widest text-xs flex items-center gap-2">
              Local Vault State
            </h2>
            <div className="text-[10px] text-slate-500 uppercase mt-1">Node: {facilityId}</div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs">
            {unitsLoading ? (
              <div className="text-slate-500 animate-pulse text-center py-4">READING VAULT...</div>
            ) : unitsData?.units?.length ? (
              unitsData.units.map(u => (
                <div key={u.unitId} className="border border-white/5 p-3 flex justify-between items-center hover:border-white/20 transition-colors">
                  <div>
                    <div className="text-white font-bold mb-1 flex items-center gap-2">
                      {u.bloodType} 
                      <span className={cn(
                        "text-[9px] px-1 py-0.5 border uppercase",
                        u.status === 'available' ? 'border-cyan-500/50 text-cyan-500' :
                        u.status === 'reserved' ? 'border-accent/50 text-accent' :
                        'border-slate-500/50 text-slate-400'
                      )}>
                        {u.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">ID: {u.unitId?.substring(0,8)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">EXP</div>
                    <div className="text-slate-300">{new Date(u.expiresAt || '').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-500 py-8 border border-white/5 border-dashed">
                VAULT EMPTY
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
