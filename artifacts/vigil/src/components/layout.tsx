import { format } from "date-fns";
import { Activity, AlertTriangle, Building2, ActivitySquare, Navigation2, Network, Hexagon } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useGetNationalStats } from "@workspace/api-client-react";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground selection:bg-secondary/30">
      {/* Background Grid Pattern for EOC feel */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" 
        style={{ backgroundImage: 'radial-gradient(hsl(var(--secondary)) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />
      
      <Sidebar />
      <div className="flex flex-col flex-1 relative z-10">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 relative">
          <div className="max-w-[1600px] mx-auto w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "NATIONAL GRID", icon: ActivitySquare },
    { href: "/facilities", label: "NETWORK NODES", icon: Network },
    { href: "/alerts", label: "ALERT ROUTING", icon: AlertTriangle },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-card border-r border-border flex flex-col z-20 shadow-2xl relative">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/10 flex items-center justify-center border border-primary/40 relative">
            <Hexagon className="h-6 w-6 text-primary absolute opacity-50" />
            <Activity className="h-5 w-5 text-primary relative z-10" />
            <div className="absolute top-0 left-0 w-1 h-1 bg-primary"></div>
            <div className="absolute bottom-0 right-0 w-1 h-1 bg-primary"></div>
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-[0.2em] text-foreground leading-none">VIGIL</h1>
            <p className="text-[10px] font-mono tracking-widest text-primary font-medium mt-1">OVERSIGHT</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 mt-6">
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors relative group ${isActive ? 'text-secondary bg-secondary/5' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'}`}>
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-secondary shadow-[0_0_8px_hsl(var(--secondary))]" />
                )}
                <item.icon className={`h-4 w-4 ${isActive ? 'text-secondary' : 'opacity-60 group-hover:opacity-100'}`} />
                <span className="font-mono text-xs tracking-wider">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-border/50 text-xs text-muted-foreground bg-black/20">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-secondary/50" />
          <span className="font-mono tracking-widest text-[10px]">AUTH: BOTSWANA MOH</span>
        </div>
        <p className="font-mono text-[9px] opacity-50">SYS.VERSION 4.2.9</p>
      </div>
    </aside>
  );
}

function Header() {
  const [time, setTime] = useState(new Date());
  
  const { data: stats } = useGetNationalStats({
    query: { refetchInterval: 15000 }
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hasAlerts = (stats?.activeAlerts || 0) > 0;

  return (
    <header className="h-16 bg-card/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-6 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 bg-primary" />
          <h2 className="font-mono text-sm tracking-widest text-muted-foreground">EOC / COMMAND DASHBOARD</h2>
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="font-mono text-sm tracking-wider flex items-center gap-3 border border-border/50 bg-black/20 px-3 py-1.5">
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse shadow-[0_0_8px_hsl(var(--secondary))]" />
          <span className="text-secondary opacity-80">UTC+2</span>
          <span className="text-foreground">{format(time, "HH:mm:ss")}</span>
          <span className="text-muted-foreground">{format(time, "yyyy.MM.dd")}</span>
        </div>
        
        <div className={`px-4 py-1.5 border font-mono text-xs font-bold tracking-widest flex items-center gap-2 uppercase ${
          hasAlerts 
            ? 'bg-destructive/10 border-destructive text-destructive shadow-[0_0_15px_hsl(var(--destructive)/0.2)]' 
            : 'bg-secondary/10 border-secondary text-secondary shadow-[0_0_15px_hsl(var(--secondary)/0.1)]'
        }`}>
          {hasAlerts ? (
            <><AlertTriangle className="h-4 w-4" /> DEFCON 3: SHORTAGE</>
          ) : (
            <><Activity className="h-4 w-4" /> NOMINAL</>
          )}
        </div>
      </div>
    </header>
  );
}
