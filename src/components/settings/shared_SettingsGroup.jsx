import React from 'react';

export default function SharedSettingsGroup({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-4 md:p-6">
      <div className="flex items-start gap-3 mb-4">
        {Icon && (
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-cyan-400" />
          </div>
        )}
        <div>
          <h2 className="text-sm md:text-base font-bold text-slate-100">{title}</h2>
          {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}