import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Trash2, Target, CalendarDays } from 'lucide-react';

const AUDIENCE_LABEL = {
  personal_authentication: 'Personal auth users',
  biotech_partners: 'Biotech partners',
  investors: 'Investors',
};

const AUDIENCE_STYLE = {
  personal_authentication: 'border-purple-500/40 text-purple-300',
  biotech_partners: 'border-emerald-500/40 text-emerald-300',
  investors: 'border-blue-500/40 text-blue-300',
};

const STATUS_STYLE = {
  draft: 'border-slate-600 text-slate-400',
  active: 'border-emerald-500/40 text-emerald-300',
  paused: 'border-amber-500/40 text-amber-300',
  completed: 'border-blue-500/40 text-blue-300',
};

const money = (n) => `$${Number(n || 0).toLocaleString()}`;

export default function SharedCampaignCard({ campaign, onStatusChange, onEdit, onDelete }) {
  const budget = Number(campaign.budget || 0);
  const spend = Number(campaign.spend || 0);
  const used = budget > 0 ? Math.min(100, Math.round((spend / budget) * 100)) : 0;

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge variant="outline" className={`text-[10px] ${AUDIENCE_STYLE[campaign.audience]}`}>
              {AUDIENCE_LABEL[campaign.audience]}
            </Badge>
            <Badge variant="outline" className={`text-[10px] ${STATUS_STYLE[campaign.status]}`}>
              {campaign.status}
            </Badge>
          </div>
          <h3 className="text-sm md:text-base font-semibold text-slate-100 truncate">{campaign.name}</h3>
          {campaign.channel && <p className="text-xs text-slate-400 mt-0.5">{campaign.channel}</p>}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => onEdit(campaign)} className="text-slate-400 hover:text-cyan-300 h-8 w-8">
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(campaign)} className="text-slate-400 hover:text-red-400 h-8 w-8">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-center">
        <div className="rounded-lg bg-slate-900/60 p-2">
          <p className="text-[10px] uppercase tracking-wide text-slate-500">Leads</p>
          <p className="text-sm font-bold text-slate-100">{campaign.leads_count || 0}</p>
        </div>
        <div className="rounded-lg bg-slate-900/60 p-2">
          <p className="text-[10px] uppercase tracking-wide text-slate-500">Conversions</p>
          <p className="text-sm font-bold text-slate-100">{campaign.conversions_count || 0}</p>
        </div>
        <div className="rounded-lg bg-slate-900/60 p-2">
          <p className="text-[10px] uppercase tracking-wide text-slate-500">Spend</p>
          <p className="text-sm font-bold text-slate-100">{money(spend)}</p>
        </div>
        <div className="rounded-lg bg-slate-900/60 p-2">
          <p className="text-[10px] uppercase tracking-wide text-slate-500">Budget</p>
          <p className="text-sm font-bold text-slate-100">{money(budget)}</p>
        </div>
      </div>

      {budget > 0 && (
        <div className="mt-3">
          <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
            <div className="h-full bg-cyan-500" style={{ width: `${used}%` }} />
          </div>
          <p className="text-[10px] text-slate-500 mt-1">{used}% of budget used</p>
        </div>
      )}

      {(campaign.start_date || campaign.end_date) && (
        <p className="text-[11px] text-slate-500 mt-3 flex items-center gap-1">
          <CalendarDays className="w-3 h-3" />
          {campaign.start_date || '—'} → {campaign.end_date || 'open'}
        </p>
      )}

      {campaign.goal && (
        <p className="text-[11px] text-cyan-300/90 mt-1 flex items-center gap-1">
          <Target className="w-3 h-3" /> {campaign.goal}
        </p>
      )}

      {campaign.notes && <p className="text-xs text-slate-400 mt-2 leading-relaxed">{campaign.notes}</p>}

      <div className="mt-3">
        <Select value={campaign.status} onValueChange={(v) => onStatusChange(campaign, v)}>
          <SelectTrigger className="h-8 bg-slate-900 border-slate-600 text-slate-300 text-xs w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}