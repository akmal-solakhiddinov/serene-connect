import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar } from './Avatar';
import type { Conversation } from '@/data/mockData';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export const ConversationItem = ({ conversation, isActive, onClick }: ConversationItemProps) => {
  const { user, lastMessage, lastMessageTime, unreadCount } = conversation;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200',
        'hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-primary/20',
        isActive && 'bg-secondary shadow-sm'
      )}
    >
      <Avatar src={user.avatar} alt={user.name} online={user.online} />
      
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between gap-2">
          <span className={cn(
            'font-semibold text-foreground truncate',
            unreadCount > 0 && 'text-foreground'
          )}>
            {user.name}
          </span>
          <span className={cn(
            'text-xs flex-shrink-0',
            unreadCount > 0 ? 'text-primary font-medium' : 'text-muted-foreground'
          )}>
            {lastMessageTime}
          </span>
        </div>
        
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className={cn(
            'text-sm truncate',
            unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'
          )}>
            {lastMessage}
          </p>
          
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex-shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center text-xs font-bold text-primary-foreground bg-primary rounded-full"
            >
              {unreadCount}
            </motion.span>
          )}
        </div>
      </div>
    </motion.button>
  );
};
