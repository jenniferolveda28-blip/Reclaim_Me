import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

export default function SharedCampaignAudienceCard({ audience }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4 md:p-6">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <Badge variant="outline" className="border-cyan-500/40 text-cyan-300 font-mono text-[10px]">
          PRIORITY {audience.priority}
        </Badge>
        <h2 className="text-base md:text-lg font-bold text-slate-100">{audience.name}</h2>
      </div>

      <p className="text-sm text-slate-300 leading-relaxed mb-3">{audience.who}</p>
      <p className="text-xs text-amber-300/80 leading-relaxed mb-4">{audience.notThis}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Where to reach them</p>
          <ul className="space-y-1 text-slate-300 list-disc list-inside marker:text-cyan-400">
            {audience.channels.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Message angle</p>
            <p className="text-slate-300">{audience.angle}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Call to action</p>
            <p className="text-slate-300">{audience.cta}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Cadence</p>
            <p className="text-slate-300">{audience.cadence}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Measures against</p>
            <p className="text-cyan-300">{audience.metric}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {audience.tools.map((tool) => (
          <Link
            key={tool.to}
            to={tool.to}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-600 text-[11px] text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors"
          >
            {tool.label} <ArrowRight className="w-3 h-3" />
          </Link>
        ))}
      </div>
    </div>
  );
}