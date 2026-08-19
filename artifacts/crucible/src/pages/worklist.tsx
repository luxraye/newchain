import { useState } from "react";
import { useGetLabWorklist, GetLabWorklistStage, GetLabWorklistRiskStatus } from "@workspace/api-client-react";
import { Link } from "wouter";
import { 
  Search,
  Filter,
  ArrowRight,
  TestTube2,
  MoreVertical,
  Activity,
  AlertTriangle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StageBadge, RiskBadge, BloodTypeBadge } from "@/components/badges";

export default function Worklist({ facilityId }: { facilityId: string }) {
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<string>("all");
  const [riskStatus, setRiskStatus] = useState<string>("all");

  const { data, isLoading, error, refetch } = useGetLabWorklist({
    facilityId,
    search: search || undefined,
    stage: stage !== "all" ? stage as GetLabWorklistStage : undefined,
    riskStatus: riskStatus !== "all" ? riskStatus as GetLabWorklistRiskStatus : undefined,
  });

  return (
    <div className="p-8 h-full flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Processing Worklist</h2>
          <p className="text-muted-foreground mt-1">Manage laboratory queue and blood components.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center bg-card p-3 border rounded-md">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by Unit ID or Donor ID..." 
            className="pl-9 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={stage} onValueChange={setStage}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="All Stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="awaiting_tests">Awaiting Tests</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="quarantine">Quarantine</SelectItem>
              <SelectItem value="released">Released</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-48">
          <Select value={riskStatus} onValueChange={setRiskStatus}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="All Risk Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="clear">Clear</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="reactive">Reactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 border rounded-md bg-card overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 font-medium">Unit ID</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Stage</th>
                <th className="px-4 py-3 font-medium">Risk Status</th>
                <th className="px-4 py-3 font-medium">Collected</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    <Activity className="h-6 w-6 animate-pulse mx-auto mb-2" />
                    Loading worklist...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    <AlertTriangle className="h-7 w-7 mx-auto mb-3 text-destructive" />
                    <p className="mb-4">The processing queue could not be loaded.</p>
                    <Button variant="outline" onClick={() => refetch()}>Retry</Button>
                  </td>
                </tr>
              ) : !data || data.items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    <TestTube2 className="h-8 w-8 mx-auto mb-3 opacity-50" />
                    No units found matching criteria.
                  </td>
                </tr>
              ) : (
                data.items.map((item) => (
                  <tr key={item.unitId} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono font-medium text-primary">
                      {item.unitId}
                    </td>
                    <td className="px-4 py-3">
                      <BloodTypeBadge type={item.bloodType} />
                    </td>
                    <td className="px-4 py-3">
                      <StageBadge stage={item.stage} />
                    </td>
                    <td className="px-4 py-3">
                      <RiskBadge status={item.riskStatus} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(item.collectedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/units/${item.unitId}`}>
                        <Button variant="ghost" size="sm" className="h-8 hover:text-primary">
                          Process <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
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
