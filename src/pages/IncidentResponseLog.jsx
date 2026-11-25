import React, { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, Search as SearchIcon } from 'lucide-react';
import { PortalHeader, StatTile, SearchInput, FilterChips, EmptyState, LoadingRow } from '@/components/common/shared_PortalUI';

const STATUS_BUCKETS = [
  { id: 'all', label: 'All incidents' },
  { id: 'open', label: 'Open' },
  { id: 'investigating', label: 'Investigating' },
  { id: 'resolved', label: 'Resolved' },
  { id: 'false_positive', label: 'False positive' },
];

const BUCKET_OF = {
  open: 'open',
  detected: 'open',
  active: 'open',
  investigating: 'investigating',
  confirmed: 'resolved',
  confirmed_threat: 'resolved',
  mitigated: 'resolved',
  resolved: 'resolved',
  false_positive: 'false_positive',
};

const SEVERITY_STYLE = {
  critical: 'border-red-500/50 text-red-300',
  emergency: 'border-red-500/50 text-red-300',
  high: 'border-orange-500/50 text-orange-300',
  medium: 'border-amber-500/50 text-amber-300',
  low: 'border-slate-600 text-slate-400',
};

const BUCKET_STYLE = {
  open: 'border-red-500/40 text-red-300',
  investigating: 'border-amber-500/40 text-amber-300',
  resolved: 'border-emerald-500/40 text-emerald-300',
  false_positive: 'border-slate-600 text-slate-400',
};

const humanize = (value) => (value || 'incident').replace(/_/g, ' ');
const fmt = (value) => (value ? new Date(value).toLocaleString() : '—');

export default function IncidentResponseLog() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    const load = async () => {
      const [alertsPage, anomaliesPage, chainsPage] = await Promise.all([
        base44.entities.CriminalActivityAlert.list({ sort: '-created_date', limit: 100 }),
        base44.entities.BehaviorAnomaly.list({ sort: '-created_date', limit: 100 }),
        base44.entities.ThreatCorrelation.list({ sort: '-created_date', limit: 100 }),
      ]);

      const normalized = [
        ...(alertsPage.items || []).map((a) => ({
          id: `alert-${a.id}`,
          title: humanize(a.alert_type),
          source: 'Criminal alert',
          severity: a.severity,
          status: a.status,
          bucket: BUCKET_OF[a.status] || 'open',
          date: a.created_date,
          detail: a.description || (a.indicators || []).join(', '),
          remediation: a.investigation_notes || (a.auto_blocked ? 'Access blocked automatically.' : ''),
        })),
        ...(anomaliesPage.items || []).map((a) => ({
          id: `anomaly-${a.id}`,
          title: humanize(a.anomaly_type),
          source: 'Behavior anomaly',
          severity: a.severity,
          status: a.status,
          bucket: BUCKET_OF[a.status] || 'open',
          date: a.detection_timestamp || a.created_date,
          detail: a.ai_reasoning || a.description,
          remediation: a.status === 'resolved' ? 'Marked resolved after review.' : '',
        })),
        ...(chainsPage.items || []).map((c) => ({
          id: `chain-${c.id}`,
          title: c.attack_chain_name,
          source: 'Attack chain',
          severity: c.severity,
          status: c.status,
          bucket: BUCKET_OF[c.status] || 'open',
          date: c.created_date,
          detail: c.ai_analysis || c.description,
          remediation: (c.recommended_actions || []).join(' · '),
        })),
      ].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

      setIncidents(normalized);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return incidents.filter((incident) => {
      const matchesStatus = status === 'all' || incident.bucket === status;
      const matchesQuery =
        !term ||
        [incident.title, incident.detail, incident.remediation, incident.source, incident.severity]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(term));
      return matchesStatus && matchesQuery;
    });
  }, [incidents, query, status]);

  const openCount = incidents.filter((i) => i.bucket === 'open').length;
  const investigatingCount = incidents.filter((i) => i.bucket === 'investigating').length;
  const resolvedCount = incidents.filter((i) => i.bucket === 'resolved').length;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto text-slate-100">
      <PortalHeader
        badge="SECURITY · INCIDENT LOG"
        title="Incident Response Log"
        description="Every recorded incident from the criminal-activity alerts, behavioural anomaly engine and attack-chain correlation, with the remediation action and final status."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatTile icon={ShieldAlert} label="Total incidents" value={incidents.length} />
        <StatTile icon={ShieldAlert} label="Open" value={openCount} tone="text-red-400" />
        <StatTile icon={SearchIcon} label="Investigating" value={investigatingCount} tone="text-amber-400" />
        <StatTile icon={ShieldAlert} label="Resolved" value={resolvedCount} tone="text-emerald-400" />
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Search incidents, reasoning, remediation…" />
        <FilterChips options={STATUS_BUCKETS} value={status} onChange={setStatus} />
      </div>

      {loading ? (
        <LoadingRow label="Loading incident history…" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ShieldAlert}
          title={incidents.length === 0 ? 'No incidents recorded yet' : 'No incidents match this filter'}
          hint={incidents.length === 0 ? 'Alerts, anomalies and attack chains appear here as they are detected.' : undefined}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((incident) => (
            <div key={incident.id} className="rounded-xl border border-slate-700 bg-slate-800/40 p-3 md:p-4">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Badge variant="outline" className={`text-[9px] ${SEVERITY_STYLE[incident.severity] || 'border-slate-600 text-slate-400'}`}>
                  {incident.severity || 'unrated'}
                </Badge>
                <Badge variant="outline" className={`text-[9px] ${BUCKET_STYLE[incident.bucket]}`}>
                  {humanize(incident.status)}
                </Badge>
                <span className="text-[10px] text-slate-500">{incident.source}</span>
                <span className="text-[10px] text-slate-500 ml-auto">{fmt(incident.date)}</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-100 capitalize">{incident.title}</h3>
              {incident.detail && <p className="text-xs text-slate-400 mt-1 leading-relaxed">{incident.detail}</p>}
              {incident.remediation && (
                <p className="text-[11px] text-cyan-300/90 mt-2">
                  <span className="text-slate-500">Remediation:</span> {incident.remediation}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}