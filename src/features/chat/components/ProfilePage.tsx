import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Mail, Phone, MapPin, Link as LinkIcon, Calendar, Edit2, Image, FileText, Music, Loader2 } from 'lucide-react';
import { Avatar } from '@/features/chat/components/Avatar';
import { FeatureNotReady } from '@/components/ui/FeatureNotReady';
import { useAuth } from '@/features/auth/AuthProvider';
import { isFeatureEnabled } from '@/lib/featureFlags';
import { cn } from '@/lib/utils';
import type { RecentLink } from '@/types';

interface ProfilePageProps {
  onBack: () => void;
}

const getLinkIcon = (type: RecentLink['type']) => {
  switch (type) {
    case 'document':
      return FileText;
    case 'music':
      return Music;
    default:
      return LinkIcon;
  }
};

export const ProfilePage = ({ onBack }: ProfilePageProps) => {
  const { user, isLoading } = useAuth();
  const [showFeatureToast, setShowFeatureToast] = useState(false);

  const handleFeatureNotReady = () => {
    setShowFeatureToast(true);
    setTimeout(() => setShowFeatureToast(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="h-screen-safe flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen-safe flex flex-col items-center justify-center bg-background">
        <p className="text-muted-foreground">Failed to load profile</p>
        <button onClick={onBack} className="mt-4 text-primary hover:underline">
          Go back
        </button>
      </div>
    );
  }

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
        <div className="h-32 bg-gradient-to-br from-primary/30 via-accent/20 to-primary/10" />
        
        {/* Back button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="absolute top-4 left-4 p-2 rounded-full bg-background/80 backdrop-blur-sm shadow-soft"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>

        {/* Edit cover button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (!isFeatureEnabled("editProfile")) {
              handleFeatureNotReady();
              return;
            }
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm shadow-soft"
        >
          <Camera className="w-5 h-5 text-foreground" />
        </motion.button>

        {/* Avatar */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
          <div className="relative">
            <Avatar name={displayName} size="xl" />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (!isFeatureEnabled("editProfile")) {
                  handleFeatureNotReady();
                  return;
                }
              }}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground shadow-glow"
            >
              <Camera className="w-4 h-4" />
            </motion.button>
          </div>
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

        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-4 mb-4 shadow-soft"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Account Information</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFeatureNotReady}
              className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
            >
              <Edit2 className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          </div>
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
                  <Calendar className="w-4 h-4 text-primary" />
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
                  <LinkIcon className="w-4 h-4 text-primary" />
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
          <h3 className="text-sm font-semibold text-foreground mb-3">Account Status</h3>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-3 h-3 rounded-full",
              user.isActive ? "bg-online" : "bg-muted-foreground"
            )} />
            <span className="text-sm text-foreground">
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFeatureNotReady}
            className="w-full py-3 rounded-2xl bg-secondary text-foreground font-medium flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors"
          >
            <Edit2 className="w-5 h-5" />
            Edit Profile
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};
