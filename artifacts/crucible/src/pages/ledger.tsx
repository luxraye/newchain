import { useState } from "react";
import { useGetLabEvents } from "@workspace/api-client-react";
import { Activity, AlertTriangle, Search, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Ledger({ facilityId }: { facilityId: string }) {
  const [unitId, setUnitId] = useState("");
  const { data, isLoading, error, refetch } = useGetLabEvents({ facilityId, unitId: unitId || undefined, limit: 100 });

  return (
    <div className="p-8 h-full flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          Laboratory Ledger Stream
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
        </h2>
        <p className="text-muted-foreground mt-1">Immutable record of all laboratory events and actions.</p>
      </div>

      <div className="flex items-center bg-card p-3 border rounded-md max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Filter by Unit ID..." 
            className="pl-9 bg-background"
            value={unitId}
            onChange={(e) => setUnitId(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 border rounded-md bg-card overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left font-mono">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b font-sans">
              <tr>
                <th className="px-4 py-3 font-medium">Timestamp</th>
                <th className="px-4 py-3 font-medium">Event ID</th>
                <th className="px-4 py-3 font-medium">Unit ID</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Actor</th>
                <th className="px-4 py-3 font-medium">Hash</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground font-sans">
                    <Activity className="h-6 w-6 animate-pulse mx-auto mb-2" />
                    Syncing ledger...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground font-sans">
                    <AlertTriangle className="h-7 w-7 mx-auto mb-3 text-destructive" />
                    <p className="mb-4">The laboratory ledger could not be loaded.</p>
                    <Button variant="outline" onClick={() => refetch()}>Retry</Button>
                  </td>
                </tr>
              ) : !data || data.events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground font-sans">
                    No ledger events found.
                  </td>
                </tr>
              ) : (
                data.events.map((event) => (
                  <tr key={event.eventId} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground/70">
                      {event.eventId.substring(0, 8)}...
                    </td>
                    <td className="px-4 py-3 text-primary">
                      <Link href={`/units/${event.unitId}`} className="hover:underline">
                        {event.unitId}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-emerald-400">
                      {event.action}
                      {event.reason && <div className="text-[10px] text-muted-foreground mt-0.5 max-w-[200px] truncate" title={event.reason}>{event.reason}</div>}
                    </td>
                    <td className="px-4 py-3">
                      {event.actor}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground/50 truncate max-w-[150px]" title={event.chainHash}>
                      {event.chainHash}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
