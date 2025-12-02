import * as React from "react";
import { cn } from "@/lib/utils";
export interface DialogProps extends React.PropsWithChildren<{ open: boolean; onOpenChange: (v: boolean) => void; }> {}
export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => onOpenChange(false)}>
      {children}
    </div>
  );
}
export function DialogContent({ className, onClick, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn("bg-white rounded-lg p-8 shadow-xl", className)} 
      onClick={(e) => e.stopPropagation()}
      {...props} 
    />
  );
}
export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4", className)} {...props} />;
}
export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-xl font-bold", className)} {...props} />;
}
export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-gray-600", className)} {...props} />;
}
