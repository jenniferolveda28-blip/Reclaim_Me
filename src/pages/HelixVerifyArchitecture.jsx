import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { FileText, ArrowRight, AlertTriangle } from 'lucide-react';
import PrintReportButton from '@/components/PrintReportButton';
import SharedPaperworkSection from '@/components/tokens/shared_PaperworkSection';
import SharedPaperworkTable from '@/components/tokens/shared_PaperworkTable';
import SharedAuditorAttestation from '@/components/tokens/shared_AuditorAttestation';
import {
  LAYERS,
  ENROLLMENT_STEPS,
  VERIFICATION_STEPS,
  CONTROLS,
  EVIDENCE,
  STANDARDS,
  LIMITATIONS,
} from '@/lib/helixTokenPaperworkData';

const PDF_SECTIONS = [
  {
    heading: '1. ARCHITECTURE LAYERS',
    body: LAYERS.map((l) => `${l.id} ${l.name} — ${l.role}. ${l.mechanism} Status: ${l.status}`).join('\n\n'),
  },
  {
    heading: '2. ENROLLMENT AND ACTIVATION',
    body: ENROLLMENT_STEPS.map((s, i) => `${i + 1}. ${s[0]} — ${s[1]} (record: ${s[2]})`).join('\n'),
  },
  {
    heading: '3. VERIFICATION FLOW',
    body: VERIFICATION_STEPS.map((s, i) => `${i + 1}. ${s}`).join('\n'),
  },
  {
    heading: '4. SECURITY CONTROL SET',
    body: CONTROLS.map((c) => `${c[0]} ${c[1]}: ${c[2]} — evidence: ${c[3]}`).join('\n'),
  },
  {
    heading: '5. EVIDENCE AND AUDIT TRAIL',
    body: EVIDENCE.map((e) => `${e[0]} — evidences ${e[1]}. Visible to: ${e[2]}.`).join('\n'),
  },
  {
    heading: '6. STANDARDS ALIGNMENT',
    body: STANDARDS.map((s) => `${s[0]}: ${s[1]}. Caveat: ${s[2]}.`).join('\n'),
  },
  {
    heading: '7. PROTOTYPE STATUS AND LIMITATIONS',
    body: LIMITATIONS.map((l) => `• ${l}`).join('\n'),
  },
];

export default function HelixVerifyArchitecture() {
  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto text-slate-100">
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="outline" className="border-cyan-500/40 text-cyan-300 font-mono text-[10px] tracking-wider">
            ARCHITECTURE · HLXV-ARCH-002
          </Badge>
          <Badge variant="outline" className="border-slate-600 text-slate-400 text-[10px]">
            Technical review copy
          </Badge>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold gradient-text leading-tight">HelixVerify Architecture</h1>
        <p className="text-slate-400 text-sm md:text-base mt-2 max-w-3xl">
          The technical reference for auditors and external stakeholders: the layers the token sits inside, the exact
          enrollment and verification sequences, the control set, and the platform record that evidences each control.
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <PrintReportButton
            reportTitle="HelixVerify Architecture — Technical Review Copy"
            subtitle="Reclaim Me · Document HLXV-ARCH-002"
            filename="helixverify-architecture-{date}.pdf"
            sections={PDF_SECTIONS}
          />
          <Link to="/helix-token-architecture-paperwork" className="text-xs text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-1">
            Full paperwork document (HLXV-PPR-001) <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 flex items-start gap-2 mb-4">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs md:text-sm text-amber-200/90">
          Software behaviour described here reflects the running platform. Hardware is marked pending and has not been
          built. No certification or third-party audit is claimed.
        </p>
      </div>

      <div className="space-y-4">
        <SharedPaperworkSection
          number="01"
          title="Architecture layers"
          intro="The Reclaim Me Three-Pillar Architecture the token operates inside."
        >
          <SharedPaperworkTable
            columns={['Layer', 'Name', 'Role', 'Mechanism', 'Status']}
            rows={LAYERS.map((l) => [l.id, l.name, l.role, l.mechanism, l.status])}
          />
        </SharedPaperworkSection>

        <SharedPaperworkSection
          number="02"
          title="Enrollment and activation"
          intro="What must happen, in order, before a token can authenticate anything."
        >
          <ol className="space-y-2 list-decimal list-inside marker:text-cyan-400">
            {ENROLLMENT_STEPS.map((step) => (
              <li key={step[0]} className="text-xs md:text-sm text-slate-300">
                <span className="font-semibold text-slate-100">{step[0]}</span> — {step[1]}{' '}
                <span className="text-slate-500">(record: {step[2]})</span>
              </li>
            ))}
          </ol>
        </SharedPaperworkSection>

        <SharedPaperworkSection
          number="03"
          title="Verification flow"
          intro="Every authentication attempt, in sequence."
        >
          <ol className="space-y-2 list-decimal list-inside marker:text-cyan-400">
            {VERIFICATION_STEPS.map((step) => (
              <li key={step} className="text-xs md:text-sm text-slate-300">{step}</li>
            ))}
          </ol>
        </SharedPaperworkSection>

        <SharedPaperworkSection
          number="04"
          title="Security control set"
          intro="Each control, and the platform record an auditor checks it against."
        >
          <SharedPaperworkTable columns={['ID', 'Control', 'Description', 'Evidence']} rows={CONTROLS} />
        </SharedPaperworkSection>

        <SharedPaperworkSection
          number="05"
          title="Evidence and audit trail"
          intro="Where the proof of each control lives, and who can see it."
        >
          <SharedPaperworkTable columns={['Record', 'Evidences', 'Visible to']} rows={EVIDENCE} />
        </SharedPaperworkSection>

        <SharedPaperworkSection
          number="06"
          title="Standards alignment"
          intro="Which frameworks the design follows, stated with its limits."
        >
          <SharedPaperworkTable columns={['Standard', 'Alignment', 'Caveat']} rows={STANDARDS} />
        </SharedPaperworkSection>

        <SharedPaperworkSection
          number="07"
          title="Prototype status and limitations"
          intro="What is deliberately not claimed."
        >
          <ul className="space-y-2">
            {LIMITATIONS.map((item) => (
              <li key={item} className="text-xs md:text-sm text-slate-300 flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span> {item}
              </li>
            ))}
          </ul>
        </SharedPaperworkSection>

        <SharedAuditorAttestation />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
        <FileText className="w-3.5 h-3.5" />
        Reclaim Me · Texas, USA · HLXV-ARCH-002 · Confidential — auditor distribution
      </div>
    </div>
  );
}