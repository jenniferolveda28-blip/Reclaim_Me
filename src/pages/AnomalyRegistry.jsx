import React, { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Brain, ChevronDown, ChevronUp, Activity } from 'lucide-react';
import { PortalHeader, StatTile, SearchInput, FilterChips, EmptyState, LoadingRow } from '@/components/common/shared_PortalUI';

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'detected', label: 'Detected' },
  { id: 'investigating', label: 'Investigating' },
  { id: 'confirmed_threat', label: 'Confirmed' },
  { id: 'false_positive', label: 'False positive' },
  { id: 'resolved', label: 'Resolved' },
];

const STATUS_STYLE = {
  detected: 'border-red-500/40 text-red-300',
  investigating: 'border-amber-500/40 text-amber-300',
  confirmed_threat: 'border-orange-500/40 text-orange-300',
  false_positive: 'border-slate-600 text-slate-400',
  resolved: 'border-emerald-500/40 text-emerald-300',
};

const SEVERITY_STYLE = {
  critical: 'border-red-500/50 text-red-300',
  high: 'border-orange-500/50 text-orange-300',
  medium: 'border-amber-500/50 text-amber-300',
  low: 'border-slate-600 text-slate-400',
};

const humanize = (value) => (value || 'anomaly').replace(/_/g, ' ');
const fmt = (value) => (value ? new Date(value).toLocaleString() : '—');

export default function AnomalyRegistry() {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const load = async () => {
      const page = await base44.entities.BehaviorAnomaly.list({ sort: '-created_date', limit: 200 });
      setAnomalies(page.items || []);
      setLoading(false);
    };
    load();
  }, []);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return anomalies.filter((a) => {
      const matchesStatus = status === 'all' || a.status === status;
      const matchesQuery =
        !term ||
        [a.user_identifier, a.anomaly_type, a.ai_reasoning, a.description, a.status, a.severity]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(term));
      return matchesStatus && matchesQuery;
    });
  }, [anomalies, query, status]);

  const openCount = anomalies.filter((a) => a.status === 'detected' || a.status === 'investigating').length;
  const confirmedCount = anomalies.filter((a) => a.status === 'confirmed_threat').length;
  const avgDeviation = anomalies.length
    ? Math.round(anomalies.reduce((sum, a) => sum + Number(a.deviation_score || 0), 0) / anomalies.length)
    : 0;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto text-slate-100">
      <PortalHeader
        badge="SECURITY · ANOMALY REGISTRY"
        title="Data Anomaly Registry"
        description="Every behavioural anomaly the detection engine has raised, with the AI reasoning behind it and the remediation status it currently sits at."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatTile icon={Activity} label="Anomalies recorded" value={anomalies.length} />
        <StatTile icon={Activity} label="Open or investigating" value={openCount} tone="text-amber-400" />
        <StatTile icon={Activity} label="Confirmed threats" value={confirmedCount} tone="text-red-400" />
        <StatTile icon={Brain} label="Mean deviation score" value={avgDeviation} tone="text-purple-400" />
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Search by user, anomaly type or reasoning…" />
        <FilterChips options={STATUS_FILTERS} value={status} onChange={setStatus} />
      </div>

      {loading ? (
        <LoadingRow label="Loading anomaly registry…" />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={Activity}
          title={anomalies.length === 0 ? 'No anomalies recorded' : 'No anomalies match this filter'}
          hint={anomalies.length === 0 ? 'Behavioural deviations appear here once the engine flags them.' : undefined}
        />
      ) : (
        <div className="space-y-2">
          {visible.map((anomaly) => {
            const isOpen = expanded === anomaly.id;
            return (
              <div key={anomaly.id} className="rounded-xl border border-slate-700 bg-slate-800/40">
                <button
                  onClick={() => setExpanded(isOpen ? null : anomaly.id)}
                  className="w-full text-left p-3 md:p-4"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge variant="outline" className={`text-[9px] ${SEVERITY_STYLE[anomaly.severity] || 'border-slate-600 text-slate-400'}`}>
                      {anomaly.severity || 'unrated'}
                    </Badge>
                    <Badge variant="outline" className={`text-[9px] ${STATUS_STYLE[anomaly.status] || 'border-slate-600 text-slate-400'}`}>
                      {humanize(anomaly.status)}
                    </Badge>
                    {anomaly.deviation_score != null && (
                      <span className="text-[10px] text-purple-300">deviation {anomaly.deviation_score}</span>
                    )}
                    <span className="text-[10px] text-slate-500 ml-auto">{fmt(anomaly.detection_timestamp || anomaly.created_date)}</span>
                    {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-100 capitalize">{humanize(anomaly.anomaly_type)}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">User: {anomaly.user_identifier || '—'}</p>
                </button>

                {isOpen && (
                  <div className="px-3 md:px-4 pb-4 space-y-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">AI reasoning</p>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {anomaly.ai_reasoning || anomaly.description || 'No reasoning recorded for this event.'}
                      </p>
                    </div>
                    {(anomaly.baseline_behavior || anomaly.anomalous_behavior) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {anomaly.baseline_behavior && (
                          <div className="rounded-lg bg-slate-900/60 p-2">
                            <p className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Baseline</p>
                            <pre className="text-[10px] text-slate-400 whitespace-pre-wrap break-words">
                              {JSON.stringify(anomaly.baseline_behavior, null, 2)}
                            </pre>
                          </div>
                        )}
                        {anomaly.anomalous_behavior && (
                          <div className="rounded-lg bg-slate-900/60 p-2">
                            <p className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Observed</p>
                            <pre className="text-[10px] text-slate-400 whitespace-pre-wrap break-words">
                              {JSON.stringify(anomaly.anomalous_behavior, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}