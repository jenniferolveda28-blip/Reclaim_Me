import React from 'react';
import { Target, Copy, CalendarRange, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import PrintReportButton from '@/components/PrintReportButton';
import SharedCampaignAudienceCard from '@/components/marketing/shared_CampaignAudienceCard';
import SharedOutreachTemplateCard from '@/components/marketing/shared_OutreachTemplateCard';
import { AUDIENCES, TEMPLATES, SEQUENCE, GUARDRAILS } from '@/lib/outreachCampaignData';

const PDF_SECTIONS = [
  {
    heading: 'AUDIENCES',
    body: AUDIENCES.map(
      (a) =>
        `PRIORITY ${a.priority} — ${a.name}\nWho: ${a.who}\nNot: ${a.notThis}\nChannels: ${a.channels.join('; ')}\nAngle: ${a.angle}\nCTA: ${a.cta}\nCadence: ${a.cadence}\nMetric: ${a.metric}`
    ).join('\n\n'),
  },
  {
    heading: 'OUTREACH TEMPLATES',
    body: TEMPLATES.map(
      (t) => `${t.title} (${t.audience})${t.subject ? `\nSubject: ${t.subject}` : ''}\n\n${t.body}`
    ).join('\n\n---\n\n'),
  },
  {
    heading: '60-DAY SEQUENCE',
    body: SEQUENCE.map(([period, stage, detail]) => `${period} — ${stage}: ${detail}`).join('\n'),
  },
  {
    heading: 'GUARDRAILS',
    body: GUARDRAILS.map((g) => `• ${g}`).join('\n'),
  },
];

export default function SharedOutreachCampaign() {
  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto text-slate-100">
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="outline" className="border-cyan-500/40 text-cyan-300 font-mono text-[10px] tracking-wider">
            OUTREACH CAMPAIGN · RECLAIM ME
          </Badge>
          <Badge variant="outline" className="border-slate-600 text-slate-400 text-[10px]">
            Three audiences · copy-ready
          </Badge>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold gradient-text leading-tight">Reclaim Me Outreach Campaign</h1>
        <p className="text-slate-400 text-sm md:text-base mt-2 max-w-3xl">
          Personal authentication is a narrow, privacy-literate audience, not a general market. This campaign runs three
          tracks: the people who need identity recovery, the investors who fund it, and the biological engineers who
          build the wearable.
        </p>
        <div className="mt-4">
          <PrintReportButton
            reportTitle="Reclaim Me Outreach Campaign"
            subtitle="Audiences, outreach templates, 60-day sequence and guardrails"
            filename="reclaim-me-outreach-campaign-{date}.pdf"
            sections={PDF_SECTIONS}
          />
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-base md:text-lg font-bold text-slate-100 flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-cyan-400" /> Audience tracks
          </h2>
          <div className="space-y-4">
            {AUDIENCES.map((audience) => (
              <SharedCampaignAudienceCard key={audience.id} audience={audience} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-slate-100 flex items-center gap-2 mb-1">
            <Copy className="w-4 h-4 text-cyan-400" /> Outreach templates
          </h2>
          <p className="text-xs text-slate-500 mb-3">
            Replace the bracketed fields before sending. Nothing here should go out as a mass send.
          </p>
          <div className="space-y-4">
            {TEMPLATES.map((template) => (
              <SharedOutreachTemplateCard key={template.id} template={template} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-slate-100 flex items-center gap-2 mb-3">
            <CalendarRange className="w-4 h-4 text-cyan-400" /> 60-day sequence
          </h2>
          <div className="space-y-2">
            {SEQUENCE.map(([period, stage, detail]) => (
              <div key={period} className="rounded-lg border border-slate-700 bg-slate-800/40 p-3 md:p-4">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-[11px] font-mono text-cyan-300">{period}</span>
                  <span className="text-sm font-semibold text-slate-100">{stage}</span>
                </div>
                <p className="text-xs md:text-sm text-slate-400 mt-1">{detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-bold text-slate-100 flex items-center gap-2 mb-3">
            <ShieldAlert className="w-4 h-4 text-amber-400" /> Guardrails
          </h2>
          <ul className="space-y-2 text-xs md:text-sm text-slate-300">
            {GUARDRAILS.map((rule) => (
              <li key={rule} className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}