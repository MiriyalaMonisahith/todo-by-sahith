import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import StatCard from "@/components/tasks/StatCard";
import {
  ListTodo,
  CircleDot,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  CalendarClock,
  Flame,
} from "lucide-react";

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
};

export default function Dashboard() {
  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => base44.entities.Task.list("-created_date", 200),
  });

  const stats = useMemo(() => {
    const today = startOfDay(new Date());
    const counts = { todo: 0, in_progress: 0, done: 0 };
    const priorityCounts = { low: 0, medium: 0, high: 0 };
    let overdue = 0;
    let dueToday = 0;

    tasks.forEach((t) => {
      if (counts[t.status] !== undefined) counts[t.status]++;
      if (priorityCounts[t.priority] !== undefined) priorityCounts[t.priority]++;
      if (t.due_date && t.status !== "done") {
        const due = startOfDay(new Date(t.due_date + "T00:00:00"));
        if (due < today) overdue++;
        if (due === today) dueToday++;
      }
    });

    return {
      total: tasks.length,
      todo: counts.todo,
      inProgress: counts.in_progress,
      done: counts.done,
      overdue,
      dueToday,
      high: priorityCounts.high,
    };
  }, [tasks]);

  const completionRate =
    stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:py-16">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background">
              <ListTodo className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              A live overview of your tasks — updates automatically.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" /> Board
          </Link>
        </header>

        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {isError && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            Couldn't load tasks. Please try again.
          </p>
        )}

        {!isLoading && !isError && (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard
                icon={ListTodo}
                label="Total tasks"
                value={stats.total}
                accent="bg-primary/10 text-primary"
                hint={`${stats.todo} to do`}
              />
              <StatCard
                icon={CircleDot}
                label="In progress"
                value={stats.inProgress}
                accent="bg-blue-50 text-blue-600"
              />
              <StatCard
                icon={CheckCircle2}
                label="Done"
                value={stats.done}
                accent="bg-emerald-50 text-emerald-600"
                hint={`${completionRate}% complete`}
              />
              <StatCard
                icon={AlertTriangle}
                label="Overdue"
                value={stats.overdue}
                accent="bg-rose-50 text-rose-600"
                hint={`${stats.dueToday} due today`}
              />
            </div>

            <section className="mt-8">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Priority breakdown
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard
                  icon={Flame}
                  label="High priority"
                  value={stats.high}
                  accent="bg-rose-50 text-rose-600"
                />
                <StatCard
                  icon={CalendarClock}
                  label="Due today"
                  value={stats.dueToday}
                  accent="bg-amber-50 text-amber-600"
                />
                <StatCard
                  icon={CircleDot}
                  label="To do"
                  value={stats.todo}
                  accent="bg-muted text-muted-foreground"
                />
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}