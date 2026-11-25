import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Dna, Microscope, TrendingUp, Users, FlaskConical, ShieldCheck, ArrowRight, Handshake, GraduationCap } from 'lucide-react';
import SharedPartnerApplicationForm from '@/components/partners/shared_PartnerApplicationForm';

const TRACKS = [
  {
    icon: Microscope,
    title: 'Engineering partnership',
    tag: 'Equity participation',
    points: [
      'Equity in the token programme, vesting against milestones',
      'Named authorship on the assay and sensor work',
      'A say in the architecture, not a ticket queue',
      'Prototype budget ring-fenced before work starts',
    ],
  },
  {
    icon: TrendingUp,
    title: 'Investor partnership',
    tag: 'Pre-prototype round',
    points: [
      'A working platform you can open in a browser today',
      'A defined hardware path with named failure modes',
      'Use of funds stated line by line',
      'Auditor-ready architecture documentation on request',
    ],
  },
];

import { PROGRAMS, OPEN_NEEDS } from '@/lib/biotechPartnershipData';

export default function BuildWithUs() {
  return (
    <div className="min-h-screen text-slate-100">
      <section className="px-4 md:px-8 pt-10 pb-8 max-w-5xl mx-auto">
        <Badge variant="outline" className="border-cyan-500/40 text-cyan-300 font-mono text-[10px] tracking-wider mb-3">
          BUILD WITH US · RECLAIM ME
        </Badge>
        <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
          The platform is built.<br />
          <span className="gradient-text">The wearable is the open problem.</span>
        </h1>
        <p className="text-slate-300 text-sm md:text-lg max-w-3xl leading-relaxed">
          Reclaim Me exists because a stolen phone should not cost someone the last photos of a person they have lost.
          The software that discovers exposure, removes listings, rotates credentials and records every access attempt
          is running today. The device that anchors identity to a person rather than a password is not, and we are
          looking for the engineers and partners who want to build it.
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          <a href="#apply" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition-colors">
            Start a conversation <ArrowRight className="w-4 h-4" />
          </a>
          <Link to="/SeekingPartners" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-600 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 text-sm transition-colors">
            Read the full partner brief
          </Link>
        </div>
      </section>

      <section className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: ShieldCheck, title: 'What exists', body: 'CipherPass key rotation, the Dynamic Scrambler, the audit trail, the exposure-removal workflow and the destruction schedule. Running, not slideware.' },
            { icon: Dna, title: "What's open", body: 'The token: marker panel, sample handling, optical readout, liveness, secure element and power budget. This is where we need expertise.' },
            { icon: Users, title: 'Who this is for', body: 'Biological engineers who want ownership of a hard problem, and investors who fund pre-prototype hardware in security and health.' },
          ].map((card) => (
            <div key={card.title} className="rounded-xl border border-slate-700 bg-slate-800/40 p-4 md:p-5">
              <card.icon className="w-5 h-5 text-cyan-400 mb-3" />
              <h2 className="text-sm font-bold text-slate-100 mb-1">{card.title}</h2>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-1">Two ways to join</h2>
        <p className="text-slate-400 text-sm mb-4">Equity participation is real here, and so is the work behind it.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TRACKS.map((track) => (
            <div key={track.title} className="rounded-xl border border-slate-700 bg-slate-800/40 p-4 md:p-6">
              <div className="flex items-center gap-2 mb-1">
                <track.icon className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100">{track.title}</h3>
              </div>
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 text-[10px] mb-3">{track.tag}</Badge>
              <ul className="space-y-2">
                {track.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-xs md:text-sm text-slate-300">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-slate-500 mt-3">
          Equity and partnership terms are discussed in conversation and documented under the Texas NDA. Nothing on
          this page is an offer of securities.
        </p>
      </section>

      <section className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-1">Partnership programs</h2>
        <p className="text-slate-400 text-sm mb-4">Four ways to work with us, each with a defined scope.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PROGRAMS.map((program) => (
            <div key={program.title} className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
              <FlaskConical className="w-4 h-4 text-cyan-400 mb-2" />
              <h3 className="text-sm font-semibold text-slate-100 mb-1">{program.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{program.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 md:p-6">
          <h2 className="text-sm md:text-base font-bold text-amber-200 mb-2">What we need first</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {OPEN_NEEDS.map((need) => (
              <li key={need} className="text-xs md:text-sm text-amber-100/80 flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span> {need}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="apply" className="px-4 md:px-8 py-8 max-w-3xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-1">Start the conversation</h2>
        <p className="text-slate-400 text-sm mb-4">
          Tell us what you work on. Applications are read by the founder, and every one gets a reply.
        </p>
        <SharedPartnerApplicationForm />
        <div className="flex flex-wrap gap-4 mt-6 text-xs">
          <Link to="/helix-prototype-schematics" className="text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-1">
            Prototype schematics <ArrowRight className="w-3 h-3" />
          </Link>
          <Link to="/helix-verify-architecture" className="text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-1">
            Token architecture <ArrowRight className="w-3 h-3" />
          </Link>
          <Link to="/InvestorOverview" className="text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-1">
            Investor overview <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </section>
    </div>
  );
}