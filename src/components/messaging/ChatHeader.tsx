import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Video, MoreVertical } from 'lucide-react';
import { Avatar } from './Avatar';
import type { User } from '@/data/mockData';

interface ChatHeaderProps {
  user: User;
  onBack: () => void;
}

export const ChatHeader = ({ user, onBack }: ChatHeaderProps) => {
  return (
    <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-border glass">
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="md:hidden p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>

        <Avatar src={user.avatar} alt={user.name} size="md" online={user.online} />

        <div>
          <h2 className="font-semibold text-foreground">{user.name}</h2>
          <p className="text-xs text-muted-foreground">
            {user.online ? (
              <span className="text-online font-medium">Online</span>
            ) : (
              `Last seen ${user.lastSeen || 'recently'}`
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 rounded-xl hover:bg-secondary transition-colors"
        >
          <Phone className="w-5 h-5 text-muted-foreground" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 rounded-xl hover:bg-secondary transition-colors"
        >
          <Video className="w-5 h-5 text-muted-foreground" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 rounded-xl hover:bg-secondary transition-colors"
        >
          <MoreVertical className="w-5 h-5 text-muted-foreground" />
        </motion.button>
      </div>
    </div>
  );
};
