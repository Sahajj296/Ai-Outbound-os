import React from "react";

export default function ScoreExplanationSection() {
  return (
    <section className="w-full max-w-3xl mx-auto bg-gray-50 rounded-xl p-4 shadow-md mb-6">
      <h2 className="text-2xl font-bold text-center mb-4">How Lead Scoring Works 🧠</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-base">
        <div>📧 Email Present & Valid → <b>30 pts</b></div>
        <div>🏢 Company Info Available → <b>25 pts</b></div>
        <div>👤 Name Available → <b>15 pts</b></div>
        <div>📞 Contact Info Available → <b>10 pts</b></div>
        <div>🌐 Industry Info Available → <b>10 pts</b></div>
        <div>⭐ Decision Maker Title Bonus → <b>10 pts</b></div>
      </div>
      <div className="text-center mt-4 text-sm text-gray-600">
        Higher Score = Better Lead Quality + Intent Signals 🚀
      </div>
    </section>
  );
}

