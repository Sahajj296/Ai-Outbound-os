import * as React from "react";
import { cn } from "@/lib/utils";
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn("border border-slate-300 rounded px-4 py-2 w-full focus:outline-none focus:ring focus:ring-slate-200", className)}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
