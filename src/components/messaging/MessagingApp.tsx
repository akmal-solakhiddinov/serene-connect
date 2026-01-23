import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { ChatArea } from "./ChatArea";
import { ProfilePage } from "./ProfilePage";
import { useConversation } from "@/hooks/useConversation";
import { cn } from "@/lib/utils";
import type { Conversation, User } from "@/types";

export const MessagingApp = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();

  const { conversation: fetchedConversation, isLoading, hasFetched } = useConversation(
    conversationId || null,
  );
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Sync URL param with active conversation
  useEffect(() => {
    if (conversationId) {
      if (fetchedConversation) {
        setActiveConversation(fetchedConversation);
        setShowChat(true);
        setShowProfile(false);
      } else if (hasFetched && !isLoading) {
        // Invalid conversation ID AND first fetch attempt finished -> redirect to home
        navigate("/", { replace: true });
      }
    } else {
      setActiveConversation(null);
      setShowChat(false);
    }
  }, [conversationId, fetchedConversation, hasFetched, isLoading, navigate]);

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    navigate(`/chat/${conversation.id}`);
  };

  const handleStartNewConversation = (user: User) => {
    // Create a new temporary conversation
    const newConversation: Conversation = {
      id: `new-${user.id}`,
      user,
      lastMessage: "",
      lastMessageTime: "Now",
      unreadCount: 0,
      messages: [],
    };
    setActiveConversation(newConversation);
    setShowChat(true);
    setShowProfile(false);
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleOpenProfile = () => {
    setShowProfile(true);
    setShowChat(false);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
    if (conversationId) {
      setShowChat(true);
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-background">
      <div className="flex h-full w-full">
        {/* Sidebar - Always visible on desktop, conditional on mobile */}
        <div
          className={cn(
            "h-full transition-all duration-300 ease-out",
            // Mobile: full width when visible, hidden when chat or profile is shown
            "w-full md:w-80 lg:w-96",
            (showChat || showProfile) && "hidden md:block",
          )}
        >
          <Sidebar
            activeConversation={activeConversation}
            onSelectConversation={handleSelectConversation}
            onStartNewConversation={handleStartNewConversation}
            onOpenProfile={handleOpenProfile}
          />
        </div>

        {/* Profile Page - Mobile only */}
        <div
          className={cn(
            "h-full transition-all duration-300 ease-out",
            "w-full md:hidden",
            !showProfile && "hidden",
          )}
        >
          <AnimatePresence mode="wait">
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <ProfilePage onBack={handleCloseProfile} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chat Area - Mobile slide-in, desktop always visible */}
        <div
          className={cn(
            "h-full flex-1 transition-all duration-300 ease-out",
            // Mobile: full width when visible
            "w-full md:w-auto",
            (!showChat || showProfile) && "hidden md:block",
          )}
        >
          <AnimatePresence mode="wait">
            {(showChat || !showChat) && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <ChatArea
                  conversation={activeConversation}
                  onBack={handleBack}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
