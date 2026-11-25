import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, ArrowRight, UserCheck, FileCheck, ShieldCheck } from 'lucide-react';
import { PortalHeader, StatTile, SearchInput, FilterChips, EmptyState, LoadingRow } from '@/components/common/shared_PortalUI';

const TYPE_FILTERS = [
  { id: 'all', label: 'All tasks' },
  { id: 'questionnaire', label: 'Questionnaires' },
  { id: 'observation', label: 'Observation reviews' },
  { id: 'attestation', label: 'Attestations' },
];

const TYPE_META = {
  questionnaire: { label: 'Questionnaire', icon: ClipboardList, className: 'border-cyan-500/40 text-cyan-300' },
  observation: { label: 'Observation review', icon: FileCheck, className: 'border-purple-500/40 text-purple-300' },
  attestation: { label: 'Attestation', icon: ShieldCheck, className: 'border-emerald-500/40 text-emerald-300' },
};

const PRIORITY_STYLE = {
  high: 'border-red-500/40 text-red-300',
  medium: 'border-amber-500/40 text-amber-300',
  low: 'border-slate-600 text-slate-400',
};

const fmt = (value) => (value ? new Date(value).toLocaleDateString() : '—');

export default function AuditorTaskQueue() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');

  useEffect(() => {
    const load = async () => {
      const [passPage, feedbackPage, certPage] = await Promise.all([
        base44.entities.AuditorAccessPass.list({ sort: '-created_date', limit: 100 }),
        base44.entities.AuditFeedback.list({ sort: '-created_date', limit: 100 }),
        base44.entities.IdentityCertificate.list({ sort: '-created_date', limit: 100 }),
      ]);

      const derived = [
        ...(passPage.items || [])
          .filter((p) => !p.questionnaire_completed && ['pending', 'active', 'used'].includes(p.status))
          .map((p) => ({
            id: `pass-${p.id}`,
            type: 'questionnaire',
            title: 'Audit questionnaire outstanding',
            owner: p.auditor_email || `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unassigned auditor',
            detail: p.accessed_date
              ? `Access pass opened on ${fmt(p.accessed_date)} · ${p.access_count || 0} sessions`
              : `Pass issued ${fmt(p.assigned_date || p.created_date)} · not yet opened`,
            priority: p.accessed_date ? 'high' : 'medium',
            status: p.status,
            link: '/auditor-management',
          })),
        ...(feedbackPage.items || [])
          .filter((f) => f.status === 'submitted' || f.status === 'reviewed')
          .map((f) => ({
            id: `feedback-${f.id}`,
            type: 'observation',
            title: `${f.category || 'general'} observation awaiting response`,
            owner: f.auditor_email || 'Auditor',
            detail: f.observation || 'No detail recorded.',
            priority: f.severity === 'high' ? 'high' : f.severity === 'medium' ? 'medium' : 'low',
            status: f.status,
            link: '/AuditFeedback',
          })),
        ...(certPage.items || [])
          .filter((c) => c.status === 'issued')
          .map((c) => ({
            id: `cert-${c.id}`,
            type: 'attestation',
            title: 'Attestation signature outstanding',
            owner: c.auditor_email || 'Auditor',
            detail: `${c.certificate_name} issued ${fmt(c.generated_date || c.created_date)}${c.token_serial ? ` · token ${c.token_serial}` : ''}`,
            priority: 'medium',
            status: c.status,
            link: '/certificate-registry',
          })),
      ];

      setTasks(derived);
      setLoading(false);
    };
    load();
  }, []);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesType = type === 'all' || task.type === type;
      const matchesQuery =
        !term ||
        [task.title, task.owner, task.detail, task.status]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(term));
      return matchesType && matchesQuery;
    });
  }, [tasks, query, type]);

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto text-slate-100">
      <PortalHeader
        badge="AUDIT · TASK QUEUE"
        title="Auditor Task Queue"
        description="Outstanding paperwork and validation steps for external auditors, derived from access passes, submitted observations and issued certificates."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatTile icon={ClipboardList} label="Tasks outstanding" value={tasks.length} />
        <StatTile icon={UserCheck} label="Questionnaires" value={tasks.filter((t) => t.type === 'questionnaire').length} />
        <StatTile icon={FileCheck} label="Observation reviews" value={tasks.filter((t) => t.type === 'observation').length} tone="text-purple-400" />
        <StatTile icon={ShieldCheck} label="Attestations" value={tasks.filter((t) => t.type === 'attestation').length} tone="text-emerald-400" />
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Search by auditor or task…" />
        <FilterChips options={TYPE_FILTERS} value={type} onChange={setType} />
      </div>

      {loading ? (
        <LoadingRow label="Building the task queue…" />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={tasks.length === 0 ? 'Nothing outstanding' : 'No tasks match this filter'}
          hint={tasks.length === 0 ? 'Every issued pass has its questionnaire, and every observation has a response.' : undefined}
        />
      ) : (
        <div className="space-y-2">
          {visible.map((task) => {
            const meta = TYPE_META[task.type];
            const Icon = meta.icon;
            return (
              <div key={task.id} className="rounded-xl border border-slate-700 bg-slate-800/40 p-3 md:p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Badge variant="outline" className={`text-[9px] ${meta.className}`}>
                        <Icon className="w-2.5 h-2.5 mr-1" /> {meta.label}
                      </Badge>
                      <Badge variant="outline" className={`text-[9px] ${PRIORITY_STYLE[task.priority]}`}>
                        {task.priority} priority
                      </Badge>
                      <span className="text-[10px] text-slate-500">{task.status}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-100">{task.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{task.owner}</p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{task.detail}</p>
                  </div>
                  <Link
                    to={task.link}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-600 text-[11px] text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 shrink-0"
                  >
                    Open <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}