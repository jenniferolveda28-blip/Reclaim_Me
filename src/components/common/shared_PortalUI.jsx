import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function PortalHeader({ badge, title, description, actions, children }) {
  return (
    <div className="mb-6">
      <Badge variant="outline" className="border-cyan-500/40 text-cyan-300 font-mono text-[10px] tracking-wider mb-2">
        {badge}
      </Badge>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold gradient-text leading-tight">{title}</h1>
          {description && <p className="text-slate-400 text-sm mt-2 max-w-3xl">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

export function StatTile({ icon: Icon, label, value, tone = 'text-cyan-400' }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-3 md:p-4">
      {Icon && <Icon className={`w-4 h-4 mb-2 ${tone}`} />}
      <p className="text-lg md:text-2xl font-bold text-slate-100">{value}</p>
      <p className="text-[11px] text-slate-500">{label}</p>
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="relative flex-1 min-w-[200px]">
      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
      />
    </div>
  );
}

export function FilterChips({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={`px-3 py-1.5 rounded-md text-xs border transition-colors ${
            value === option.id
              ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-300'
              : 'border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, hint, action }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">
      {Icon && <Icon className="w-6 h-6 text-slate-600 mx-auto mb-2" />}
      <p className="text-sm text-slate-400">{title}</p>
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function LoadingRow({ label = 'Loading…' }) {
  return (
    <div className="flex items-center gap-2 text-slate-400 text-sm py-10">
      <div className="w-4 h-4 border-2 border-slate-600 border-t-cyan-400 rounded-full animate-spin" />
      {label}
    </div>
  );
}