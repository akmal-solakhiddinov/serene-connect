import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Paperclip, Send, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSend: (message: string) => void;
}

export const MessageInput = ({ onSend }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-shrink-0 p-3 border-t border-border bg-card/80 backdrop-blur-sm">
      <div className={cn(
        'flex items-end gap-2 p-2 rounded-2xl bg-secondary/50 transition-all duration-200',
        isFocused && 'ring-2 ring-primary/20 bg-secondary/70'
      )}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-xl hover:bg-background/50 transition-colors"
        >
          <Smile className="w-5 h-5 text-muted-foreground" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-xl hover:bg-background/50 transition-colors"
        >
          <Paperclip className="w-5 h-5 text-muted-foreground" />
        </motion.button>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 bg-transparent border-0 resize-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none py-2 px-1 max-h-32"
          style={{ minHeight: '40px' }}
        />

        <AnimatePresence mode="wait">
          {message.trim() ? (
            <motion.button
              key="send"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              className="p-2.5 rounded-xl gradient-primary shadow-glow transition-all"
            >
              <Send className="w-5 h-5 text-primary-foreground" />
            </motion.button>
          ) : (
            <motion.button
              key="mic"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-xl hover:bg-background/50 transition-colors"
            >
              <Mic className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
