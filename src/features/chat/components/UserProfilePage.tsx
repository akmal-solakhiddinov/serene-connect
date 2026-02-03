import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, MessageCircle, Calendar, User as UserIcon } from 'lucide-react';
import { Avatar } from '@/features/chat/components/Avatar';
import { FeatureNotReady } from '@/components/ui/FeatureNotReady';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { UserDTO } from '@/types/dtos';

interface UserProfilePageProps {
  user: UserDTO;
  onBack: () => void;
  onStartChat?: () => void;
}

export const UserProfilePage = ({ user, onBack, onStartChat }: UserProfilePageProps) => {
  const [showFeatureToast, setShowFeatureToast] = useState(false);

  const handleFeatureNotReady = () => {
    setShowFeatureToast(true);
    setTimeout(() => setShowFeatureToast(false), 3000);
  };

  const displayName = user.fullName || user.username || user.email || 'User';
  const isOnline = user.isActive;

  return (
    <div className="h-screen-safe flex flex-col bg-background">
      {/* Feature not ready toast */}
      <AnimatePresence>
        {showFeatureToast && <FeatureNotReady variant="toast" />}
      </AnimatePresence>

      {/* Header with gradient background */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-br from-accent/30 via-primary/20 to-accent/10" />
        
        {/* Back button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="absolute top-4 left-4 p-2 rounded-full bg-background/80 backdrop-blur-sm shadow-soft"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>

        {/* Avatar */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
          <Avatar name={displayName} size="xl" />
        </div>
      </div>

      {/* Profile content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin pt-16 pb-8 px-4">
        {/* Name and status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground mb-1">{displayName}</h1>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <span className={cn(
              "w-2 h-2 rounded-full",
              isOnline ? "bg-online" : "bg-muted-foreground"
            )} />
            {isOnline ? 'Online' : 'Offline'}
          </p>
          {user.username && (
            <p className="text-sm text-muted-foreground mt-1">@{user.username}</p>
          )}
        </motion.div>

        {/* User info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-4 mb-4 shadow-soft"
        >
          <h3 className="text-sm font-semibold text-foreground mb-3">User Information</h3>
          <div className="space-y-3">
            {user.email && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-secondary">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <span className="text-foreground truncate block">{user.email}</span>
                </div>
              </div>
            )}
            {user.fullName && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-secondary">
                  <UserIcon className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  <span className="text-foreground truncate block">{user.fullName}</span>
                </div>
              </div>
            )}
            {user.username && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-secondary">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Username</p>
                  <span className="text-foreground truncate block">@{user.username}</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Account Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-2xl p-4 mb-4 shadow-soft"
        >
          <h3 className="text-sm font-semibold text-foreground mb-3">Status</h3>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-3 h-3 rounded-full",
              user.isActive ? "bg-online" : "bg-muted-foreground"
            )} />
            <span className="text-sm text-foreground">
              {user.isActive ? 'Currently Active' : 'Currently Offline'}
            </span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {onStartChat && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStartChat}
              className="w-full py-3 rounded-2xl gradient-primary text-primary-foreground font-medium flex items-center justify-center gap-2 shadow-glow"
            >
              <MessageCircle className="w-5 h-5" />
              Send Message
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFeatureNotReady}
            className="w-full py-3 rounded-2xl bg-secondary text-foreground font-medium flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors"
          >
            Block User
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};
