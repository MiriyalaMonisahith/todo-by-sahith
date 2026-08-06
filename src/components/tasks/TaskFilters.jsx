import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const labelClass = "text-[10px] font-medium uppercase tracking-wide text-muted-foreground";
const selectClass = "h-9 w-full";

export default function TaskFilters({ filters, setFilters, sort, setSort, resultCount }) {
  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }));

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="space-y-1">
          <Label className={labelClass}>Priority</Label>
          <Select value={filters.priority} onValueChange={(v) => set("priority", v)}>
            <SelectTrigger className={selectClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className={labelClass}>Status</Label>
          <Select value={filters.status} onValueChange={(v) => set("status", v)}>
            <SelectTrigger className={selectClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className={labelClass}>Due date</Label>
          <Select value={filters.due} onValueChange={(v) => set("due", v)}>
            <SelectTrigger className={selectClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="today">Due today</SelectItem>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="none">No due date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className={labelClass}>Sort by</Label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className={selectClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">Newest</SelectItem>
              <SelectItem value="due_asc">Due date (earliest)</SelectItem>
              <SelectItem value="due_desc">Due date (latest)</SelectItem>
              <SelectItem value="priority_desc">Priority (high→low)</SelectItem>
              <SelectItem value="priority_asc">Priority (low→high)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <p className="mt-3 px-1 text-xs text-muted-foreground">
        Showing {resultCount} {resultCount === 1 ? "task" : "tasks"}
      </p>
    </div>
  );
}