import * as React from "react";
import { cn } from "@/lib/utils";
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn("border border-slate-300 rounded px-4 py-2 w-full focus:outline-none focus:ring focus:ring-slate-200", className)}
      {...props}
    />
  )
);
Input.displayName = "Input";
