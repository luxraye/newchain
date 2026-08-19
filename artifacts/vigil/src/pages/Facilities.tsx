import { useGetFacilities, useGetFacilityInventory } from "@workspace/api-client-react";
import { Network, Search, Building2, MapPin, AlertTriangle, ShieldCheck } from "lucide-react";
import { useState } from "react";

export function FacilitiesPage() {
  const { data, isLoading } = useGetFacilities();
  const [search, setSearch] = useState("");

  const facilities = data?.facilities?.filter(f => 
    f.name?.toLowerCase().includes(search.toLowerCase()) || 
    f.district?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-border/50 pb-4">
        <div>
          <h2 className="font-mono text-xl tracking-widest uppercase text-foreground flex items-center gap-3">
            <Network className="w-5 h-5 text-secondary" />
            Network Nodes
          </h2>
          <p className="font-mono text-xs text-muted-foreground mt-1">STATUS AND INVENTORY OVERSIGHT</p>
        </div>
        
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="SEARCH FACILITIES..." 
            className="w-full bg-black/40 border border-border/50 focus:border-secondary font-mono text-xs py-2 pl-9 pr-4 text-foreground outline-none transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-64 font-mono text-secondary animate-pulse">
            SCANNING NETWORK...
          </div>
        ) : facilities?.length === 0 ? (
          <div className="flex items-center justify-center h-64 font-mono text-muted-foreground">
            NO FACILITIES FOUND
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
            {facilities?.map((facility) => (
              <FacilityCard key={facility.facilityId} facility={facility} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FacilityCard({ facility }: { facility: any }) {
  const { data: inventory, isLoading } = useGetFacilityInventory(facility.facilityId || "", {
    query: { enabled: !!facility.facilityId }
  });

  const hasCritical = inventory?.criticals && inventory.criticals.length > 0;
  
  return (
    <div className={`border p-4 flex flex-col relative transition-all duration-300 hover:bg-white/[0.02] ${
      hasCritical ? 'border-destructive/50 bg-destructive/[0.02]' : 'border-border/50 bg-card/40'
    }`}>
      {hasCritical && (
        <div className="absolute top-0 right-0 p-2">
          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
        </div>
      )}

      <div className="flex items-start gap-3 mb-4">
        <div className={`p-2 border ${hasCritical ? 'border-destructive/30 bg-destructive/10 text-destructive' : 'border-secondary/30 bg-secondary/10 text-secondary'}`}>
          <Building2 className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-sm truncate pr-6">{facility.name}</h3>
          <div className="font-mono text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3" /> {facility.district}
          </div>
        </div>
      </div>

      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2 flex justify-between">
        <span>STATUS</span>
        <span className={facility.status === 'active' ? 'text-success' : 'text-warning'}>
          {facility.status === 'active' ? '[ ONLINE ]' : `[ ${facility.status} ]`}
        </span>
      </div>

      <div className="mt-auto pt-4 border-t border-border/30">
        {isLoading ? (
          <div className="font-mono text-[10px] text-muted-foreground animate-pulse text-center py-2">FETCHING DATA...</div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="font-mono text-[10px] text-muted-foreground">TOTAL STOCK</span>
              <span className="font-mono text-lg font-bold">
                {inventory?.inventory ? Object.values(inventory.inventory).reduce((a: any, b: any) => a + b, 0) : 0}
              </span>
            </div>

            {hasCritical ? (
              <div className="bg-destructive/10 border border-destructive/20 p-2 space-y-1">
                <div className="font-mono text-[9px] text-destructive flex items-center gap-1 font-bold">
                  <AlertTriangle className="w-3 h-3" /> CRITICAL SHORTAGES
                </div>
                <div className="flex flex-wrap gap-1">
                  {inventory.criticals?.map((c: any) => (
                    <span key={c.type} className="font-mono text-[10px] bg-destructive/20 text-destructive px-1.5 py-0.5 border border-destructive/30">
                      {c.type}: {c.units}/{c.threshold}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-success/5 border border-success/20 p-2 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-success" />
                <span className="font-mono text-[10px] text-success">INVENTORY STABLE</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
