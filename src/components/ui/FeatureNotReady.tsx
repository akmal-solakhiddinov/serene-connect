import { motion } from "framer-motion";
import { Construction, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureNotReadyProps {
  featureName?: string;
  className?: string;
  variant?: "inline" | "toast" | "card";
}

const cuteMessages = [
  "Oops! This sparkly feature is still being polished ✨",
  "Hold tight! Our coding elves are working on this 🧝‍♂️",
  "Coming soon! We're adding extra magic to this feature 🪄",
  "This feature is taking a little nap 😴 Check back soon!",
  "We're brewing something special here! ☕",
  "Almost there! Just a few more sprinkles of code 🌈",
];

function getRandomMessage() {
  return cuteMessages[Math.floor(Math.random() * cuteMessages.length)];
}

export function FeatureNotReady({ 
  featureName, 
  className,
  variant = "inline" 
}: FeatureNotReadyProps) {
  const message = getRandomMessage();

  if (variant === "inline") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/80 text-sm text-muted-foreground",
          className
        )}
      >
        <Construction className="h-4 w-4 text-warning flex-shrink-0" />
        <span>{message}</span>
      </motion.div>
    );
  }

  if (variant === "toast") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          "fixed bottom-20 left-1/2 -translate-x-1/2 z-50",
          "flex items-center gap-2 px-4 py-3 rounded-2xl",
          "bg-card border border-border shadow-lg backdrop-blur-sm",
          "text-sm text-foreground",
          className
        )}
      >
        <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
        <span>{message}</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-8 text-center",
        "bg-card rounded-2xl border border-border shadow-soft",
        className
      )}
    >
      <motion.div
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20"
      >
        <Construction className="h-8 w-8 text-primary" />
      </motion.div>
      
      {featureName && (
        <h3 className="text-lg font-semibold text-foreground">{featureName}</h3>
      )}
      
      <p className="text-muted-foreground text-sm max-w-xs">{message}</p>
      
      <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
        <Sparkles className="h-3 w-3" />
        <span>Coming soon</span>
        <Sparkles className="h-3 w-3" />
      </div>
    </motion.div>
  );
}

// Hook to show feature not ready toast
import { useState, useCallback } from "react";

export function useFeatureNotReady() {
  const [showToast, setShowToast] = useState(false);

  const triggerNotReady = useCallback(() => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, []);

  return { showToast, triggerNotReady, ToastComponent: showToast ? FeatureNotReady : null };
}
