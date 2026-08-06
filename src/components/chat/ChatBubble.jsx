import React, { useEffect, useRef, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { MessageSquare, X, Send, Loader2, Sparkles } from "lucide-react";
import MessageBubble from "./MessageBubble";

const AGENT_NAME = "task_assistant";
const STORAGE_KEY = "task_assistant_conversation_id";

export default function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const scrollRef = useRef(null);

  const ensureConversation = useCallback(async () => {
    if (conversationId) return conversationId;
    const stored = localStorage.getItem(STORAGE_KEY);
    try {
      setLoadingInit(true);
      if (stored) {
        const conv = await base44.agents.getConversation(stored);
        setConversationId(stored);
        setMessages(conv.messages || []);
        return stored;
      }
      const conv = await base44.agents.createConversation({
        agent_name: AGENT_NAME,
        metadata: { name: "Task Assistant" },
      });
      localStorage.setItem(STORAGE_KEY, conv.id);
      setConversationId(conv.id);
      setMessages(conv.messages || []);
      return conv.id;
    } finally {
      setLoadingInit(false);
    }
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;
    const unsubscribe = base44.agents.subscribeToConversation(conversationId, (data) => {
      const msgs = data.messages || [];
      setMessages(msgs);
      const last = msgs[msgs.length - 1];
      if (last && last.role === "assistant" && last.content) {
        setBusy(false);
      }
    });
    return () => unsubscribe();
  }, [conversationId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, busy]);

  const handleOpen = async () => {
    setOpen(true);
    if (!conversationId) {
      try {
        await ensureConversation();
      } catch {
        setLoadingInit(false);
      }
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || busy || !conversationId) return;
    setInput("");
    setBusy(true);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    try {
      const conv = await base44.agents.getConversation(conversationId);
      await base44.agents.addMessage(conv, { role: "user", content: text });
    } catch {
      setBusy(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    }
  };

  return (
    <>
      <button
        onClick={() => (open ? setOpen(false) : handleOpen())}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform hover:scale-105"
        title="Task assistant"
      >
        {open ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[62vh] max-h-[600px] w-[90vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <header className="flex items-center gap-2.5 border-b border-border px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Task Assistant</p>
              <p className="text-[11px] text-muted-foreground">Ask me to create or manage tasks</p>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {loadingInit && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
            {!loadingInit && messages.length === 0 && (
              <div className="py-6 text-center">
                <p className="text-sm font-medium text-foreground">Hi there 👋</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Try: “Add a high priority task to review the design by Friday.”
                </p>
              </div>
            )}
            {messages.map((m, i) => (
              <MessageBubble key={i} message={m} />
            ))}
            {busy && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2.5">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.2s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.1s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={1}
                placeholder="Message the assistant…"
                className="max-h-24 min-h-[40px] flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || busy}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground text-background disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}