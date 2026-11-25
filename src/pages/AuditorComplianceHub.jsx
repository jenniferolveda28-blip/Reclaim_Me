import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { FileText, ShieldCheck, ScrollText, ArrowRight, ClipboardCheck } from 'lucide-react';
import { PortalHeader, StatTile, EmptyState, LoadingRow } from '@/components/common/shared_PortalUI';

const date = (value) => (value ? new Date(value).toLocaleDateString() : '—');

const HUB_LINKS = [
  { label: 'Auditor portal', to: '/auditor-portal' },
  { label: 'Attestation certificates', to: '/certificate-registry' },
  { label: 'Compliance log', to: '/auditor-compliance-log' },
  { label: 'Access logs', to: '/auditor-access-logs' },
  { label: 'Task queue', to: '/auditor-task-queue' },
  { label: 'Compliance archive', to: '/compliance-archive' },
  { label: 'Token architecture', to: '/helix-verify-architecture' },
  { label: 'Audit compliance', to: '/audit-compliance' },
];

export default function AuditorComplianceHub() {
  const [reports, setReports] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [reportPage, certPage, logPage] = await Promise.all([
        base44.entities.SecurityReport.list({ sort: '-created_date', limit: 10 }),
        base44.entities.IdentityCertificate.list({ sort: '-created_date', limit: 10 }),
        base44.entities.AuditorAccessLog.list({ sort: '-access_time', limit: 10 }),
      ]);
      setReports(reportPage.items || []);
      setCertificates(certPage.items || []);
      setLogs(logPage.items || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto text-slate-100">
      <PortalHeader
        badge="AUDIT · COMPLIANCE HUB"
        title="Auditor Compliance Hub"
        description="One entry point for external auditors: compliance reports, attestation documents and the verified system log, each linked to the record it comes from."
      />

      {loading ? (
        <LoadingRow label="Loading compliance records…" />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatTile icon={FileText} label="Compliance reports" value={reports.length} />
            <StatTile icon={ShieldCheck} label="Attestation documents" value={certificates.length} />
            <StatTile icon={ScrollText} label="Verified access events" value={logs.length} />
            <StatTile icon={ClipboardCheck} label="Open auditor tasks" value="—" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-slate-100">Compliance reports</h2>
              </div>
              {reports.length === 0 ? (
                <EmptyState icon={FileText} title="No reports generated yet" hint="Reports appear here once a schedule runs." />
              ) : (
                <ul className="space-y-2">
                  {reports.map((report) => (
                    <li key={report.id} className="rounded-lg bg-slate-900/60 p-2.5">
                      <p className="text-xs font-medium text-slate-200 truncate">{report.report_name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {report.schedule_type || 'on-demand'} · last run {date(report.last_run)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              <Link to="/compliance-archive" className="inline-flex items-center gap-1 text-[11px] text-cyan-300 mt-3">
                Open archive <ArrowRight className="w-3 h-3" />
              </Link>
            </section>

            <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-slate-100">Attestation documents</h2>
              </div>
              {certificates.length === 0 ? (
                <EmptyState icon={ShieldCheck} title="No certificates issued yet" />
              ) : (
                <ul className="space-y-2">
                  {certificates.map((cert) => (
                    <li key={cert.id} className="rounded-lg bg-slate-900/60 p-2.5">
                      <p className="text-xs font-medium text-slate-200 truncate">{cert.certificate_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="border-slate-600 text-slate-400 text-[9px]">{cert.status}</Badge>
                        <span className="text-[10px] text-slate-500 truncate">{cert.auditor_email || '—'}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <Link to="/certificate-registry" className="inline-flex items-center gap-1 text-[11px] text-cyan-300 mt-3">
                Certificate registry <ArrowRight className="w-3 h-3" />
              </Link>
            </section>

            <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
              <div className="flex items-center gap-2 mb-3">
                <ScrollText className="w-4 h-4 text-purple-400" />
                <h2 className="text-sm font-bold text-slate-100">Verified system log</h2>
              </div>
              {logs.length === 0 ? (
                <EmptyState icon={ScrollText} title="No auditor access recorded yet" />
              ) : (
                <ul className="space-y-2">
                  {logs.map((log) => (
                    <li key={log.id} className="rounded-lg bg-slate-900/60 p-2.5">
                      <p className="text-xs font-medium text-slate-200 truncate">{log.action || 'access'}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                        {log.auditor_email} · {date(log.access_time || log.created_date)} · {log.success === false ? 'denied' : 'permitted'}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              <Link to="/auditor-access-logs" className="inline-flex items-center gap-1 text-[11px] text-cyan-300 mt-3">
                Full access log <ArrowRight className="w-3 h-3" />
              </Link>
            </section>
          </div>

          <section className="mt-6">
            <h2 className="text-sm font-bold text-slate-100 mb-3">Everything an auditor needs</h2>
            <div className="flex flex-wrap gap-2">
              {HUB_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-700 text-xs text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors"
                >
                  {link.label} <ArrowRight className="w-3 h-3" />
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}