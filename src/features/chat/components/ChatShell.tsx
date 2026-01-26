import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useConversations } from "@/features/chat/hooks/useConversations";
import { ChatView } from "./ChatView";
import { SidebarHeader } from "./SidebarHeader";
import { ConversationList } from "./ConversationList";
import { FeatureFlagsCard } from "./FeatureFlagsCard";
import { FeatureNotReady } from "@/components/ui/FeatureNotReady";
import type { ConversationItemDTO } from "@/types/dtos";

function displayName(c: ConversationItemDTO) {
  return c.user.fullName || c.user.username || c.user.email;
}

export function ChatShell() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useConversations();

  const [mobileOpenChat, setMobileOpenChat] = useState(!!conversationId);
  const [showFeatureDemo, setShowFeatureDemo] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => setMobileOpenChat(!!conversationId), [conversationId]);

  const conversations = Array.isArray(data) ? data : [];

  const active = useMemo(
    () => conversations.find((c) => c.id === conversationId) ?? null,
    [conversations, conversationId],
  );

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    return conversations.filter((c) =>
      displayName(c).toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [conversations, searchQuery]);

  const handleFeatureDemo = () => {
    setShowFeatureDemo(true);
    setTimeout(() => setShowFeatureDemo(false), 3000);
  };

  const handleSelectConversation = (id: string) => {
    navigate(`/chat/${id}`);
    setMobileOpenChat(true);
  };

  const handleBack = () => {
    setMobileOpenChat(false);
    navigate("/");
  };

  return (
    <div className="h-screen w-full bg-background">
      {/* Feature demo toast */}
      <AnimatePresence>
        {showFeatureDemo && <FeatureNotReady variant="toast" />}
      </AnimatePresence>

      <div className="h-full w-full flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "w-full md:w-80 lg:w-96 h-full border-r border-border bg-card flex flex-col",
            mobileOpenChat && "hidden md:flex",
          )}
        >
          <SidebarHeader
            conversationCount={conversations.length}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onFeatureDemo={handleFeatureDemo}
          />

          <FeatureFlagsCard />

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
            <ConversationList
              conversations={filteredConversations}
              activeId={conversationId}
              isLoading={isLoading}
              isError={isError}
              searchQuery={searchQuery}
              onSelect={handleSelectConversation}
              onRetry={() => refetch()}
            />
          </div>
        </aside>

        {/* Chat */}
        <main
          className={cn("flex-1 h-full", !mobileOpenChat && "hidden md:block")}
        >
          <ChatView
            conversationId={conversationId ?? null}
            onBack={handleBack}
            title={active ? displayName(active) : ""}
          />
        </main>
      </div>
    </div>
  );
}
