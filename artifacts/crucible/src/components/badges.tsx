import { ReactNode } from "react";

export function StageBadge({ stage }: { stage: string }) {
  const map: Record<string, { label: string, classes: string }> = {
    awaiting_tests: { label: "AWAITING TESTS", classes: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
    processing: { label: "PROCESSING", classes: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    quarantine: { label: "QUARANTINE", classes: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
    released: { label: "RELEASED", classes: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    discarded: { label: "DISCARDED", classes: "bg-red-500/10 text-red-500 border-red-500/20" },
  };
  
  const conf = map[stage] || { label: stage.toUpperCase(), classes: "bg-muted text-muted-foreground border-border" };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono border ${conf.classes}`}>
      {conf.label}
    </span>
  );
}

export function RiskBadge({ status }: { status: string }) {
  const map: Record<string, { label: string, classes: string }> = {
    clear: { label: "CLEAR", classes: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    review: { label: "REVIEW", classes: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
    reactive: { label: "REACTIVE", classes: "bg-red-500/10 text-red-500 border-red-500/20" },
    pending: { label: "PENDING", classes: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
  };
  
  const conf = map[status] || { label: status.toUpperCase(), classes: "bg-muted text-muted-foreground border-border" };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono border ${conf.classes}`}>
      {conf.label}
    </span>
  );
}

export function BloodTypeBadge({ type }: { type?: string }) {
  if (!type) return <span className="text-muted-foreground">-</span>;
  return (
    <span className="inline-flex items-center justify-center min-w-[32px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold text-xs">
      {type}
    </span>
  );
}
