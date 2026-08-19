import { motion } from "framer-motion";
import { MapPin, Activity, ShieldCheck, Clock, Phone } from "lucide-react";
import { useGetFacilities } from "@workspace/api-client-react";

const STATUS_COLORS: Record<string, string> = {
  online:  "bg-green-500/10 text-green-600 border-green-500/20",
  offline: "bg-destructive/10 text-destructive border-destructive/20",
  limited: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

export default function FacilitiesPage() {
  const { data, isLoading } = useGetFacilities();

  const facilities = data?.facilities ?? [];

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-accent border border-border text-sm font-mono text-muted-foreground mb-6">
              <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
              LIVE · {facilities.filter((f) => f.status === "online").length} FACILITIES ONLINE
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-3">Facility Network</h1>
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              All registered blood collection and transfusion facilities on the national Bloodchain grid.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Facility Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-5xl">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-card border border-border rounded-lg animate-pulse" />
              ))}
            </div>
          ) : facilities.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground font-mono">
              <Activity className="w-10 h-10 mx-auto mb-4 opacity-30" />
              No facilities found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {facilities.map((facility, i) => {
                const statusKey = (facility.status ?? "offline") as keyof typeof STATUS_COLORS;
                const statusClass = STATUS_COLORS[statusKey] ?? STATUS_COLORS.offline;
                const inventory = facility.inventory as Record<string, number> | undefined;
                const totalUnits = inventory
                  ? Object.values(inventory).reduce((a, b) => a + b, 0)
                  : 0;

                return (
                  <motion.div
                    key={facility.facilityId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="bg-card border border-border rounded-lg shadow-sm overflow-hidden"
                  >
                    <div className="bg-accent/50 px-6 py-4 border-b border-border flex items-center justify-between">
                      <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                        {facility.facilityId}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${statusClass}`}
                      >
                        {facility.status}
                      </span>
                    </div>

                    <div className="p-6">
                      <h3 className="font-bold text-lg mb-1">{facility.name}</h3>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        {facility.district} · {facility.type?.replace(/_/g, " ")}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-accent/40 rounded-md p-3 border border-border/50">
                          <p className="text-xs font-mono text-muted-foreground uppercase mb-1">
                            Units in Stock
                          </p>
                          <p className="text-xl font-bold font-mono">{totalUnits}</p>
                        </div>
                        <div className="bg-accent/40 rounded-md p-3 border border-border/50">
                          <p className="text-xs font-mono text-muted-foreground uppercase mb-1">
                            Type
                          </p>
                          <p className="text-sm font-semibold capitalize">
                            {facility.type?.replace(/_/g, " ") ?? "—"}
                          </p>
                        </div>
                      </div>

                      {inventory && (
                        <div className="mt-4">
                          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
                            Inventory by Blood Type
                          </p>
                          <div className="grid grid-cols-8 gap-1">
                            {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((bt) => (
                              <div
                                key={bt}
                                className="flex flex-col items-center bg-accent/30 rounded px-1 py-1.5 border border-border/50"
                              >
                                <span className="text-[9px] font-mono text-muted-foreground">{bt}</span>
                                <span className="text-xs font-bold font-mono">{inventory[bt] ?? 0}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Information Panel */}
      <section className="py-16 bg-accent/10 border-t border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Safe Collection",
                desc: "All facilities operate under NBTS clinical standards with sterile single-use equipment.",
              },
              {
                icon: Clock,
                title: "Operating Hours",
                desc: "Most facilities accept donors Monday–Friday, 07:30–12:30. Princess Marina Hospital operates extended hours.",
              },
              {
                icon: Phone,
                title: "Contact NBTS",
                desc: "Call the national hotline at 0800-600-400 (toll-free) to locate your nearest collection site.",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded border border-primary/20 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
