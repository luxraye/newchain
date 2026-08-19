import { useState } from "react";
import { X, ChevronDown, ChevronUp, Terminal } from "lucide-react";

const STORAGE_KEY = "pulse-demo-dismissed";

export function DemoPanel() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [collapsed, setCollapsed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 bg-card border border-border rounded-lg shadow-lg overflow-hidden font-mono text-xs">
      <div className="flex items-center justify-between bg-primary/8 border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-primary font-bold uppercase tracking-wider text-[10px]">
            Demo Access
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-muted-foreground hover:text-foreground p-0.5 transition-colors"
            aria-label="Toggle panel"
          >
            {collapsed ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
          <button
            onClick={() => {
              try {
                localStorage.setItem(STORAGE_KEY, "1");
              } catch {}
              setDismissed(true);
            }}
            className="text-muted-foreground hover:text-foreground p-0.5 transition-colors"
            aria-label="Dismiss panel"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-3 space-y-2.5 text-[11px]">
          <div>
            <span className="text-muted-foreground uppercase tracking-wider text-[9px] block mb-1">
              New Donor
            </span>
            <span className="text-foreground">
              Click <strong>Begin Registration</strong> → fill name, phone, blood
              type, district → submit
            </span>
          </div>
          <div>
            <span className="text-muted-foreground uppercase tracking-wider text-[9px] block mb-1">
              Existing Donor ID
            </span>
            <span className="font-mono text-primary font-bold">D-2026-0891</span>
            <span className="text-muted-foreground"> (Kabo Sithole · O+)</span>
          </div>
          <div>
            <span className="text-muted-foreground uppercase tracking-wider text-[9px] block mb-1">
              Lookup
            </span>
            <span className="text-foreground">
              Use <strong>Access Dashboard</strong> on home page, enter ID above
            </span>
          </div>
          <div className="pt-1.5 border-t border-border text-[9px] text-muted-foreground flex items-center gap-1.5">
            <Terminal className="w-2.5 h-2.5" />
            No login required · Open demo access
          </div>
        </div>
      )}
    </div>
  );
}
