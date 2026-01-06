import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { ChatArea } from './ChatArea';
import type { Conversation } from '@/data/mockData';
import { cn } from '@/lib/utils';

export const MessagingApp = () => {
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [showChat, setShowChat] = useState(false);

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    setShowChat(true);
  };

  const handleBack = () => {
    setShowChat(false);
    setTimeout(() => setActiveConversation(null), 300);
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-background">
      <div className="flex h-full w-full">
        {/* Sidebar - Always visible on desktop, conditional on mobile */}
        <div className={cn(
          'h-full transition-all duration-300 ease-out',
          // Mobile: full width when visible, hidden when chat is shown
          'w-full md:w-80 lg:w-96',
          showChat && 'hidden md:block'
        )}>
          <Sidebar
            activeConversation={activeConversation}
            onSelectConversation={handleSelectConversation}
          />
        </div>

        {/* Chat Area - Mobile slide-in, desktop always visible */}
        <div className={cn(
          'h-full flex-1 transition-all duration-300 ease-out',
          // Mobile: full width when visible
          'w-full md:w-auto',
          !showChat && 'hidden md:block'
        )}>
          <AnimatePresence mode="wait">
            {(showChat || !showChat) && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <ChatArea
                  conversation={activeConversation}
                  onBack={handleBack}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
