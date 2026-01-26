import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Mail, Phone, MapPin, Link as LinkIcon, Calendar, MessageCircle, Image, FileText, Music, Loader2 } from 'lucide-react';
import { Avatar } from '@/features/chat/components/Avatar';
import { FeatureNotReady } from '@/components/ui/FeatureNotReady';
import { useUserProfile } from '@/hooks/useUserProfile';
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
  const { profile, isLoading } = useUserProfile();
  const [showFeatureToast, setShowFeatureToast] = useState(false);

  const handleFeatureNotReady = () => {
    setShowFeatureToast(true);
    setTimeout(() => setShowFeatureToast(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-background">
        <p className="text-muted-foreground">Failed to load profile</p>
        <button onClick={onBack} className="mt-4 text-primary hover:underline">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
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
            <Avatar name={profile.name} size="xl" />
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
          <h1 className="text-2xl font-bold text-foreground mb-1">{profile.name}</h1>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <span className={cn(
              "w-2 h-2 rounded-full",
              profile.online ? "bg-online" : "bg-muted-foreground"
            )} />
            {profile.online ? 'Online' : `Last seen ${profile.lastSeen || 'recently'}`}
          </p>
        </motion.div>

        {/* Bio */}
        {profile.bio && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-center mb-6 px-4"
          >
            <p className="text-muted-foreground text-sm leading-relaxed">
              {profile.bio}
            </p>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-8 mb-8"
        >
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{profile.stats.messagesCount.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Messages</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{profile.stats.mediaCount.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Media</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{profile.stats.linksCount.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Links</p>
          </div>
        </motion.div>

        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-2xl p-4 mb-4 shadow-soft"
        >
          <h3 className="text-sm font-semibold text-foreground mb-3">Contact Information</h3>
          <div className="space-y-3">
            {profile.email && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-secondary">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <span className="text-muted-foreground">{profile.email}</span>
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-secondary">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <span className="text-muted-foreground">{profile.phone}</span>
              </div>
            )}
            {profile.location && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-secondary">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span className="text-muted-foreground">{profile.location}</span>
              </div>
            )}
            {profile.joinedAt && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-secondary">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <span className="text-muted-foreground">Joined {profile.joinedAt}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Shared Media */}
        {profile.sharedMedia.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl p-4 mb-4 shadow-soft"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Image className="w-4 h-4 text-primary" />
                Shared Media
              </h3>
              <button className="text-xs text-primary hover:underline">See all</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {profile.sharedMedia.slice(0, 6).map((media) => (
                <motion.div
                  key={media.id}
                  whileHover={{ scale: 1.05 }}
                  className="aspect-square rounded-xl bg-secondary overflow-hidden cursor-pointer"
                >
                  {media.thumbnailUrl || media.url ? (
                    <img 
                      src={media.thumbnailUrl || media.url} 
                      alt="Shared media" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent Links */}
        {profile.recentLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-card rounded-2xl p-4 shadow-soft"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-primary" />
                Recent Links
              </h3>
              <button className="text-xs text-primary hover:underline">See all</button>
            </div>
            <div className="space-y-2">
              {profile.recentLinks.map((link) => {
                const IconComponent = getLinkIcon(link.type);
                return (
                  <motion.a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/50 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-secondary">
                      <IconComponent className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{link.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Action button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold shadow-glow flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Send Message
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};
