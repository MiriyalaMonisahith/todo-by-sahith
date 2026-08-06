import React from "react";
import { cn } from "@/lib/utils";

export default function StatCard({ icon: Icon, label, value, accent, hint }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", accent)}>
          {Icon ? <Icon className="h-5 w-5" /> : null}
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {hint && <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}