import React from 'react';
import { PenLine, CheckCircle2 } from 'lucide-react';
import { ATTESTATION_CHECKLIST } from '@/lib/helixTokenPaperworkData';

const SIGNATURE_FIELDS = ['Auditor name', 'Organisation', 'Engagement reference', 'Scope reviewed', 'Date'];

export default function SharedAuditorAttestation() {
  return (
    <section className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-4 md:p-6">
      <div className="flex items-center gap-2 mb-3">
        <PenLine className="w-4 h-4 text-emerald-400" />
        <h2 className="text-base md:text-lg font-bold text-slate-100">Auditor review and attestation</h2>
      </div>
      <p className="text-xs md:text-sm text-slate-400 mb-4 leading-relaxed">
        Completed by the reviewing auditor. Each item is confirmed against the live system, not this document alone.
      </p>

      <ul className="space-y-2 mb-6">
        {ATTESTATION_CHECKLIST.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs md:text-sm text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SIGNATURE_FIELDS.map((field) => (
          <div key={field}>
            <div className="h-9 border-b border-slate-600" />
            <p className="text-[10px] md:text-xs text-slate-500 mt-1 uppercase tracking-wide">{field}</p>
          </div>
        ))}
        <div>
          <div className="h-16 border-b border-slate-600" />
          <p className="text-[10px] md:text-xs text-slate-500 mt-1 uppercase tracking-wide">Signature</p>
        </div>
      </div>
    </section>
  );
}