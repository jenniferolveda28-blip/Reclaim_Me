import React from 'react';

export default function SharedPaperworkSection({ number, title, intro, children }) {
  return (
    <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-4 md:p-6">
      <div className="flex items-start gap-3 mb-4">
        <span className="shrink-0 w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center">
          {number}
        </span>
        <div>
          <h2 className="text-base md:text-lg font-bold text-slate-100">{title}</h2>
          {intro && <p className="text-xs md:text-sm text-slate-400 mt-1 leading-relaxed">{intro}</p>}
        </div>
      </div>
      <div className="space-y-3 text-sm text-slate-300 leading-relaxed">{children}</div>
    </section>
  );
}