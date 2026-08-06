import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { cn } from "@/lib/utils";

const columnMeta = {
  todo: { title: "To Do", dot: "bg-muted-foreground" },
  in_progress: { title: "In Progress", dot: "bg-blue-500" },
  done: { title: "Done", dot: "bg-emerald-500" },
};

export default function KanbanColumn({ status, tasks, onDelete }) {
  const meta = columnMeta[status];
  return (
    <Droppable droppableId={status}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={cn(
            "flex min-h-[220px] flex-col rounded-xl border border-border bg-muted/30 p-2",
            snapshot.isDraggingOver && "bg-muted/60 ring-2 ring-ring/30"
          )}
        >
          <div className="flex items-center justify-between px-2 py-2">
            <div className="flex items-center gap-2">
              <span className={cn("h-2 w-2 rounded-full", meta.dot)} />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {meta.title}
              </h3>
            </div>
            <span className="text-xs font-medium text-muted-foreground">{tasks.length}</span>
          </div>

          <div className="flex-1 space-y-2 px-1 pb-1">
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(dragProvided, dragSnapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                  >
                    <TaskCard
                      task={task}
                      onDelete={() => onDelete(task.id)}
                      isDragging={dragSnapshot.isDragging}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {tasks.length === 0 && (
              <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                Drop tasks here
              </div>
            )}
          </div>
        </div>
      )}
    </Droppable>
  );
}