import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

type ToastVariant = "default" | "destructive";

type ToastEventDetail = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

export function ToastEventsListener() {
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ToastEventDetail>).detail;
      if (!detail?.title) return;
      toast({
        title: detail.title,
        description: detail.description,
        variant: detail.variant ?? "destructive",
      });
    };
    window.addEventListener("app:toast", handler);
    return () => window.removeEventListener("app:toast", handler);
  }, []);

  return null;
}
