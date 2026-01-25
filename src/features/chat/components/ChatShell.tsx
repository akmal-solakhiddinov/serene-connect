import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  LogOut, 
  MessageCircle, 
  Settings, 
  Sparkles,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FeatureNotReady } from "@/components/ui/FeatureNotReady";
import { cn } from "@/lib/utils";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { useAuth } from "@/features/auth/AuthProvider";
import { useConversations } from "@/features/chat/hooks/useConversations";
import type { ConversationItemDTO } from "@/types/dtos";
import { ChatView } from "@/features/chat/components/ChatView";

function displayName(c: ConversationItemDTO) {
  console.log(Object.entries(c), "log conv");

  return c.user.fullName || c.user.username || c.user.email;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-10 h-10 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-14 h-14 text-base",
  };
  
  // Generate consistent color from name
  const colors = [
    "from-primary to-accent",
    "from-pink-500 to-rose-500",
    "from-violet-500 to-purple-500",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-amber-500",
  ];
  const colorIndex = name.charCodeAt(0) % colors.length;
  
  return (
    <div className={cn(
      sizeClasses[size],
      "rounded-full bg-gradient-to-br flex items-center justify-center font-semibold text-white shadow-md flex-shrink-0",
      colors[colorIndex]
    )}>
      {getInitials(name)}
    </div>
  );
}

export function ChatShell() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { user: me, logout } = useAuth();
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
      displayName(c).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  const listRef = useRef<HTMLDivElement>(null);

  const handleFeatureDemo = () => {
    setShowFeatureDemo(true);
    setTimeout(() => setShowFeatureDemo(false), 3000);
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
<<<<<<< HEAD
          {/* Header */}
          <div className="flex-shrink-0 p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                <Avatar name={me?.fullName || me?.username || me?.email || "User"} size="md" />
                <div className="min-w-0">
                  <h1 className="font-bold text-foreground truncate">
                    {me?.fullName || me?.username || "Messages"}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </motion.div>
              
              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFeatureDemo}
                  className="p-2 rounded-xl hover:bg-secondary transition-colors"
                  title="Feature Demo"
                >
                  <Sparkles className="w-5 h-5 text-muted-foreground" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFeatureDemo()}
                  className="p-2 rounded-xl hover:bg-secondary transition-colors"
                  title="Settings (Coming Soon)"
                >
                  <Settings className="w-5 h-5 text-muted-foreground" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => logout()}
                  className="p-2 rounded-xl hover:bg-destructive/10 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5 text-muted-foreground hover:text-destructive" />
                </motion.button>
              </div>
=======
          <div className="h-14 px-3 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {me?.fullName || me?.username || me?.email}
              </p>
              <p className="text-xs text-muted-foreground">Messages</p>
>>>>>>> c8e841f (sa)
            </div>

<<<<<<< HEAD
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border-0 rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Feature Flags Info Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-3 mt-3 p-3 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
          >
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-medium text-foreground mb-1">Feature Flags Demo</p>
                <p className="text-muted-foreground">
                  Try clicking <span className="text-primary">Edit</span> or <span className="text-primary">Delete</span> on messages, 
                  or the <span className="text-primary">attachment</span> button to see cute "not ready" messages!
                </p>
              </div>
            </div>
          </motion.div>

          {/* Conversation List */}
          <div ref={listRef} className="flex-1 overflow-y-auto scrollbar-thin p-2">
            {isLoading ? (
              <div className="space-y-2 px-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="h-16 rounded-xl bg-secondary/50 animate-pulse" 
=======
          <div className="p-3">
            <Input
              placeholder="Search (not implemented: no endpoint)"
              disabled
            />
          </div>

          <div
            ref={listRef}
            className="h-[calc(100%-112px)] overflow-y-auto scrollbar-thin px-2 pb-3"
          >
            {isLoading ? (
              <div className="space-y-2 px-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-14 rounded-xl bg-secondary animate-pulse"
>>>>>>> c8e841f (sa)
                  />
                ))}
              </div>
            ) : isError ? (
<<<<<<< HEAD
              <div className="px-3 py-8 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-destructive/10 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-destructive" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">Failed to load conversations</p>
                <Button variant="secondary" size="sm" onClick={() => refetch()}>
                  Try Again
                </Button>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="px-3 py-8 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-secondary flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "No matching conversations" : "No conversations yet"}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  {searchQuery ? "Try a different search" : "Start a new conversation!"}
=======
              <div className="px-2 py-6">
                <p className="text-sm text-muted-foreground">
                  Failed to load conversations.
                </p>
                <Button
                  className="mt-3"
                  variant="secondary"
                  onClick={() => refetch()}
                >
                  Retry
                </Button>
              </div>
            ) : conversations.length === 0 ? (
              <div className="px-2 py-6">
                <p className="text-sm text-muted-foreground">
                  No conversations yet.
>>>>>>> c8e841f (sa)
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredConversations.map((c, index) => {
                  const isActive = c.id === conversationId;
<<<<<<< HEAD
                  const name = displayName(c);
=======
                  console.log(c);

>>>>>>> c8e841f (sa)
                  return (
                    <motion.button
                      key={c.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        navigate(`/chat/${c.id}`);
                        setMobileOpenChat(true);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
                        "hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-primary/20",
                        isActive && "bg-secondary shadow-sm"
                      )}
                    >
<<<<<<< HEAD
                      <Avatar name={name} size="sm" />
                      
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between gap-2">
                          <span className={cn(
                            "font-semibold text-foreground truncate text-sm",
                            c.unreadCount > 0 && "text-foreground"
                          )}>
                            {name}
                          </span>
                          <span className={cn(
                            "text-[10px] flex-shrink-0",
                            c.unreadCount > 0 ? "text-primary font-medium" : "text-muted-foreground"
                          )}>
                            {new Date(c.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between gap-2 mt-0.5">
                          <p className={cn(
                            "text-xs truncate",
                            c.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"
                          )}>
                            {c.lastMessage?.content || c.lastMessage?.attachmentType || "No messages yet"}
                          </p>
                          
                          {c.unreadCount > 0 && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex-shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center text-xs font-bold text-primary-foreground bg-primary rounded-full"
                            >
=======
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {displayName(c)}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {c.lastMessage?.content ||
                              (c.lastMessage?.attachmentType
                                ? c.lastMessage.attachmentType
                                : "") ||
                              ""}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(c.updatedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {c.unreadCount > 0 ? (
                            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
>>>>>>> c8e841f (sa)
                              {c.unreadCount}
                            </motion.span>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* Chat */}
        <main
          className={cn("flex-1 h-full", !mobileOpenChat && "hidden md:block")}
        >
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
