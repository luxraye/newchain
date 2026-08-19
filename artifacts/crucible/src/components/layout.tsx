import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { 
  Beaker, 
  ListTodo, 
  Activity, 
  TestTube2, 
  Thermometer,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import { useGetFacilities } from "@workspace/api-client-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LayoutProps {
  children: ReactNode;
  facilityId: string;
  setFacilityId: (id: string) => void;
}

export function Layout({ children, facilityId, setFacilityId }: LayoutProps) {
  const [location] = useLocation();
  const { data: facilitiesData, isLoading } = useGetFacilities();

  const navItems = [
    { name: "DASHBOARD", path: "/", icon: Activity },
    { name: "WORKLIST", path: "/worklist", icon: ListTodo },
    { name: "LEDGER", path: "/ledger", icon: Thermometer },
  ];

  return (
    <div className="flex h-[100dvh] w-full bg-background text-foreground overflow-hidden font-sans">
      <div className="flex flex-col w-64 border-r bg-card shrink-0">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 bg-primary/10 rounded flex items-center justify-center">
              <TestTube2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-none text-white">CRUCIBLE</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-mono">Lab Workstation</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest flex justify-between items-center">
              <span>Active Facility</span>
              <span className="flex items-center gap-1 text-emerald-500">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" /> ON
              </span>
            </label>
            <Select value={facilityId} onValueChange={setFacilityId} disabled={isLoading}>
              <SelectTrigger className="w-full h-8 text-xs font-mono">
                <SelectValue placeholder="Select facility" />
              </SelectTrigger>
              <SelectContent>
                {facilitiesData?.facilities?.map(f => (
                  <SelectItem key={f.facilityId} value={f.facilityId || ""} className="font-mono text-xs cursor-pointer">
                    <span className="text-muted-foreground mr-2">[{f.facilityId}]</span>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2 px-2 mt-2">Modules</div>
          {navItems.map((item) => {
            const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-accent text-accent-foreground" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t text-xs flex justify-between items-center text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Secure</span>
          </div>
          <span className="font-mono">v1.2.0</span>
        </div>
      </div>
      
      <main className="flex-1 overflow-hidden relative flex flex-col">
        {children}
      </main>
    </div>
  );
}
