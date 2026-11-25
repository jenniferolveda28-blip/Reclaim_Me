import React, { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Archive, Download, FileText, ShieldCheck, MessageSquare } from 'lucide-react';
import { PortalHeader, StatTile, SearchInput, FilterChips, EmptyState, LoadingRow } from '@/components/common/shared_PortalUI';

const TYPE_FILTERS = [
  { id: 'all', label: 'Everything' },
  { id: 'report', label: 'Audit reports' },
  { id: 'attestation', label: 'Attestation certificates' },
  { id: 'observation', label: 'Auditor observations' },
];

const TYPE_STYLE = {
  report: { label: 'Report', className: 'border-cyan-500/40 text-cyan-300', icon: FileText },
  attestation: { label: 'Attestation', className: 'border-emerald-500/40 text-emerald-300', icon: ShieldCheck },
  observation: { label: 'Observation', className: 'border-purple-500/40 text-purple-300', icon: MessageSquare },
};

const isHttpUrl = (url) => typeof url === 'string' && /^https?:\/\//i.test(url);
const fmt = (value) => (value ? new Date(value).toLocaleDateString() : '—');

export default function ComplianceArchive() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');

  useEffect(() => {
    const load = async () => {
      const [reportsPage, certsPage, feedbackPage] = await Promise.all([
        base44.entities.SecurityReport.list({ sort: '-created_date', limit: 100 }),
        base44.entities.IdentityCertificate.list({ sort: '-created_date', limit: 100 }),
        base44.entities.AuditFeedback.list({ sort: '-created_date', limit: 100 }),
      ]);

      const archive = [
        ...(reportsPage.items || []).map((r) => ({
          id: `report-${r.id}`,
          type: 'report',
          title: r.report_name,
          meta: `${r.schedule_type || 'on-demand'} · last run ${fmt(r.last_run)}`,
          body: r.description || `Covers ${r.time_range_days || 30} days of security data.`,
          status: r.is_active ? 'active' : 'archived',
          url: r.file_url,
          date: r.last_run || r.created_date,
        })),
        ...(certsPage.items || []).map((c) => ({
          id: `cert-${c.id}`,
          type: 'attestation',
          title: c.certificate_name,
          meta: `${c.auditor_email || 'unassigned'} · ${fmt(c.generated_date || c.created_date)}`,
          body: c.notes || `Subject: ${c.user_email || '—'}${c.token_serial ? ` · token ${c.token_serial}` : ''}`,
          status: c.status,
          url: c.drive_file_url,
          date: c.generated_date || c.created_date,
        })),
        ...(feedbackPage.items || []).map((f) => ({
          id: `feedback-${f.id}`,
          type: 'observation',
          title: `${f.category || 'general'} observation — ${f.severity || 'info'}`,
          meta: `${f.auditor_email || 'auditor'} · ${fmt(f.session_date || f.created_date)}`,
          body: f.observation,
          status: f.status,
          url: null,
          date: f.session_date || f.created_date,
        })),
      ].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

      setItems(archive);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesType = type === 'all' || item.type === type;
      const matchesQuery =
        !term ||
        [item.title, item.meta, item.body, item.status]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(term));
      return matchesType && matchesQuery;
    });
  }, [items, query, type]);

  const countOf = (t) => items.filter((i) => i.type === t).length;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto text-slate-100">
      <PortalHeader
        badge="AUDIT · ARCHIVE"
        title="Compliance Archive"
        description="Searchable library of every audit report, signed attestation certificate and auditor observation held by the platform."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatTile icon={Archive} label="Total documents" value={items.length} />
        <StatTile icon={FileText} label="Audit reports" value={countOf('report')} />
        <StatTile icon={ShieldCheck} label="Attestations" value={countOf('attestation')} tone="text-emerald-400" />
        <StatTile icon={MessageSquare} label="Observations" value={countOf('observation')} tone="text-purple-400" />
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Search by name, auditor, category…" />
        <FilterChips options={TYPE_FILTERS} value={type} onChange={setType} />
      </div>

      {loading ? (
        <LoadingRow label="Loading archive…" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Archive}
          title={items.length === 0 ? 'The archive is empty' : 'Nothing matches this search'}
          hint={items.length === 0 ? 'Reports, certificates and observations are filed here automatically.' : undefined}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => {
            const style = TYPE_STYLE[item.type];
            const Icon = style.icon;
            return (
              <div key={item.id} className="rounded-xl border border-slate-700 bg-slate-800/40 p-3 md:p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Badge variant="outline" className={`text-[9px] ${style.className}`}>
                        <Icon className="w-2.5 h-2.5 mr-1" /> {style.label}
                      </Badge>
                      {item.status && (
                        <Badge variant="outline" className="border-slate-600 text-slate-400 text-[9px]">{item.status}</Badge>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-100 truncate">{item.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.meta}</p>
                    {item.body && <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.body}</p>}
                  </div>
                  {isHttpUrl(item.url) && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-600 text-[11px] text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 shrink-0"
                    >
                      <Download className="w-3 h-3" /> Open
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}