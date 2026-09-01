import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-surface p-5 shadow-soft transition-shadow",
        className,
      )}
      {...props}
    />
  );
}

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-primary",
        className,
      )}
      {...props}
    />
  );
}
