import "@/styles/globals.css";
import { Navbar } from "@/components/Navbar";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Navbar />
        <main className="p-8">{children}</main>
      </body>
    </html>
  );
}
