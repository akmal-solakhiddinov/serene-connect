import { motion } from "framer-motion";
import { Info } from "lucide-react";

export function FeatureFlagsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mx-3 mt-3 p-3 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
    >
      <div className="flex items-start gap-2">
        <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <div className="text-xs">
          <p className="font-medium text-foreground mb-1">Feature Flags Demo</p>
          <p className="text-muted-foreground">
            Try clicking <span className="text-primary">Edit</span> or{" "}
            <span className="text-primary">Delete</span> on messages, or the{" "}
            <span className="text-primary">attachment</span> button to see cute
            "not ready" messages!
          </p>
        </div>
      </div>
    </motion.div>
  );
}
