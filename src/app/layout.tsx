import type { Metadata } from "next";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "AI Outbound OS",
  description: "Lead scoring and prioritization platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}

