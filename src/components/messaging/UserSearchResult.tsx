import { motion } from 'framer-motion';
import { MessageCircle, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from './Avatar';
import type { User, Conversation } from '@/types';

interface UserSearchResultProps {
  user: User;
  conversation?: Conversation;
  hasExistingConversation: boolean;
  onSelectUser: (user: User, conversation?: Conversation) => void;
}

export const UserSearchResult = ({ 
  user, 
  conversation, 
  hasExistingConversation, 
  onSelectUser 
}: UserSearchResultProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onSelectUser(user, conversation)}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-xl transition-all',
        'hover:bg-secondary/80 active:bg-secondary',
        'text-left group'
      )}
    >
      <Avatar 
        src={user.avatar} 
        alt={user.name} 
        size="md" 
        online={user.online} 
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground truncate">{user.name}</span>
          {user.online && (
            <span className="text-xs text-green-500">Online</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {hasExistingConversation 
            ? 'Continue conversation' 
            : 'Start a new conversation'
          }
        </p>
      </div>

      <div className="flex-shrink-0">
        {hasExistingConversation ? (
          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <MessageCircle className="w-4 h-4" />
          </div>
        ) : (
          <div className="p-2 rounded-lg bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <UserPlus className="w-4 h-4" />
          </div>
        )}
      </div>
    </motion.button>
  );
};
