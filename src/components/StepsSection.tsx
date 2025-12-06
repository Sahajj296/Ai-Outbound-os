"use client";
import React from "react";

export default function StepsSection() {
  return (
    <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
      <div className="flex flex-col items-center text-center max-w-[200px]">
        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mb-3 font-semibold text-slate-700">
          1
        </div>
        <p className="text-sm font-medium text-slate-700">Upload Leads</p>
        <p className="text-xs text-slate-500 mt-1">CSV or URL</p>
      </div>
      
      <div className="hidden md:block text-slate-300">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14" />
          <path d="M12 5l7 7-7 7" />
        </svg>
      </div>
      
      <div className="flex flex-col items-center text-center max-w-[200px]">
        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mb-3 font-semibold text-slate-700">
          2
        </div>
        <p className="text-sm font-medium text-slate-700">AI scores & explains</p>
        <p className="text-xs text-slate-500 mt-1">prioritization</p>
      </div>
      
      <div className="hidden md:block text-slate-300">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14" />
          <path d="M12 5l7 7-7 7" />
        </svg>
      </div>
      
      <div className="flex flex-col items-center text-center max-w-[200px]">
        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mb-3 font-semibold text-slate-700">
          3
        </div>
        <p className="text-sm font-medium text-slate-700">Export & start</p>
        <p className="text-xs text-slate-500 mt-1">outreach</p>
      </div>
    </div>
  );
}

