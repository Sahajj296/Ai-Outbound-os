"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/upload", label: "Upload" },
  { href: "/results", label: "Results" },
];
export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isBrowser = typeof window !== "undefined";
  function handleNavigateToUpload(e: React.MouseEvent<HTMLButtonElement>) { if (e) e.preventDefault(); if (!isBrowser) return; router.push("/upload"); }
  function handleNavigateToResults(e: React.MouseEvent<HTMLButtonElement>) { if (e) e.preventDefault(); if (!isBrowser) return; router.push("/results"); }
  return (
    <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-semibold tracking-tight text-slate-900">AOOS</Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-slate-900",
                pathname === link.href ? "text-slate-900" : ""
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button type="button" onClick={handleNavigateToUpload} className="border rounded px-3 py-2 font-medium text-slate-700 hover:bg-slate-100">Upload Leads</button>
          <button type="button" onClick={handleNavigateToResults} className="text-lg px-3 py-2 font-medium rounded shadow border bg-slate-900 text-white hover:bg-slate-800">View Results</button>
        </div>
      </div>
    </header>
  );
}
