import * as React from "react";
import { cn } from "@/lib/utils";
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "lg" | "default";
}
export function Button({ className, variant = "primary", size = "default", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center font-medium rounded transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const styles = {
    primary: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "bg-transparent border border-slate-300 text-slate-900 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-900 hover:bg-slate-100 shadow-none",
  };
  const sizes = {
    lg: "px-8 py-4 text-lg",
    default: "px-4 py-2 text-base"
  };
  return <button className={cn(base, styles[variant], sizes[size], className)} {...props} />;
}
