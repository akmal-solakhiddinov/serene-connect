import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Settings, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from './Avatar';
import { ConversationItem } from './ConversationItem';
import { conversations, currentUser } from '@/data/mockData';
import type { Conversation } from '@/data/mockData';

interface SidebarProps {
  activeConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  className?: string;
}

export const Sidebar = ({ activeConversation, onSelectConversation, className }: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn(
      'flex flex-col h-full bg-card border-r border-border',
      className
    )}>
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border glass">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar src={currentUser.avatar} alt={currentUser.name} size="md" online={true} />
            <div>
              <h1 className="font-bold text-foreground">Messages</h1>
              <p className="text-xs text-muted-foreground">12 conversations</p>
            </div>
          </div>
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
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
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
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border-0 rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
        <div className="space-y-1">
          {filteredConversations.map((conversation, index) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};
