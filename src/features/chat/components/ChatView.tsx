import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  Paperclip,
  Send,
  Smile,
  Mic,
  MoreVertical,
  Edit3,
  Trash2,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useSocket } from "@/realtime/useSocket";
import { useMessageSocket } from "@/realtime/useMessageSocket";

function StatusIcon({
  status,
  own,
}: {
  status: MessageDTO["status"];
  own: boolean;
}) {
  if (!own) return null;
  if (status === "seen")
    return <CheckCheck className="h-3.5 w-3.5 text-primary text-white" />;
  return (
    <Check
      className="h-3.5 w-3.5 text-muted-foreground/70 text-white
    "
    />
  );
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
  const [isFocused, setIsFocused] = useState(false);
  const [windowSize, setWindowSize] = useState(40);
  const [showFeatureToast, setShowFeatureToast] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();
  useMessageSocket(conversationId);
  const ordered = useMemo(() => {
    const all = data?.messages ?? [];
    return [...all].sort(
      (a, b) => +new Date(a.createdAt) - +new Date(b.createdAt),
    );
  }, [data]);

  const visible = useMemo(
    () => ordered.slice(Math.max(0, ordered.length - windowSize)),
    [ordered, windowSize],
  );

  /*  useEffect(() => {
    if (!conversationId) return;
    conversationsApi.markRead(conversationId).catch(() => void 0);
  }, [conversationId]);
*/

  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit("conversation:join", { conversationId });

    return () => {
      socket.emit("conversation:leave");
    };
  }, [conversationId, socket]);

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
          const id: string = (entry.target as HTMLElement).dataset.messageId;
          const status = (entry.target as HTMLElement).dataset.messageStatus as
            | MessageDTO["status"]
            | undefined;
          const senderId = (entry.target as HTMLElement).dataset.senderId;
          if (!id || !status) continue;
          if (senderId === meId) continue;
          if (status === "seen") continue;

          if (status === "unseen") {
            seenMutation.mutate({ messageId: id, conversationId });
            io.unobserve(entry.target);
          }
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
      await editMutation.mutateAsync({
        id: m.id,
        content: next.trim(),
        conversationId: conversationId!,
      });
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
      await delMutation.mutateAsync({
        id: m.id,
        conversationId: conversationId!,
      });
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

  const handleEmoji = () => {
    handleFeatureNotReady();
  };

  const handleVoice = () => {
    handleFeatureNotReady();
  };

  if (!conversationId) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-background to-secondary/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center px-6"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
            <MessageCircle className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Welcome to Messages
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs">
            Select a conversation from the sidebar to start chatting
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-background">
      {/* Feature not ready toast */}
      <AnimatePresence>
        {showFeatureToast && <FeatureNotReady variant="toast" />}
      </AnimatePresence>

      {/* Header */}
      <header className="h-14 flex items-center gap-2 px-2 md:px-4 bg-card/80 backdrop-blur-sm border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {title || "Chat"}
          </p>
          <p className="text-xs text-muted-foreground">
            {isLoading ? "Loading…" : data.user.isActive ? "Online" : "offline"}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleFeatureNotReady}>
          <MoreVertical className="h-5 w-5 text-muted-foreground" />
        </Button>
      </header>

      {/* Messages */}
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
            <p className="text-sm text-muted-foreground">
              Failed to load messages.
            </p>
            <Button
              className="mt-3"
              variant="secondary"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "h-12 rounded-2xl bg-secondary/50 animate-pulse",
                  i % 2 ? "w-2/3 ml-auto" : "w-3/4",
                )}
              />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="py-10 text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-secondary flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No messages yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Send a message to start the conversation!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {visible.map((m, index) => {
              const own = isOwnMessage(m, meId);
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  data-message-id={m.id}
                  data-message-status={m.status}
                  data-sender-id={m.senderId}
                  className={cn(
                    "flex group",
                    own ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "flex items-end gap-1 max-w-[78%]",
                      own && "flex-row-reverse",
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2.5 shadow-sm transition-all",
                        own
                          ? "bg-bubble-sent text-bubble-sent-foreground rounded-br-md"
                          : "bg-bubble-received text-bubble-received-foreground rounded-bl-md",
                      )}
                    >
                      {m.content ? (
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {m.content}
                        </p>
                      ) : null}
                      {!m.content && m.attachmentType ? (
                        <p className="text-sm italic">[{m.attachmentType}]</p>
                      ) : null}

                      <div
                        className={cn(
                          "mt-1 flex items-center gap-1",
                          own ? "justify-end" : "justify-start",
                        )}
                      >
                        <span
                          className={cn(
                            "text-[10px]",
                            own
                              ? "text-bubble-sent-foreground/70"
                              : "text-muted-foreground",
                          )}
                        >
                          {formatTime(m.createdAt)}
                        </span>
                        <StatusIcon status={m.status} own={own} />
                      </div>
                    </div>

                    {/* Message actions - shown on hover for own messages */}
                    {own && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(m)}>
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit
                            {!isFeatureEnabled("messageEdit") && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                (soon)
                              </span>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(m)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                            {!isFeatureEnabled("messageDelete") && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                (soon)
                              </span>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <Separator />

      {/* Message Input */}
      <footer className="flex-shrink-0 p-3 bg-card/80 backdrop-blur-sm">
        <div
          className={cn(
            "flex items-end gap-2 p-2 rounded-2xl bg-secondary/50 transition-all duration-200",
            isFocused && "ring-2 ring-primary/20 bg-secondary/70",
          )}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleEmoji}
            className="p-2 rounded-xl hover:bg-background/50 transition-colors"
          >
            <Smile className="w-5 h-5 text-muted-foreground" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAttachment}
            className="p-2 rounded-xl hover:bg-background/50 transition-colors"
          >
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </motion.button>

          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 bg-transparent border-0 resize-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none py-2 px-1 max-h-32"
            style={{ minHeight: "40px" }}
          />

          <AnimatePresence mode="wait">
            {draft.trim() ? (
              <motion.button
                key="send"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                disabled={sendMutation.isPending}
                className="p-2.5 rounded-xl gradient-primary shadow-glow transition-all disabled:opacity-50"
              >
                <Send className="w-5 h-5 text-primary-foreground" />
              </motion.button>
            ) : (
              <motion.button
                key="mic"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleVoice}
                className="p-2.5 rounded-xl hover:bg-background/50 transition-colors"
              >
                <Mic className="w-5 h-5 text-muted-foreground" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </footer>
    </div>
  );
}
