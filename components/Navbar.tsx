import Link from "next/link";
import { cn } from "@/lib/utils";
import { Navbar as ShadNavbar } from "@/components/ui/navbar";

export function Navbar({ className }: { className?: string }) {
  return (
    <ShadNavbar className={cn("flex items-center justify-between py-4 px-6", className)}>
      <Link href="/" className="font-bold text-xl">
        AOOS
      </Link>
      <div className="flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/upload">Upload</Link>
        <Link href="/results">Results</Link>
      </div>
    </ShadNavbar>
  );
}
