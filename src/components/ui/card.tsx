import * as React from "react";
import { cn } from "@/lib/utils";
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
export function Card({ className, ...props }: CardProps) {
  return <div className={cn("bg-white rounded-xl shadow border p-4", className)} {...props} />;
}
export function CardHeader({ className, ...props }: CardProps) {
  return <div className={cn("mb-4", className)} {...props} />;
}
export function CardTitle({ className, ...props }: CardProps) {
  return <h2 className={cn("text-xl font-bold", className)} {...props} />;
}
export function CardDescription({ className, ...props }: CardProps) {
  return <p className={cn("text-gray-500", className)} {...props} />;
}
export function CardContent({ className, ...props }: CardProps) {
  return <div className={cn("", className)} {...props} />;
}
