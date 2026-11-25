import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Webhook, Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { PortalHeader, StatTile, SearchInput, EmptyState, LoadingRow } from '@/components/common/shared_PortalUI';
import SharedWebhookForm, { WEBHOOK_EVENTS } from '@/components/webhooks/shared_WebhookForm';

const eventLabel = (id) => WEBHOOK_EVENTS.find((e) => e.id === id)?.label || id;

export default function WebhookConfig() {
  const [hooks, setHooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const page = await base44.entities.WebhookEndpoint.list({ sort: '-created_date', limit: 100 });
    setHooks(page.items || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (values) => {
    if (editing) {
      await base44.entities.WebhookEndpoint.update(editing.id, values);
      toast.success('Webhook updated');
    } else {
      await base44.entities.WebhookEndpoint.create({ ...values, trigger_count: 0 });
      toast.success('Webhook created');
    }
    setDialogOpen(false);
    setEditing(null);
    load();
  };

  const toggle = async (hook, is_active) => {
    setHooks((list) => list.map((h) => (h.id === hook.id ? { ...h, is_active } : h)));
    await base44.entities.WebhookEndpoint.update(hook.id, { is_active });
  };

  const remove = async (hook) => {
    if (!window.confirm(`Delete "${hook.webhook_name}"? Deliveries to it stop immediately.`)) return;
    await base44.entities.WebhookEndpoint.delete(hook.id);
    setHooks((list) => list.filter((h) => h.id !== hook.id));
    toast.success('Webhook deleted');
  };

  const term = query.trim().toLowerCase();
  const visible = term
    ? hooks.filter((h) =>
        [h.webhook_name, h.target_url, h.description, ...(h.event_types || [])]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(term))
      )
    : hooks;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto text-slate-100">
      <PortalHeader
        badge="INTEGRATIONS · WEBHOOKS"
        title="Webhook Configuration"
        description="Outgoing webhooks for third-party integrations: choose the events that trigger a delivery and the https endpoint that receives it."
        actions={
          <Button onClick={() => { setEditing(null); setDialogOpen(true); }} className="bg-cyan-600 hover:bg-cyan-500 text-white">
            <Plus className="w-4 h-4" /> New webhook
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatTile icon={Webhook} label="Endpoints configured" value={hooks.length} />
        <StatTile icon={Webhook} label="Active" value={hooks.filter((h) => h.is_active).length} tone="text-emerald-400" />
        <StatTile icon={Webhook} label="Deliveries sent" value={hooks.reduce((sum, h) => sum + Number(h.trigger_count || 0), 0)} />
        <StatTile icon={Webhook} label="Failing last delivery" value={hooks.filter((h) => h.last_response_status && h.last_response_status >= 400).length} tone="text-red-400" />
      </div>

      <div className="mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Search by name, endpoint or event…" />
      </div>

      {loading ? (
        <LoadingRow label="Loading webhooks…" />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={Webhook}
          title={hooks.length === 0 ? 'No webhooks configured' : 'No webhooks match this search'}
          hint={hooks.length === 0 ? 'Add one to push security events into Slack, a SIEM or your own service.' : undefined}
          action={
            hooks.length === 0 ? (
              <Button variant="outline" onClick={() => setDialogOpen(true)} className="border-slate-600 text-slate-300">
                <Plus className="w-4 h-4" /> Add the first endpoint
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-2">
          {visible.map((hook) => (
            <div key={hook.id} className="rounded-xl border border-slate-700 bg-slate-800/40 p-3 md:p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-slate-100 truncate">{hook.webhook_name}</h3>
                    <Badge variant="outline" className={`text-[9px] ${hook.is_active ? 'border-emerald-500/40 text-emerald-300' : 'border-slate-600 text-slate-400'}`}>
                      {hook.is_active ? 'active' : 'inactive'}
                    </Badge>
                  </div>
                  <a
                    href={hook.target_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-cyan-300/90 hover:text-cyan-200 inline-flex items-center gap-1 truncate max-w-full"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" /> <span className="truncate">{hook.target_url}</span>
                  </a>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(hook.event_types || []).map((event) => (
                      <span key={event} className="px-1.5 py-0.5 rounded border border-slate-600 text-[9px] text-slate-400">
                        {eventLabel(event)}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">
                    {hook.trigger_count || 0} deliveries
                    {hook.last_triggered ? ` · last ${new Date(hook.last_triggered).toLocaleString()}` : ''}
                    {hook.last_response_status ? ` · HTTP ${hook.last_response_status}` : ''}
                  </p>
                  {hook.description && <p className="text-xs text-slate-400 mt-1">{hook.description}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Switch checked={!!hook.is_active} onCheckedChange={(v) => toggle(hook, v)} />
                  <Button variant="ghost" size="icon" onClick={() => { setEditing(hook); setDialogOpen(true); }} className="text-slate-400 hover:text-cyan-300 h-8 w-8">
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(hook)} className="text-slate-400 hover:text-red-400 h-8 w-8">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <SharedWebhookForm
        open={dialogOpen}
        initial={editing}
        onSave={save}
        onClose={() => { setDialogOpen(false); setEditing(null); }}
      />
    </div>
  );
}