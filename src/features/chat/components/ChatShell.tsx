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
import { ProfilePage } from "./ProfilePage";
import type { ConversationItemDTO } from "@/types/dtos";
import { useUserSearch } from "@/hooks/useUserSearch";
import { conversationsApi } from "@/api/conversations";
import { useConversationSocket } from "@/realtime/useConversationsSocket";

function displayName(c: ConversationItemDTO) {
  return c.user.fullName || c.user.username || c.user.email;
}

export function ChatShell() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useConversations();
  const {
    isLoading: isSearchLoading,
    query,
    results: searchResults,
    setQuery,
  } = useUserSearch();

  useConversationSocket();

  const [mobileOpenChat, setMobileOpenChat] = useState(!!conversationId);
  const [showFeatureDemo, setShowFeatureDemo] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => setMobileOpenChat(!!conversationId), [conversationId]);

  const conversations = Array.isArray(data) ? data : [];

  const active = useMemo(
    () => conversations.find((c) => c.id === conversationId) ?? null,
    [conversations, conversationId],
  );

  const filteredConversations = useMemo(() => {
    if (!query.trim()) return conversations;
    return searchResults;
  }, [conversations, searchResults, query]);

  const handleFeatureDemo = () => {
    setShowFeatureDemo(true);
    setTimeout(() => setShowFeatureDemo(false), 3000);
  };

  const handleSelectConversation = async (id: string) => {
    const existing = conversations.find((c) => c.id === id);

    if (existing) {
      navigate(`/chat/${id}`);
      setMobileOpenChat(true);
      return;
    }

    const convo = await conversationsApi.createWithUser(id);
    navigate(`/chat/${convo.id}`);
    setMobileOpenChat(true);
  };

  const handleBack = () => {
    setMobileOpenChat(false);
    navigate("/");
  };

  // Show profile page
  if (showProfile) {
    return <ProfilePage onBack={() => setShowProfile(false)} />;
  }

  return (
    <div className="h-screen-safe w-full bg-background flex flex-col overflow-hidden">
      {/* Feature demo toast */}
      <AnimatePresence>
        {showFeatureDemo && <FeatureNotReady variant="toast" />}
      </AnimatePresence>

      <div className="flex-1 w-full flex min-h-0">
        {/* Sidebar */}
        <aside
          className={cn(
            "w-full md:w-80 lg:w-96 h-full border-r border-border bg-card flex flex-col",
            mobileOpenChat && "hidden md:flex",
          )}
        >
          <SidebarHeader
            conversationCount={conversations.length}
            searchQuery={query}
            onSearchChange={setQuery}
            onFeatureDemo={handleFeatureDemo}
            onOpenProfile={() => setShowProfile(true)}
          />

          <FeatureFlagsCard />

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
            <ConversationList
              conversations={filteredConversations}
              activeId={conversationId}
              isLoading={isLoading || isSearchLoading}
              isError={isError}
              searchQuery={query}
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
