import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, CheckCheck, Paperclip, Send } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FeatureNotReady } from "@/components/ui/FeatureNotReady";
import { cn } from "@/lib/utils";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { conversationsApi } from "@/api/conversations";
import { useAuth } from "@/features/auth/AuthProvider";
import {
  isOwnMessage,
  useDeleteMessage,
  useEditMessage,
  useMarkMessageSeen,
  useMessages,
  useSendTextMessage,
} from "@/features/chat/hooks/useMessages";
import type { MessageDTO } from "@/types/dtos";

function StatusIcon({ status, own }: { status: MessageDTO["status"]; own: boolean }) {
  if (!own) return null;
  if (status === "seen") return <CheckCheck className="h-3.5 w-3.5 text-primary" />;
  return <Check className="h-3.5 w-3.5 text-muted-foreground" />;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatView({
  conversationId,
  title,
  onBack,
}: {
  conversationId: string | null;
  title: string;
  onBack: () => void;
}) {
  const { user } = useAuth();
  const meId = user?.id ?? "";

  const { data, isLoading, isError, refetch } = useMessages(conversationId);
  const sendMutation = useSendTextMessage(conversationId ?? "");
  const editMutation = useEditMessage();
  const delMutation = useDeleteMessage();
  const seenMutation = useMarkMessageSeen();

  const [draft, setDraft] = useState("");
  const [windowSize, setWindowSize] = useState(40);
  const [showFeatureToast, setShowFeatureToast] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const all = data ?? [];
  const ordered = useMemo(() => [...all].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)), [all]);
  const visible = useMemo(() => ordered.slice(Math.max(0, ordered.length - windowSize)), [ordered, windowSize]);

  useEffect(() => {
    if (!conversationId) return;
    conversationsApi.markRead(conversationId).catch(() => void 0);
  }, [conversationId]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight });
  }, [conversationId, ordered.length]);

  useEffect(() => {
    if (!conversationId) return;
    if (!scrollerRef.current) return;

    const root = scrollerRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = (entry.target as HTMLElement).dataset.messageId;
          const status = (entry.target as HTMLElement).dataset.messageStatus as MessageDTO["status"] | undefined;
          const senderId = (entry.target as HTMLElement).dataset.senderId;
          if (!id || !status) continue;
          if (senderId === meId) continue;
          if (status === "seen") continue;
          seenMutation.mutate({ id, conversationId });
        }
      },
      { root, threshold: 0.6 },
    );

    const nodes = root.querySelectorAll("[data-message-id]");
    nodes.forEach((n) => io.observe(n));

    return () => io.disconnect();
  }, [conversationId, meId, visible, seenMutation]);

  const handleFeatureNotReady = () => {
    setShowFeatureToast(true);
    setTimeout(() => setShowFeatureToast(false), 3000);
  };

  const handleSend = async () => {
    if (!conversationId) return;
    const content = draft.trim();
    if (!content) return;
    setDraft("");
    await sendMutation.mutateAsync({ content });
  };

  const handleEdit = async (m: MessageDTO) => {
    if (!isFeatureEnabled("messageEdit")) {
      handleFeatureNotReady();
      return;
    }
    const next = window.prompt("Edit message", m.content ?? "");
    if (!next || !next.trim()) return;
    try {
      await editMutation.mutateAsync({ id: m.id, content: next.trim(), conversationId: conversationId! });
    } catch (err: any) {
      if (err?.message === "FEATURE_NOT_READY") {
        handleFeatureNotReady();
      }
    }
  };

  const handleDelete = async (m: MessageDTO) => {
    if (!isFeatureEnabled("messageDelete")) {
      handleFeatureNotReady();
      return;
    }
    if (!window.confirm("Delete this message?")) return;
    try {
      await delMutation.mutateAsync({ id: m.id, conversationId: conversationId! });
    } catch (err: any) {
      if (err?.message === "FEATURE_NOT_READY") {
        handleFeatureNotReady();
      }
    }
  };

  const handleAttachment = () => {
    if (!isFeatureEnabled("attachments")) {
      handleFeatureNotReady();
      return;
    }
    // Future: open file picker
  };

  if (!conversationId) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background">
        <div className="text-center px-6">
          <p className="text-sm text-muted-foreground">Select a conversation to start messaging.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-background">
      {/* Feature not ready toast */}
      <AnimatePresence>
        {showFeatureToast && <FeatureNotReady variant="toast" />}
      </AnimatePresence>

      <header className="h-14 flex items-center gap-2 px-2 md:px-4 bg-card border-b border-border">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{title || "Chat"}</p>
          <p className="text-xs text-muted-foreground">{isLoading ? "Loading…" : ""}</p>
        </div>
      </header>

      <div
        ref={scrollerRef}
        className="flex-1 overflow-y-auto scrollbar-thin px-3 md:px-6 py-4 bg-gradient-to-b from-secondary/20 to-background"
        onScroll={(e) => {
          const el = e.currentTarget;
          if (el.scrollTop < 120 && windowSize < ordered.length) {
            setWindowSize((s) => Math.min(ordered.length, s + 40));
          }
        }}
      >
        {isError ? (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground">Failed to load messages.</p>
            <Button className="mt-3" variant="secondary" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-10 rounded-2xl bg-secondary animate-pulse",
                  i % 2 ? "w-2/3 ml-auto" : "w-3/4",
                )}
              />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">No messages yet.</div>
        ) : (
          <div className="space-y-2">
            {visible.map((m) => {
              const own = isOwnMessage(m, meId);
              return (
                <div
                  key={m.id}
                  data-message-id={m.id}
                  data-message-status={m.status}
                  data-sender-id={m.senderId}
                  className={cn("flex", own ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[78%] rounded-2xl px-3 py-2 shadow-sm",
                      own
                        ? "bg-bubble-sent text-bubble-sent-foreground rounded-br-md"
                        : "bg-bubble-received text-bubble-received-foreground rounded-bl-md",
                    )}
                  >
                    {m.content ? <p className="text-sm whitespace-pre-wrap break-words">{m.content}</p> : null}
                    {!m.content && m.attachmentType ? (
                      <p className="text-sm">{m.attachmentType}</p>
                    ) : null}

                    <div className={cn("mt-1 flex items-center gap-1", own ? "justify-end" : "justify-start")}>
                      <span className={cn("text-[10px]", own ? "text-bubble-sent-foreground/70" : "text-muted-foreground")}>
                        {formatTime(m.createdAt)}
                      </span>
                      <StatusIcon status={m.status} own={own} />
                    </div>

                    {own ? (
                      <div className="mt-2 flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(m)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(m)}
                        >
                          Delete
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Separator />

      <footer className="p-2 md:p-3 bg-card">
        <div className="flex items-center gap-2 rounded-2xl bg-secondary/60 px-2 py-2">
          <Button variant="ghost" size="icon" onClick={handleAttachment}>
            <Paperclip className="h-5 w-5 text-muted-foreground" />
          </Button>

          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Message"
            className="border-0 bg-transparent focus-visible:ring-0"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <Button
            size="icon"
            className="rounded-xl"
            onClick={handleSend}
            disabled={sendMutation.isPending || !draft.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
