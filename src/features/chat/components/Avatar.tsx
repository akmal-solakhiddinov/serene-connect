import { cn } from "@/lib/utils";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const GRADIENT_COLORS = [
  "from-primary to-accent",
  "from-pink-500 to-rose-500",
  "from-violet-500 to-purple-500",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
] as const;

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "w-10 h-10 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-24 h-24 text-xl",
} as const;

export function Avatar({ name, size = "md", className }: AvatarProps) {
  const colorIndex = name.charCodeAt(0) % GRADIENT_COLORS.length;

  return (
    <div
      className={cn(
        SIZE_CLASSES[size],
        "rounded-full bg-gradient-to-br flex items-center justify-center font-semibold text-white shadow-md flex-shrink-0",
        GRADIENT_COLORS[colorIndex],
        className,
      )}
    >
      {getInitials(name)}
    </div>
  );
}
