import React from 'react';
import { FileText, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import PrintReportButton from '@/components/PrintReportButton';
import SharedPaperworkSection from '@/components/tokens/shared_PaperworkSection';
import SharedPaperworkTable from '@/components/tokens/shared_PaperworkTable';
import SharedAuditorAttestation from '@/components/tokens/shared_AuditorAttestation';
import {
  DOCUMENT_CONTROL,
  REVISIONS,
  TOKEN_FIELDS,
  LAYERS,
  ENROLLMENT_STEPS,
  VERIFICATION_STEPS,
  CONTROLS,
  EVIDENCE,
  STANDARDS,
  LIMITATIONS,
  GLOSSARY,
} from '@/lib/helixTokenPaperworkData';

const PDF_SECTIONS = [
  { heading: 'DOCUMENT CONTROL', body: DOCUMENT_CONTROL.map(([k, v]) => `${k}: ${v}`).join('\n') },
  { heading: '1. PURPOSE AND SCOPE', body: 'This document defines the HelixVerify token architecture in the form a stakeholder or external auditor reads before inspecting the live system. It states what the token is, how it is bound to one person, what happens at enrollment and verification, and which platform records evidence each control. It is a paperwork prototype: the intended design is described in full, and every section marked as pending is named as pending rather than implied to be complete.' },
  { heading: '2. TOKEN ANATOMY', body: TOKEN_FIELDS.map(([label, field, meaning]) => `${label} (${field}): ${meaning}`).join('\n') },
  { heading: '3. ARCHITECTURE LAYERS — RECLAIM ME THREE-PILLAR ARCHITECTURE', body: LAYERS.map((l) => `${l.id} ${l.name} — ${l.role}. ${l.mechanism} Status: ${l.status}`).join('\n\n') },
  { heading: '4. ENROLLMENT AND ACTIVATION', body: ENROLLMENT_STEPS.map((s, i) => `${i + 1}. ${s[0]} — ${s[1]} (record: ${s[2]})`).join('\n') },
  { heading: '5. VERIFICATION FLOW', body: VERIFICATION_STEPS.map((s, i) => `${i + 1}. ${s}`).join('\n') },
  { heading: '6. SECURITY CONTROL SET', body: CONTROLS.map((c) => `${c[0]} ${c[1]}: ${c[2]} — evidence: ${c[3]}`).join('\n') },
  { heading: '7. EVIDENCE AND AUDIT TRAIL', body: EVIDENCE.map((e) => `${e[0]} — evidences ${e[1]}. Visible to: ${e[2]}.`).join('\n') },
  { heading: '8. DATA HANDLING AND RETENTION', body: 'Only a one-way genetic hash is retained; raw sequence data is never stored. Retention is chosen at enrollment (90 days, 1 year, 3 years, or indefinite with renewal) and drives an automated destruction date. Consent withdrawal sets the enrollment to withdrawn and triggers destruction of the retained hash. End users cannot edit or delete their own audit records.' },
  { heading: '9. STANDARDS ALIGNMENT', body: STANDARDS.map((s) => `${s[0]}: ${s[1]}. Caveat: ${s[2]}.`).join('\n') },
  { heading: '10. PROTOTYPE STATUS AND LIMITATIONS', body: LIMITATIONS.map((l) => `• ${l}`).join('\n') },
  { heading: '11. GLOSSARY', body: GLOSSARY.map(([term, def]) => `${term}: ${def}`).join('\n') },
];

export default function SharedHelixTokenArchitecturePaperwork() {
  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto text-slate-100">
      {/* Document header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="outline" className="border-cyan-500/40 text-cyan-300 font-mono text-[10px] tracking-wider">
            PAPERWORK PROTOTYPE · HLXV-PPR-001 · v0.1
          </Badge>
          <Badge variant="outline" className="border-slate-600 text-slate-400 text-[10px]">
            Confidential — auditor distribution
          </Badge>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold gradient-text leading-tight">
          HelixVerify Token Architecture
        </h1>
        <p className="text-slate-400 text-sm md:text-base mt-2 max-w-3xl">
          The document layer for stakeholders and external auditors: what the token is, how it is bound to one person,
          and the exact records that evidence every control.
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <PrintReportButton
            reportTitle="HelixVerify Token Architecture — Paperwork Prototype"
            subtitle="Reclaim Me · Document HLXV-PPR-001 v0.1 · Confidential"
            filename="helixverify-token-architecture-{date}.pdf"
            sections={PDF_SECTIONS}
          />
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" /> Reclaim Me · Texas, USA · 2026-11-25
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <SharedPaperworkSection number="00" title="Document control" intro="Identity, version and review state of this document.">
          <SharedPaperworkTable columns={['Field', 'Value']} rows={DOCUMENT_CONTROL} />
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Revision history</p>
            <SharedPaperworkTable columns={['Version', 'Date', 'Change']} rows={REVISIONS} />
          </div>
        </SharedPaperworkSection>

        <SharedPaperworkSection
          number="01"
          title="Purpose and scope"
          intro="Why this document exists and what it does not claim."
        >
          <p>
            This document defines the HelixVerify token architecture for the people who fund it, partner on it, or
            audit it. It states the design in one place: the token, the identity binding, the enrollment and
            verification sequences, the control set, and the platform record that evidences each control.
          </p>
          <p>
            It is deliberately a paperwork prototype. Sections describing software behaviour reflect what the platform
            does today. Sections describing hardware are marked pending, because the wearable has not been built.
          </p>
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs md:text-sm text-amber-200/90">
              No certification, third-party audit or production issuance is claimed anywhere in this document.
            </p>
          </div>
        </SharedPaperworkSection>

        <SharedPaperworkSection
          number="02"
          title="Token anatomy"
          intro="Every field the platform records for a HelixVerify token, in plain language."
        >
          <SharedPaperworkTable columns={['Attribute', 'Field', 'What it means']} rows={TOKEN_FIELDS} />
        </SharedPaperworkSection>

        <SharedPaperworkSection
          number="03"
          title="Architecture layers"
          intro="The Reclaim Me Three-Pillar Architecture the token sits inside."
        >
          <SharedPaperworkTable
            columns={['Layer', 'Name', 'Role', 'Mechanism', 'Status']}
            rows={LAYERS.map((l) => [l.id, l.name, l.role, l.mechanism, l.status])}
          />
        </SharedPaperworkSection>

        <SharedPaperworkSection
          number="04"
          title="Enrollment and activation"
          intro="The sequence from consent to an active token, with the record that proves each step."
        >
          <ol className="space-y-3">
            {ENROLLMENT_STEPS.map(([title, detail, record], i) => (
              <li key={title} className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-slate-900 border border-slate-600 text-slate-400 text-[11px] font-mono flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-slate-100 text-sm">{title}</p>
                  <p className="text-xs md:text-sm text-slate-400">{detail}</p>
                  <p className="text-[11px] font-mono text-cyan-300/80 mt-1">{record}</p>
                </div>
              </li>
            ))}
          </ol>
        </SharedPaperworkSection>

        <SharedPaperworkSection
          number="05"
          title="Verification flow"
          intro="What happens from the moment a code is presented to the moment access is granted."
        >
          <ol className="space-y-2 list-decimal list-inside marker:text-cyan-400">
            {VERIFICATION_STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </SharedPaperworkSection>

        <SharedPaperworkSection
          number="06"
          title="Security control set"
          intro="Each control with its mechanism and the record an auditor can inspect."
        >
          <SharedPaperworkTable
            columns={['Control', 'Objective', 'Mechanism', 'Evidence']}
            rows={CONTROLS}
          />
        </SharedPaperworkSection>

        <SharedPaperworkSection
          number="07"
          title="Evidence and audit trail"
          intro="Where the proof lives, and who is allowed to read it."
        >
          <SharedPaperworkTable columns={['Record', 'What it evidences', 'Read access']} rows={EVIDENCE} />
        </SharedPaperworkSection>

        <SharedPaperworkSection
          number="08"
          title="Data handling and retention"
          intro="Genetic data is hashed, dated and destroyed on schedule."
        >
          <ul className="space-y-2 list-disc list-inside marker:text-cyan-400">
            <li>Only a one-way genetic hash is retained. Raw sequence data is never stored by the platform.</li>
            <li>Retention is chosen at enrollment: 90 days, 1 year, 3 years, or indefinite with renewal.</li>
            <li>The destruction date is set at enrollment and enforced by the automated destruction monitor.</li>
            <li>Withdrawing consent sets the enrollment to withdrawn and triggers destruction of the retained hash.</li>
            <li>End users cannot edit or delete their own audit records.</li>
          </ul>
        </SharedPaperworkSection>

        <SharedPaperworkSection
          number="09"
          title="Standards alignment"
          intro="What this design maps to, and how far that mapping goes."
        >
          <SharedPaperworkTable columns={['Framework', 'How this prototype maps', 'Caveat']} rows={STANDARDS} />
        </SharedPaperworkSection>

        <SharedPaperworkSection
          number="10"
          title="Prototype status and limitations"
          intro="Stated plainly, so no reader over-reads the design."
        >
          <ul className="space-y-2 list-disc list-inside marker:text-amber-400">
            {LIMITATIONS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SharedPaperworkSection>

        <SharedPaperworkSection number="11" title="Glossary" intro="Terms used across this document and the live dashboards.">
          <SharedPaperworkTable columns={['Term', 'Definition']} rows={GLOSSARY} />
        </SharedPaperworkSection>

        <SharedAuditorAttestation />

        <div className="flex items-center justify-center gap-2 py-4 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-500/70" />
          Reclaim Me · HelixVerify Token Architecture · HLXV-PPR-001 v0.1 · Confidential
        </div>
      </div>
    </div>
  );
}