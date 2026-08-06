import React from "react";
import { Calendar, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const priorityStyles = {
  low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  medium: "bg-amber-50 text-amber-700 ring-amber-200",
  high: "bg-rose-50 text-rose-700 ring-rose-200",
};

export default function TaskCard({ task, onDelete, isDragging }) {
  const isDone = task.status === "done";
  return (
    <div
      className={cn(
        "group rounded-lg border border-border bg-card p-3 shadow-sm transition-shadow",
        isDragging && "shadow-md ring-2 ring-ring/40"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ring-1 ring-inset",
            priorityStyles[task.priority] ?? priorityStyles.medium
          )}
        >
          {task.priority}
        </span>
        <button
          onClick={onDelete}
          className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
          title="Delete task"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <h3
        className={cn(
          "mt-2 text-sm font-medium text-foreground",
          isDone && "text-muted-foreground line-through"
        )}
      >
        {task.title}
      </h3>

      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
      )}

      {task.due_date && (
        <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {new Date(task.due_date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </div>
      )}
    </div>
  );
}