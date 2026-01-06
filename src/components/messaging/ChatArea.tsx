import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import type { Conversation, Message } from '@/data/mockData';

interface ChatAreaProps {
  conversation: Conversation | null;
  onBack: () => void;
}

export const ChatArea = ({ conversation, onBack }: ChatAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (conversation) {
      setMessages(conversation.messages);
    }
  }, [conversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: 'current',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };
    setMessages(prev => [...prev, newMessage]);

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev =>
        prev.map(m => m.id === newMessage.id ? { ...m, status: 'delivered' } : m)
      );
    }, 1000);

    setTimeout(() => {
      setMessages(prev =>
        prev.map(m => m.id === newMessage.id ? { ...m, status: 'read' } : m)
      );
    }, 2500);
  };

  if (!conversation) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center h-full bg-gradient-to-br from-background to-secondary/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
            <MessageCircle className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Welcome to Messages</h2>
          <p className="text-muted-foreground text-sm max-w-xs">
            Select a conversation from the sidebar to start chatting
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={conversation.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col h-full bg-background"
      >
        <ChatHeader user={conversation.user} onBack={onBack} />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3 bg-gradient-to-b from-secondary/20 to-background">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === 'current'}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <MessageInput onSend={handleSendMessage} />
      </motion.div>
    </AnimatePresence>
  );
};
