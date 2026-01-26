import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "./Avatar";
import { cn } from "@/lib/utils";
import type { ConversationItemDTO } from "@/types/dtos";

function displayName(c: ConversationItemDTO) {
  return c.user.fullName || c.user.username || c.user.email;
}

interface ConversationListProps {
  conversations: ConversationItemDTO[];
  activeId: string | undefined;
  isLoading: boolean;
  isError: boolean;
  searchQuery: string;
  onSelect: (id: string) => void;
  onRetry: () => void;
}

export function ConversationList({
  conversations,
  activeId,
  isLoading,
  isError,
  searchQuery,
  onSelect,
  onRetry,
}: ConversationListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 px-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="h-16 rounded-xl bg-secondary/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-3 py-8 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-destructive/10 flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-destructive" />
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Failed to load conversations
        </p>
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="px-3 py-8 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-secondary flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          {searchQuery ? "No matching conversations" : "No conversations yet"}
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          {searchQuery ? "Try a different search" : "Start a new conversation!"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((c, index) => {
        const isActive = c.id === activeId;
        const name = displayName(c);

        return (
          <motion.button
            key={c.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect(c.id)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
              "hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-primary/20",
              isActive && "bg-secondary shadow-sm",
            )}
          >
            <Avatar name={name} size="sm" />

            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "font-semibold text-foreground truncate text-sm",
                    c.unreadCount > 0 && "text-foreground",
                  )}
                >
                  {name}
                </span>
                <span
                  className={cn(
                    "text-[10px] flex-shrink-0",
                    c.unreadCount > 0
                      ? "text-primary font-medium"
                      : "text-muted-foreground",
                  )}
                >
                  {c.lastMessageTime &&
                    new Date(c.lastMessageTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 mt-0.5">
                <p
                  className={cn(
                    "text-xs truncate",
                    c.unreadCount > 0
                      ? "text-foreground font-medium"
                      : "text-muted-foreground",
                  )}
                >
                  {c.lastMessage || "No messages yet"}
                </p>

                {c.unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex-shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center text-xs font-bold text-primary-foreground bg-primary rounded-full"
                  >
                    {c.unreadCount}
                  </motion.span>
                )}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
