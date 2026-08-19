import { useGetLabDashboard } from "@workspace/api-client-react";
import { Link } from "wouter";
import { 
  Activity, 
  TestTube2, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  ArrowRight
} from "lucide-react";
import { StageBadge, RiskBadge, BloodTypeBadge } from "@/components/badges";
import { Button } from "@/components/ui/button";

export default function Dashboard({ facilityId }: { facilityId: string }) {
  const { data, isLoading, error, refetch } = useGetLabDashboard({ facilityId });

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center h-full text-muted-foreground">
        <Activity className="h-6 w-6 animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-destructive flex flex-col items-center justify-center h-full">
        <AlertTriangle className="h-10 w-10 mb-4" />
        <p className="mb-4">Failed to load operational dashboard.</p>
        <Button variant="outline" onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="p-8 overflow-y-auto h-full space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Operational Dashboard</h2>
        <p className="text-muted-foreground mt-1">Real-time laboratory processing metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard 
          title="Total In Process" 
          value={data.totalInProcess} 
          icon={Activity} 
          color="text-blue-500" 
        />
        <MetricCard 
          title="Awaiting Tests" 
          value={data.awaitingTests} 
          icon={TestTube2} 
          color="text-amber-500" 
        />
        <MetricCard 
          title="Quarantine" 
          value={data.quarantinedUnits} 
          icon={AlertTriangle} 
          color="text-purple-500" 
        />
        <MetricCard 
          title="Released" 
          value={data.releasedProducts} 
          icon={CheckCircle2} 
          color="text-emerald-500" 
        />
        <MetricCard 
          title="Expiring Soon" 
          value={data.expiringSoon} 
          icon={Clock} 
          color="text-red-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4 border rounded-md p-5 bg-card">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Recent Events
          </h3>
          {data.recentEvents?.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No recent activity.</p>
          ) : (
            <div className="space-y-4">
              {data.recentEvents?.map(event => (
                <div key={event.eventId} className="flex items-start gap-4 text-sm border-b pb-4 last:border-0 last:pb-0">
                  <div className="mt-0.5 text-muted-foreground">
                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground flex items-center gap-2">
                      {event.action}
                      <Link href={`/units/${event.unitId}`} className="text-primary hover:underline font-mono text-xs">
                        {event.unitId}
                      </Link>
                    </div>
                    <div className="text-muted-foreground mt-1">
                      By {event.actor}
                      {event.reason && <span className="ml-2 italic text-muted-foreground/70">"{event.reason}"</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-4 border rounded-md p-5 bg-card">
          <h3 className="text-lg font-semibold">Stage Distribution</h3>
          <div className="space-y-4">
            {Object.entries(data.stageCounts || {}).map(([stage, count]) => (
              <div key={stage} className="flex items-center justify-between">
                <StageBadge stage={stage} />
                <span className="font-mono text-lg">{count as number}</span>
              </div>
            ))}
          </div>
          
          <div className="pt-6">
            <Link 
              href="/worklist" 
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 transition-colors font-medium text-sm"
            >
              Open Worklist <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color }: { title: string, value: number, icon: any, color: string }) {
  return (
    <div className="border rounded-md p-4 bg-card flex flex-col justify-between h-28 relative overflow-hidden">
      <div className="text-sm font-medium text-muted-foreground relative z-10">{title}</div>
      <div className="text-3xl font-bold font-mono relative z-10">{value}</div>
      <Icon className={`absolute right-4 bottom-4 h-12 w-12 opacity-10 ${color}`} />
    </div>
  );
}
