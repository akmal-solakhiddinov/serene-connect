import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Mail, Phone, MapPin, Link as LinkIcon, Calendar, MessageCircle, Image, FileText, Music } from 'lucide-react';
import { Avatar } from './Avatar';
import { currentUser } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface ProfilePageProps {
  onBack: () => void;
}

const stats = [
  { label: 'Messages', value: '2.4k' },
  { label: 'Media', value: '156' },
  { label: 'Links', value: '42' },
];

const sharedMedia = [
  { type: 'image', color: 'from-primary/20 to-accent/20' },
  { type: 'image', color: 'from-accent/20 to-primary/20' },
  { type: 'image', color: 'from-primary/30 to-secondary' },
  { type: 'image', color: 'from-secondary to-accent/20' },
  { type: 'image', color: 'from-accent/30 to-primary/20' },
  { type: 'image', color: 'from-primary/20 to-accent/30' },
];

const recentLinks = [
  { title: 'Design System Guide', url: 'figma.com/design-system', icon: FileText },
  { title: 'Project Playlist', url: 'spotify.com/playlist', icon: Music },
  { title: 'Portfolio Website', url: 'portfolio.design', icon: LinkIcon },
];

export const ProfilePage = ({ onBack }: ProfilePageProps) => {
  return (
    <div className="h-full flex flex-col bg-background">
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
          className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm shadow-soft"
        >
          <Camera className="w-5 h-5 text-foreground" />
        </motion.button>

        {/* Avatar */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
          <div className="relative">
            <Avatar src={currentUser.avatar} alt={currentUser.name} size="xl" online={true} />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
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
          <h1 className="text-2xl font-bold text-foreground mb-1">{currentUser.name}</h1>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Online
          </p>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-center mb-6 px-4"
        >
          <p className="text-muted-foreground text-sm leading-relaxed">
            Product designer & creative enthusiast. Building beautiful experiences one pixel at a time. ✨
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-8 mb-8"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
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
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 rounded-lg bg-secondary">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <span className="text-muted-foreground">alex@example.com</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 rounded-lg bg-secondary">
                <Phone className="w-4 h-4 text-primary" />
              </div>
              <span className="text-muted-foreground">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 rounded-lg bg-secondary">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <span className="text-muted-foreground">San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 rounded-lg bg-secondary">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <span className="text-muted-foreground">Joined March 2023</span>
            </div>
          </div>
        </motion.div>

        {/* Shared Media */}
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
            {sharedMedia.map((media, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className={cn(
                  'aspect-square rounded-xl bg-gradient-to-br cursor-pointer',
                  media.color
                )}
              />
            ))}
          </div>
        </motion.div>

        {/* Recent Links */}
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
            {recentLinks.map((link, index) => (
              <motion.a
                key={index}
                href="#"
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/50 transition-colors"
              >
                <div className="p-2 rounded-lg bg-secondary">
                  <link.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{link.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

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
