import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/AuthProvider";
import { useConversations } from "@/features/chat/hooks/useConversations";
import type { ConversationItemDTO } from "@/types/dtos";
import { ChatView } from "@/features/chat/components/ChatView";

function displayName(c: ConversationItemDTO) {
  return c.user.fullName || c.user.username || c.user.email;
}

export function ChatShell() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { user: me, logout } = useAuth();
  const { data, isLoading, isError, refetch } = useConversations();

  const [mobileOpenChat, setMobileOpenChat] = useState(!!conversationId);
  useEffect(() => setMobileOpenChat(!!conversationId), [conversationId]);

  const conversations = Array.isArray(data) ? data : [];
  const active = useMemo(
    () => conversations.find((c) => c.id === conversationId) ?? null,
    [conversations, conversationId],
  );

  const listRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-screen w-full bg-background">
      <div className="h-full w-full flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "w-full md:w-80 lg:w-96 h-full border-r border-border bg-card",
            mobileOpenChat && "hidden md:block",
          )}
        >
          <div className="h-14 px-3 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{me?.fullName || me?.username || me?.email}</p>
              <p className="text-xs text-muted-foreground">Messages</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => logout()}>
              Logout
            </Button>
          </div>
          <Separator />

          <div className="p-3">
            <Input placeholder="Search (not implemented: no endpoint)" disabled />
          </div>

          <div ref={listRef} className="h-[calc(100%-112px)] overflow-y-auto scrollbar-thin px-2 pb-3">
            {isLoading ? (
              <div className="space-y-2 px-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-14 rounded-xl bg-secondary animate-pulse" />
                ))}
              </div>
            ) : isError ? (
              <div className="px-2 py-6">
                <p className="text-sm text-muted-foreground">Failed to load conversations.</p>
                <Button className="mt-3" variant="secondary" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            ) : conversations.length === 0 ? (
              <div className="px-2 py-6">
                <p className="text-sm text-muted-foreground">No conversations yet.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {conversations.map((c) => {
                  const isActive = c.id === conversationId;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        navigate(`/chat/${c.id}`);
                        setMobileOpenChat(true);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-xl hover:bg-secondary/70 transition-colors",
                        isActive && "bg-secondary",
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{displayName(c)}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {c.lastMessage?.content || (c.lastMessage?.attachmentType ? c.lastMessage.attachmentType : "") || ""}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[10px] text-muted-foreground">{new Date(c.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          {c.unreadCount > 0 ? (
                            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
                              {c.unreadCount}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* Chat */}
        <main className={cn("flex-1 h-full", !mobileOpenChat && "hidden md:block")}>
          <ChatView
            conversationId={conversationId ?? null}
            onBack={() => {
              setMobileOpenChat(false);
              navigate("/");
            }}
            title={active ? displayName(active) : ""}
          />
        </main>
      </div>
    </div>
  );
}
