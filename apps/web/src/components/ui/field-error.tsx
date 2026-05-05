import { cn } from "@/lib/utils";

interface FieldErrorProps {
  message?: string;
  className?: string;
}

export function FieldError({ message, className }: FieldErrorProps) {
  if (!message) return null;
  
  return (
    <span className={cn("text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1 duration-200", className)}>
      {message}
    </span>
  );
}
