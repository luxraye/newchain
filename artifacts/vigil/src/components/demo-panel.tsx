import { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";

const STORAGE_KEY = "vigil-demo-dismissed";

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
    <div className="fixed bottom-4 right-4 z-50 w-72 bg-[#06090e] border border-secondary/30 shadow-[0_0_20px_rgba(0,212,255,0.08)] overflow-hidden font-mono text-xs">
      <div className="flex items-center justify-between border-b border-secondary/20 px-3 py-2 bg-secondary/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-secondary animate-pulse" />
          <span className="text-secondary font-bold uppercase tracking-widest text-[9px]">
            Demo Access
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-500 hover:text-white p-0.5 transition-colors"
            aria-label="Toggle"
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
            className="text-slate-500 hover:text-white p-0.5 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-3 space-y-2.5 text-[11px]">
          <div>
            <span className="text-secondary/50 uppercase tracking-widest text-[9px] block mb-1">
              Access
            </span>
            <span className="text-white">
              Read-only · No credentials required
            </span>
          </div>
          <div>
            <span className="text-secondary/50 uppercase tracking-widest text-[9px] block mb-1">
              Overview
            </span>
            <span className="text-slate-300">
              Live KPI grid + national inventory bar chart
            </span>
          </div>
          <div>
            <span className="text-secondary/50 uppercase tracking-widest text-[9px] block mb-1">
              Routing Simulator
            </span>
            <span className="text-slate-300">
              Go to <strong className="text-white">Alerts</strong> → select blood
              type + facility → Initialize Routing
            </span>
          </div>
          <div>
            <span className="text-secondary/50 uppercase tracking-widest text-[9px] block mb-1">
              Shortage Shortcut
            </span>
            <span className="text-slate-300">
              Click any shortage row to pre-fill blood type in the simulator
            </span>
          </div>
          <div className="pt-1.5 border-t border-secondary/10 text-[9px] text-slate-600 uppercase tracking-wider">
            Ministry / NBTS read-only terminal
          </div>
        </div>
      )}
    </div>
  );
}
