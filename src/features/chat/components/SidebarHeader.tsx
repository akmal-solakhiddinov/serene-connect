import { motion } from "framer-motion";
import { Search, LogOut, Settings, User } from "lucide-react";
import { Avatar } from "./Avatar";
import { useAuth } from "@/features/auth/AuthProvider";

interface SidebarHeaderProps {
  conversationCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFeatureDemo: () => void;
  onOpenProfile: () => void;
}

export function SidebarHeader({
  conversationCount,
  searchQuery,
  onSearchChange,
  onFeatureDemo,
  onOpenProfile,
}: SidebarHeaderProps) {
  const { user: me, logout } = useAuth();
  const displayName = me?.fullName || me?.username || me?.email || "User";

  return (
    <div className="flex-shrink-0 p-4 border-b border-border">
      <div className="flex items-center justify-between mb-4">
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenProfile}
          className="flex items-center gap-3 text-left hover:bg-secondary/50 rounded-xl p-2 -ml-2 transition-colors"
        >
          <Avatar name={displayName} size="md" />
          <div className="min-w-0">
            <h1 className="font-bold text-foreground truncate">
              {me?.fullName || me?.username || "Messages"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {conversationCount} conversation
              {conversationCount !== 1 ? "s" : ""}
            </p>
          </div>
        </motion.button>

        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenProfile}
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
            title="My Profile"
          >
            <User className="w-5 h-5 text-muted-foreground" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onFeatureDemo}
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
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border-0 rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>
    </div>
  );
}
