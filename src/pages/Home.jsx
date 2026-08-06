import React, { useEffect, useState, useCallback, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import TaskForm from "@/components/tasks/TaskForm";
import TaskFilters from "@/components/tasks/TaskFilters";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import { Loader2, ListTodo, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

const priorityRank = { high: 3, medium: 2, low: 1 };

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const dueTime = (t) => (t.due_date ? new Date(t.due_date + "T00:00:00").getTime() : null);

const compareDue = (a, b, descending) => {
  const da = dueTime(a);
  const db = dueTime(b);
  if (da === null && db === null) return 0;
  if (da === null) return 1; // nulls always last
  if (db === null) return -1;
  return descending ? db - da : da - db;
};

export default function Home() {
  const [tasks, setTasks] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priority: "all",
    status: "all",
    due: "all",
  });
  const [sort, setSort] = useState("created");

  const loadTasks = useCallback(async () => {
    try {
      const data = await base44.entities.Task.list("-created_date", 200);
      setTasks(data);
    } catch (err) {
      setError(err);
      setTasks([]);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreate = async (payload) => {
    const created = await base44.entities.Task.create(payload);
    setTasks((prev) => (prev ? [created, ...prev] : [created]));
  };

  const handleDelete = async (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await base44.entities.Task.delete(id);
    } catch {
      loadTasks();
    }
  };

  const handleMoveTask = async (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    try {
      await base44.entities.Task.update(taskId, { status: newStatus });
    } catch {
      loadTasks();
    }
  };

  const visibleTasks = useMemo(() => {
    if (!tasks) return [];

    const today = startOfDay(new Date()).getTime();
    const weekEnd = today + 7 * 24 * 60 * 60 * 1000;

    const filtered = tasks.filter((t) => {
      if (filters.priority !== "all" && t.priority !== filters.priority) return false;
      if (filters.status !== "all" && t.status !== filters.status) return false;

      if (filters.due !== "all") {
        const due = t.due_date ? startOfDay(new Date(t.due_date + "T00:00:00")).getTime() : null;
        switch (filters.due) {
          case "none":
            if (due !== null) return false;
            break;
          case "overdue":
            if (due === null || due >= today) return false;
            break;
          case "today":
            if (due === null || due !== today) return false;
            break;
          case "week":
            if (due === null || due < today || due > weekEnd) return false;
            break;
          case "upcoming":
            if (due === null || due < today) return false;
            break;
          default:
            break;
        }
      }
      return true;
    });

    const sorted = [...filtered];
    switch (sort) {
      case "due_asc":
        sorted.sort((a, b) => compareDue(a, b, false));
        break;
      case "due_desc":
        sorted.sort((a, b) => compareDue(a, b, true));
        break;
      case "priority_desc":
        sorted.sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority]);
        break;
      case "priority_asc":
        sorted.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
        break;
      default:
        break; // already newest-first from load
    }
    return sorted;
  }, [tasks, filters, sort]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:py-16">
        <header className="mb-10">
          <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background">
            <ListTodo className="h-5 w-5" />
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Tasks</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Plan, prioritize, and move work across the board.
              </p>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <TaskForm onCreate={handleCreate} />
          </div>
          <div className="lg:col-span-3">
            <TaskFilters
              filters={filters}
              setFilters={setFilters}
              sort={sort}
              setSort={setSort}
              resultCount={visibleTasks.length}
            />
          </div>
        </div>

        <section className="mt-8">
          {tasks === null && !error && (
            <div className="flex justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              Couldn't load tasks. Please try again.
            </p>
          )}

          {tasks && (
            <KanbanBoard
              tasks={visibleTasks}
              onDelete={handleDelete}
              onMoveTask={handleMoveTask}
            />
          )}
        </section>
      </div>
    </div>
  );
}