import { motion } from 'framer-motion';
import { Search, LogOut, Edit, Loader2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from './Avatar';
import { ConversationItem } from './ConversationItem';
import { UserSearchResult } from './UserSearchResult';
import { currentUser, type Conversation, type User } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useUserSearch } from '@/hooks/useUserSearch';
import { useConversations } from '@/hooks/useConversations';

interface SidebarProps {
  activeConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onStartNewConversation?: (user: User) => void;
  onOpenProfile?: () => void;
  className?: string;
}

export const Sidebar = ({ 
  activeConversation, 
  onSelectConversation, 
  onStartNewConversation,
  onOpenProfile, 
  className 
}: SidebarProps) => {
  const { logout } = useAuth();
  const { query, setQuery, results, isLoading: isSearchLoading } = useUserSearch();
  const { conversations, isLoading: isConversationsLoading } = useConversations();

  const handleSelectUser = (user: User, conversation?: Conversation) => {
    if (conversation) {
      onSelectConversation(conversation);
    } else if (onStartNewConversation) {
      onStartNewConversation(user);
    }
    setQuery(''); // Clear search after selection
  };

  const isSearching = query.trim().length > 0;

  return (
    <div className={cn(
      'flex flex-col h-full bg-card border-r border-border',
      className
    )}>
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border glass">
        <div className="flex items-center justify-between mb-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenProfile}
            className="flex items-center gap-3 p-1 -m-1 rounded-xl hover:bg-secondary/50 transition-colors"
          >
            <Avatar src={currentUser.avatar} alt={currentUser.name} size="md" online={true} />
            <div className="text-left">
              <h1 className="font-bold text-foreground">Messages</h1>
              <p className="text-xs text-muted-foreground">{conversations.length} conversations</p>
            </div>
          </motion.button>
          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <Edit className="w-5 h-5 text-muted-foreground" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-5 h-5 text-muted-foreground hover:text-destructive" />
            </motion.button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          {isSearchLoading ? (
            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
          ) : (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          )}
          <input
            type="text"
            placeholder="Search users to connect..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border-0 rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
        {/* Search Results */}
        {isSearching && (
          <>
            {isSearchLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            )}

            {!isSearchLoading && results.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="w-8 h-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No users found</p>
                <p className="text-xs text-muted-foreground/70">Try searching for a different name</p>
              </div>
            )}

            {!isSearchLoading && results.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                  Found {results.length} user{results.length !== 1 ? 's' : ''}
                </p>
                {results.map((result, index) => (
                  <motion.div
                    key={result.user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <UserSearchResult
                      user={result.user}
                      conversation={result.conversation}
                      hasExistingConversation={result.hasExistingConversation}
                      onSelectUser={handleSelectUser}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Conversation List (when not searching) */}
        {!isSearching && (
          <div className="space-y-1">
            {isConversationsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="w-8 h-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No conversations yet</p>
                <p className="text-xs text-muted-foreground/70">Search for users to start chatting</p>
              </div>
            ) : (
              conversations.map((conversation, index) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ConversationItem
                    conversation={conversation}
                    isActive={activeConversation?.id === conversation.id}
                    onClick={() => onSelectConversation(conversation)}
                  />
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
