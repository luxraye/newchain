import { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";

const STORAGE_KEY = "sanctum-demo-dismissed";

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
    <div className="fixed bottom-4 right-4 z-50 w-72 bg-[#06090e] border border-cyan-500/30 shadow-[0_0_20px_rgba(0,212,255,0.1)] overflow-hidden font-mono text-xs">
      <div className="flex items-center justify-between border-b border-cyan-500/20 px-3 py-2 bg-cyan-950/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 animate-pulse" />
          <span className="text-cyan-400 font-bold uppercase tracking-widest text-[9px]">
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
            <span className="text-cyan-500/50 uppercase tracking-widest text-[9px] block mb-1">
              Facility
            </span>
            <span className="text-white">
              FAC-001 — Princess Marina Hospital
            </span>
          </div>
          <div>
            <span className="text-cyan-500/50 uppercase tracking-widest text-[9px] block mb-1">
              Donor ID (for Unit Induction)
            </span>
            <span className="text-cyan-400 font-bold">D-2026-0891</span>
            <span className="text-slate-500"> — Kabo Sithole · O+</span>
          </div>
          <div>
            <span className="text-cyan-500/50 uppercase tracking-widest text-[9px] block mb-1">
              Bag Number Example
            </span>
            <span className="text-cyan-400 font-bold">BW-2026-008821</span>
          </div>
          <div>
            <span className="text-cyan-500/50 uppercase tracking-widest text-[9px] block mb-1">
              Flow
            </span>
            <span className="text-slate-300">
              CMD_CENTRE → UNIT_INDUCT → ROUTE_CTRL
            </span>
          </div>
          <div className="pt-1.5 border-t border-cyan-500/10 text-[9px] text-slate-600 uppercase tracking-wider">
            No login · Open facility access
          </div>
        </div>
      )}
    </div>
  );
}
