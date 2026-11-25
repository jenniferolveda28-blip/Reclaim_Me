import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Database, Watch, Handshake, Megaphone, ArrowRight, CheckCircle2, Circle, CircleDot } from 'lucide-react';
import { PortalHeader, StatTile, LoadingRow } from '@/components/common/shared_PortalUI';

const MILESTONES = [
  { title: 'Platform built', detail: 'CipherPass key rotation, the Dynamic Scrambler, exposure discovery and removal, audit trail and destruction scheduling are running.', state: 'done' },
  { title: 'Auditor paperwork layer', detail: 'HLXV-PPR-001 and the architecture reference are published for external review.', state: 'done' },
  { title: 'Marketing and partner pipeline', detail: 'Three audience tracks live: personal authentication users, biotech partners, investors.', state: 'done' },
  { title: 'Working token prototype', detail: 'Depends on a co-development partner and lab. Not built.', state: 'open' },
  { title: 'Pilot with first cohort', detail: 'After prototype validation and the genetic-privacy review.', state: 'open' },
];

const STATE_ICON = {
  done: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />,
  active: <CircleDot className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />,
  open: <Circle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />,
};

export default function InvestorRelations() {
  const [counts, setCounts] = useState({ exposures: 0, tokens: 0, partners: 0, campaigns: 0 });
  const [pipeline, setPipeline] = useState({ leads: 0, conversions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [exposures, tokens, partners, campaignPage] = await Promise.all([
        base44.entities.ExposureRecord.count(),
        base44.entities.HelixVerifyToken.count(),
        base44.entities.PartnerApplication.count(),
        base44.entities.MarketingCampaign.list({ sort: '-created_date', limit: 100 }),
      ]);
      const campaigns = campaignPage.items || [];
      setCounts({
        exposures: exposures || 0,
        tokens: tokens || 0,
        partners: partners || 0,
        campaigns: campaigns.length,
      });
      setPipeline({
        leads: campaigns.reduce((sum, c) => sum + Number(c.leads_count || 0), 0),
        conversions: campaigns.reduce((sum, c) => sum + Number(c.conversions_count || 0), 0),
      });
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto text-slate-100">
      <PortalHeader
        badge="INVESTORS · RELATIONS"
        title="Investor Relations"
        description="Platform growth, milestone status and project trajectory in one place. Figures come from the live database; anything not built is labelled as not built."
        actions={
          <Link to="/InvestorOverview" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-700 text-xs text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300">
            Investor overview <ArrowRight className="w-3 h-3" />
          </Link>
        }
      />

      {loading ? (
        <LoadingRow label="Loading platform figures…" />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatTile icon={Database} label="Exposure records tracked" value={counts.exposures} />
            <StatTile icon={Watch} label="HelixVerify tokens enrolled" value={counts.tokens} tone="text-emerald-400" />
            <StatTile icon={Handshake} label="Partner applications" value={counts.partners} tone="text-purple-400" />
            <StatTile icon={Megaphone} label="Active campaign tracks" value={counts.campaigns} tone="text-blue-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-4 md:p-5">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-cyan-400" /> Growth signals
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Pipeline contacts generated</span>
                  <span className="font-bold text-slate-100">{pipeline.leads}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Calls or demos converted</span>
                  <span className="font-bold text-slate-100">{pipeline.conversions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Campaign tracks running</span>
                  <span className="font-bold text-slate-100">{counts.campaigns}</span>
                </div>
              </div>
              <Link to="/marketing-campaigns" className="inline-flex items-center gap-1 text-[11px] text-cyan-300 mt-3">
                Campaign detail <ArrowRight className="w-3 h-3" />
              </Link>
            </section>

            <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-4 md:p-5">
              <h2 className="text-sm font-bold text-slate-100 mb-3">Equity and funding position</h2>
              <ul className="space-y-2 text-xs md:text-sm text-slate-300">
                <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">•</span> Pre-prototype round open: funds the first working token and the genetic-privacy review.</li>
                <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">•</span> Equity participation offered to engineering and lab partners, vesting against milestones.</li>
                <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">•</span> Terms discussed under the Texas NDA. Nothing here is an offer of securities.</li>
              </ul>
              <Link to="/TexasNDA" className="inline-flex items-center gap-1 text-[11px] text-cyan-300 mt-3">
                Texas NDA <ArrowRight className="w-3 h-3" />
              </Link>
            </section>
          </div>

          <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-4 md:p-5">
            <h2 className="text-sm font-bold text-slate-100 mb-3">Project trajectory</h2>
            <ol className="space-y-3">
              {MILESTONES.map((milestone) => (
                <li key={milestone.title} className="flex items-start gap-2">
                  {STATE_ICON[milestone.state]}
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-100">{milestone.title}</p>
                      {milestone.state === 'open' && (
                        <Badge variant="outline" className="border-slate-600 text-slate-500 text-[9px]">not built</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{milestone.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <div className="flex flex-wrap gap-2 mt-6">
            {[
              { label: 'Investor demo', to: '/InvestorDemo' },
              { label: 'Investor CRM', to: '/InvestorCRM' },
              { label: 'Executive summary', to: '/ExecutiveSummary' },
              { label: 'Partner report', to: '/partner-summary-report' },
              { label: 'Build With Us', to: '/build-with-us' },
            ].map((link) => (
              <Link key={link.to} to={link.to} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-700 text-xs text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300">
                {link.label} <ArrowRight className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}