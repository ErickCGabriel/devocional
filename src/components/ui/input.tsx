import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-border/80 bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted transition-shadow focus:outline-none focus:ring-2 focus:ring-accent/40",
        className,
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-border/80 bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted transition-shadow focus:outline-none focus:ring-2 focus:ring-accent/40 resize-y",
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-border/80 bg-surface px-3.5 py-2.5 text-sm text-foreground transition-shadow focus:outline-none focus:ring-2 focus:ring-accent/40",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = "Select";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-sm font-medium text-foreground/90", className)}
      {...props}
    />
  );
}
