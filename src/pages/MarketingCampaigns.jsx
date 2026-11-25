import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Megaphone, Users, DollarSign, Target, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import SharedCampaignCard from '@/components/marketing/shared_CampaignCard';
import SharedCampaignForm from '@/components/marketing/shared_CampaignForm';

const FILTERS = [
  { id: 'all', label: 'All campaigns' },
  { id: 'personal_authentication', label: 'Personal auth users' },
  { id: 'biotech_partners', label: 'Biotech partners' },
  { id: 'investors', label: 'Investors' },
];

const money = (n) => `$${Number(n || 0).toLocaleString()}`;

export default function MarketingCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const page = await base44.entities.MarketingCampaign.list({ sort: '-created_date', limit: 200 });
    setCampaigns(page.items || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const active = campaigns.filter((c) => c.status === 'active').length;
    const budget = campaigns.reduce((sum, c) => sum + Number(c.budget || 0), 0);
    const leads = campaigns.reduce((sum, c) => sum + Number(c.leads_count || 0), 0);
    const conversions = campaigns.reduce((sum, c) => sum + Number(c.conversions_count || 0), 0);
    return { active, budget, leads, conversions };
  }, [campaigns]);

  const visible = filter === 'all' ? campaigns : campaigns.filter((c) => c.audience === filter);

  const handleSave = async (values) => {
    if (editing) {
      await base44.entities.MarketingCampaign.update(editing.id, values);
      toast.success('Campaign updated');
    } else {
      await base44.entities.MarketingCampaign.create(values);
      toast.success('Campaign created');
    }
    setDialogOpen(false);
    setEditing(null);
    load();
  };

  const handleStatusChange = async (campaign, status) => {
    setCampaigns((list) => list.map((c) => (c.id === campaign.id ? { ...c, status } : c)));
    await base44.entities.MarketingCampaign.update(campaign.id, { status });
  };

  const handleDelete = async (campaign) => {
    if (!window.confirm(`Delete "${campaign.name}"? This cannot be undone.`)) return;
    await base44.entities.MarketingCampaign.delete(campaign.id);
    setCampaigns((list) => list.filter((c) => c.id !== campaign.id));
    toast.success('Campaign deleted');
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto text-slate-100">
      <div className="mb-6">
        <Badge variant="outline" className="border-cyan-500/40 text-cyan-300 font-mono text-[10px] tracking-wider mb-2">
          MARKETING · CAMPAIGN TRACKER
        </Badge>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold gradient-text leading-tight">Marketing Campaigns</h1>
            <p className="text-slate-400 text-sm mt-2 max-w-2xl">
              Every campaign runs at one of three audiences: people seeking personal authentication, biotech partners,
              or investors. Track spend, leads and conversions here.
            </p>
          </div>
          <Button
            onClick={() => { setEditing(null); setDialogOpen(true); }}
            className="bg-cyan-600 hover:bg-cyan-500 text-white shrink-0"
          >
            <Plus className="w-4 h-4" /> New campaign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { icon: Megaphone, label: 'Active campaigns', value: stats.active },
          { icon: DollarSign, label: 'Planned budget', value: money(stats.budget) },
          { icon: Users, label: 'Leads generated', value: stats.leads },
          { icon: Target, label: 'Conversions', value: stats.conversions },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-700 bg-slate-800/40 p-3 md:p-4">
            <stat.icon className="w-4 h-4 text-cyan-400 mb-2" />
            <p className="text-lg md:text-2xl font-bold text-slate-100">{stat.value}</p>
            <p className="text-[11px] text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-md text-xs border transition-colors ${
              filter === f.id
                ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-300'
                : 'border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-400 text-sm py-10">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading campaigns…
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">
          <Megaphone className="w-6 h-6 text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-400">No campaigns in this audience yet.</p>
          <Button
            variant="outline"
            onClick={() => { setEditing(null); setDialogOpen(true); }}
            className="mt-3 border-slate-600 text-slate-300"
          >
            <Plus className="w-4 h-4" /> Create the first one
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visible.map((campaign) => (
            <SharedCampaignCard
              key={campaign.id}
              campaign={campaign}
              onStatusChange={handleStatusChange}
              onEdit={(c) => { setEditing(c); setDialogOpen(true); }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Link
        to="/outreach-campaign"
        className="inline-flex items-center gap-1 text-xs text-cyan-300 hover:text-cyan-200 mt-6"
      >
        Open the outreach playbook — audiences, templates and the 60-day sequence <ArrowRight className="w-3 h-3" />
      </Link>

      <SharedCampaignForm
        open={dialogOpen}
        initial={editing}
        onSave={handleSave}
        onClose={() => { setDialogOpen(false); setEditing(null); }}
      />
    </div>
  );
}