import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Microscope, FlaskConical, ArrowRight, GraduationCap, Handshake, ShieldCheck, Dna } from 'lucide-react';
import { PortalHeader } from '@/components/common/shared_PortalUI';
import SharedPartnerApplicationForm from '@/components/partners/shared_PartnerApplicationForm';
import { PROGRAMS, OPEN_NEEDS, RESEARCH_INITIATIVES } from '@/lib/biotechPartnershipData';

const PROGRAM_ICONS = [FlaskConical, GraduationCap, Handshake, ShieldCheck];

export default function BiotechPartnerships() {
  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto text-slate-100">
      <PortalHeader
        badge="BIOTECH · PARTNERSHIP CENTER"
        title="Biotech Partnership Center"
        description="For biological engineers, labs and research groups: what we are trying to build, which parts are open, and how to work with us. Equity participation, named authorship and a materials budget are on the table."
        actions={
          <Link to="/build-with-us" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-700 text-xs text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300">
            Build With Us <ArrowRight className="w-3 h-3" />
          </Link>
        }
      />

      <section className="mb-6">
        <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-1">
          <Dna className="w-4 h-4 text-cyan-400" /> Research initiatives
        </h2>
        <p className="text-xs text-slate-500 mb-3">Four problems. Two are running in software, two need a lab.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {RESEARCH_INITIATIVES.map((initiative) => (
            <div key={initiative.name} className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-sm font-semibold text-slate-100">{initiative.name}</h3>
                <Badge
                  variant="outline"
                  className={`text-[9px] shrink-0 ${
                    initiative.status === 'Open'
                      ? 'border-amber-500/40 text-amber-300'
                      : 'border-emerald-500/40 text-emerald-300'
                  }`}
                >
                  {initiative.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{initiative.body}</p>
              <p className="text-[11px] text-cyan-300/90 mt-2">Needs: {initiative.need}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-1">
          <Microscope className="w-4 h-4 text-cyan-400" /> Partnership programs
        </h2>
        <p className="text-xs text-slate-500 mb-3">Each program has a defined scope, so the commitment is clear before work starts.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PROGRAMS.map((program, index) => {
            const Icon = PROGRAM_ICONS[index] || FlaskConical;
            return (
              <div key={program.title} className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
                <Icon className="w-4 h-4 text-cyan-400 mb-2" />
                <h3 className="text-sm font-semibold text-slate-100 mb-1">{program.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{program.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-6">
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <h2 className="text-sm font-bold text-amber-200 mb-2">Open technical roles</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {OPEN_NEEDS.map((need) => (
              <li key={need} className="text-xs md:text-sm text-amber-100/80 flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span> {need}
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-amber-200/60 mt-2">
            Roles carry equity participation. Nothing here is a salaried position yet.
          </p>
        </div>
      </section>

      <section className="mb-6 rounded-xl border border-slate-700 bg-slate-800/40 p-4">
        <h2 className="text-sm font-bold text-slate-100 mb-2">Reference material</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Prototype schematics', to: '/helix-prototype-schematics' },
            { label: 'Token requirements', to: '/helix-token-requirements' },
            { label: 'Production brief', to: '/helix-token-production-brief' },
            { label: 'Token architecture', to: '/helix-verify-architecture' },
            { label: 'Partner brief', to: '/SeekingPartners' },
          ].map((link) => (
            <Link key={link.to} to={link.to} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-700 text-xs text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300">
              {link.label} <ArrowRight className="w-3 h-3" />
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-2xl">
        <h2 className="text-sm font-bold text-slate-100 mb-1">Talk to us</h2>
        <p className="text-xs text-slate-500 mb-3">Applications are read by the founder and every one gets a reply.</p>
        <SharedPartnerApplicationForm />
      </section>
    </div>
  );
}