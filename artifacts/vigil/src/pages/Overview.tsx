import { useGetNationalStats, useGetNationalShortage, useGetLedgerStats } from "@workspace/api-client-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, CartesianGrid } from "recharts";
import { AlertTriangle, Database, Hash, Server, Activity, Droplet, ArrowRightLeft, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

const BLOOD_TYPE_COLORS: Record<string, string> = {
  "O-": "hsl(var(--destructive))",
  "O+": "hsl(348, 60%, 45%)",
  "A-": "hsl(25, 90%, 55%)",
  "A+": "hsl(25, 70%, 45%)",
  "B-": "hsl(194, 90%, 45%)",
  "B+": "hsl(194, 70%, 35%)",
  "AB-": "hsl(280, 80%, 65%)",
  "AB+": "hsl(280, 60%, 55%)",
};

const SAFE_THRESHOLD = 500;

export function OverviewPage() {
  const { data: stats, isLoading: statsLoading } = useGetNationalStats({ query: { refetchInterval: 15000 } });
  const { data: shortages, isLoading: shortageLoading } = useGetNationalShortage({ query: { refetchInterval: 30000 } });
  const { data: ledger, isLoading: ledgerLoading } = useGetLedgerStats({ query: { refetchInterval: 10000 } });

  const inventoryData = stats?.inventoryByBloodType 
    ? Object.entries(stats.inventoryByBloodType).map(([type, count]) => ({
        type,
        count,
        fill: BLOOD_TYPE_COLORS[type] || "hsl(var(--primary))"
      }))
    : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPIBox 
          title="TOTAL NATIONAL STOCK" 
          value={stats?.totalUnitsInStock} 
          unit="UNITS" 
          icon={Database} 
          loading={statsLoading} 
          trend="+12% 24H"
          trendUp={true}
        />
        <KPIBox 
          title="ACTIVE SHORTAGE ALERTS" 
          value={stats?.activeAlerts} 
          unit="CRITICAL" 
          icon={AlertTriangle} 
          loading={statsLoading} 
          status={stats?.activeAlerts && stats.activeAlerts > 0 ? "danger" : "nominal"}
        />
        <KPIBox 
          title="UNITS COLLECTED (24H)" 
          value={stats?.unitsCollectedToday} 
          unit="UNITS" 
          icon={Droplet} 
          loading={statsLoading} 
        />
        <KPIBox 
          title="NETWORK NODES ONLINE" 
          value={stats?.facilitiesOnline} 
          unit="ACTIVE" 
          icon={Server} 
          loading={statsLoading} 
          status="nominal"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)] min-h-[600px]">
        {/* Main Chart */}
        <div className="lg:col-span-2 border border-border bg-card/50 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary/50 via-primary/50 to-transparent opacity-50" />
          <div className="p-4 border-b border-border/50 flex justify-between items-center bg-black/20">
            <h3 className="font-mono text-sm text-muted-foreground tracking-widest uppercase">National Inventory Distribution</h3>
            <div className="flex gap-4">
              <span className="font-mono text-[10px] text-muted-foreground">THRESHOLD: {SAFE_THRESHOLD}U</span>
            </div>
          </div>
          <div className="flex-1 p-6 relative">
            {statsLoading ? (
              <div className="w-full h-full flex items-center justify-center font-mono text-sm text-secondary animate-pulse">
                [ ACQUIRING TELEMETRY ]
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventoryData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="type" 
                    stroke="hsl(var(--muted-foreground))" 
                    tick={{ fontFamily: 'JetBrains Mono', fontSize: 12 }} 
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    tick={{ fontFamily: 'JetBrains Mono', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                  />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border border-border p-3 shadow-xl font-mono text-xs">
                            <div className="text-muted-foreground mb-1">TYPE {data.type}</div>
                            <div className="text-lg font-bold text-foreground">{data.count} UNITS</div>
                            {data.count < SAFE_THRESHOLD && (
                              <div className="text-destructive mt-1 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> BELOW THRESHOLD
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine y={SAFE_THRESHOLD} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label={{ position: 'right', value: 'MIN', fill: 'hsl(var(--destructive))', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                  <Bar dataKey="count" radius={[2, 2, 0, 0]} maxBarSize={60}>
                    {inventoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.count < SAFE_THRESHOLD ? 'hsl(var(--destructive))' : entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right Column: Shortages & Ledger */}
        <div className="flex flex-col gap-6 h-full">
          {/* Critical Shortages */}
          <div className="flex-1 border border-border bg-card/50 flex flex-col overflow-hidden relative">
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-destructive m-1" />
            <div className="p-3 border-b border-border/50 bg-destructive/10 text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <h3 className="font-mono text-xs font-bold tracking-widest uppercase">Critical Shortages</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-0">
              {shortageLoading ? (
                <div className="p-4 font-mono text-xs text-muted-foreground animate-pulse">ANALYZING...</div>
              ) : shortages?.shortages?.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center text-success h-full">
                  <CheckCircle2 className="h-8 w-8 mb-2 opacity-50" />
                  <div className="font-mono text-xs">NO CRITICAL SHORTAGES</div>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {shortages?.shortages?.filter(s => s.shortage).map((s) => (
                    <div key={s.bloodType} className="p-3 hover:bg-white/5 transition-colors group">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-mono text-lg font-bold text-destructive">{s.bloodType}</div>
                        <div className="font-mono text-xs bg-destructive/20 text-destructive px-2 py-0.5 border border-destructive/30">
                          {s.totalStock} / {s.totalThreshold}
                        </div>
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground flex items-center gap-2">
                        <span>AFFECTS {s.criticalFacilities} FACILITIES</span>
                        <ArrowRightLeft className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Ledger Event Feed */}
          <div className="flex-[1.5] border border-border bg-card/50 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-border/50 bg-black/20 flex justify-between items-center">
              <h3 className="font-mono text-xs text-muted-foreground tracking-widest uppercase flex items-center gap-2">
                <Hash className="w-3 h-3" /> Ledger Stream
              </h3>
              <div className="font-mono text-[10px] text-secondary flex items-center gap-1">
                HEIGHT: <span className="text-foreground">{ledger?.blockHeight || '...'}</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 scanline">
              {ledgerLoading ? (
                <div className="font-mono text-xs text-muted-foreground animate-pulse">SYNCING CHAIN...</div>
              ) : ledger?.recentEvents?.map((event) => (
                <div key={event.eventId} className="font-mono text-[10px] p-2 bg-black/40 border border-white/5 hover:border-secondary/30 transition-colors">
                  <div className="flex justify-between text-muted-foreground mb-1">
                    <span>{event.timestamp ? format(new Date(event.timestamp), "HH:mm:ss") : "--:--:--"}</span>
                    <span className="text-primary truncate max-w-[100px]">{event.chainHash?.substring(0, 10)}...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={
                      event.action === 'log' ? 'text-secondary' : 
                      event.action === 'transfuse' ? 'text-warning' : 
                      event.action === 'discard' ? 'text-destructive' : 'text-foreground'
                    }>
                      [{event.action?.toUpperCase()}]
                    </span>
                    <span className="text-foreground">{event.bloodType} Unit <span className="opacity-50">{event.unitId?.substring(0, 8)}</span></span>
                  </div>
                  <div className="text-muted-foreground mt-1 text-[9px]">@ {event.facilityName}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPIBox({ title, value, unit, icon: Icon, loading, status = "default", trend, trendUp }: any) {
  const getStatusColors = () => {
    switch(status) {
      case "danger": return "text-destructive border-destructive/50 bg-destructive/5";
      case "warning": return "text-warning border-warning/50 bg-warning/5";
      case "nominal": return "text-secondary border-secondary/30 bg-secondary/5";
      default: return "text-foreground border-border/50 bg-card/50";
    }
  };

  return (
    <div className={`p-4 border relative overflow-hidden flex flex-col justify-between h-32 ${getStatusColors()}`}>
      {status !== "default" && (
        <div className={`absolute top-0 right-0 w-8 h-8 opacity-20 -mr-2 -mt-2`}>
          <Icon className="w-full h-full" />
        </div>
      )}
      <div className="flex justify-between items-start z-10">
        <h3 className="font-mono text-[10px] tracking-widest text-muted-foreground opacity-80">{title}</h3>
        <Icon className="w-4 h-4 opacity-50" />
      </div>
      <div className="z-10 mt-auto">
        {loading ? (
          <div className="h-8 w-24 bg-white/10 animate-pulse rounded" />
        ) : (
          <div className="flex items-end gap-2">
            <span className="font-mono text-3xl font-bold leading-none">{value !== undefined ? value : "—"}</span>
            <span className="font-mono text-xs mb-1 opacity-60">{unit}</span>
          </div>
        )}
        {trend && (
          <div className={`font-mono text-[10px] mt-2 flex items-center gap-1 ${trendUp ? 'text-success' : 'text-destructive'}`}>
             {trendUp ? '▲' : '▼'} {trend}
          </div>
        )}
      </div>
    </div>
  );
}
