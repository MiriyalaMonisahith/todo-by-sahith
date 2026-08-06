import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ChevronRight, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const toolNameLabel = (name) => {
  const map = {
    create: "Create task",
    list: "List tasks",
    update: "Update task",
    delete: "Delete task",
    get: "Get task",
  };
  return map[name] || name;
};

const statusMeta = (status) => {
  switch (status) {
    case "pending":
    case "running":
    case "in_progress":
      return { icon: Loader2, className: "animate-spin text-blue-500", label: "working…" };
    case "completed":
    case "success":
      return { icon: CheckCircle2, className: "text-emerald-500", label: "done" };
    case "failed":
    case "error":
      return { icon: XCircle, className: "text-rose-500", label: "failed" };
    default:
      return { icon: ChevronRight, className: "text-muted-foreground", label: status };
  }
};

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div className="max-w-[88%] space-y-2">
        {message.content && (
          <div
            className={cn(
              "rounded-2xl px-3.5 py-2.5 text-sm",
              isUser
                ? "rounded-br-sm bg-foreground text-background"
                : "rounded-bl-sm bg-muted text-foreground"
            )}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-4 [&_a]:underline [&_code]:rounded [&_code]:bg-muted-foreground/10 [&_code]:px-1">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            )}
          </div>
        )}
        {message.tool_calls?.map((tc, i) => (
          <ToolCallDisplay key={i} toolCall={tc} />
        ))}
      </div>
    </div>
  );
}

function ToolCallDisplay({ toolCall }) {
  const [expanded, setExpanded] = useState(false);
  const meta = statusMeta(toolCall.status);
  const Icon = meta.icon;
  const hide =
    toolCall.display_projection?.hide_details &&
    toolCall.display_projection?.details_redacted;
  const label = toolCall.display_projection?.label || toolNameLabel(toolCall.name);

  let parsedArgs = toolCall.arguments_string;
  try {
    parsedArgs = JSON.parse(toolCall.arguments_string);
  } catch {
    /* keep raw */
  }
  let parsedResults = toolCall.results;
  try {
    if (typeof parsedResults === "string") parsedResults = JSON.parse(parsedResults);
  } catch {
    /* keep raw */
  }

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs">
      <button
        onClick={() => !hide && setExpanded((e) => !e)}
        className="flex w-full items-center gap-2 text-left"
      >
        <Icon className={cn("h-3.5 w-3.5 shrink-0", meta.className)} />
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">{meta.label}</span>
      </button>
      {!hide && expanded && (
        <div className="mt-2 space-y-1.5">
          {toolCall.arguments_string && (
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Parameters</p>
              <pre className="overflow-x-auto rounded bg-muted p-2 text-[11px]">
                {JSON.stringify(parsedArgs, null, 2)}
              </pre>
            </div>
          )}
          {toolCall.results != null && (
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Result</p>
              <pre className="overflow-x-auto rounded bg-muted p-2 text-[11px]">
                {JSON.stringify(parsedResults, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}