import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';

export const WEBHOOK_EVENTS = [
  { id: 'threat_detected', label: 'Threat detected' },
  { id: 'incident_opened', label: 'Incident opened' },
  { id: 'exposure_discovered', label: 'Exposure discovered' },
  { id: 'removal_verified', label: 'Removal verified' },
  { id: 'key_rotated', label: 'Key rotated' },
  { id: 'token_activated', label: 'Token activated' },
  { id: 'audit_completed', label: 'Audit completed' },
];

const EMPTY = {
  webhook_name: '',
  target_url: '',
  event_types: [],
  secret_token: '',
  description: '',
  is_active: true,
};

const FIELD = 'bg-slate-900 border-slate-600 text-white placeholder:text-slate-500';

export default function SharedWebhookForm({ open, initial, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...EMPTY, ...initial, event_types: initial.event_types || [] } : EMPTY);
      setError('');
    }
  }, [open, initial]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const toggleEvent = (id) => {
    set('event_types', form.event_types.includes(id)
      ? form.event_types.filter((e) => e !== id)
      : [...form.event_types, id]);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!/^https:\/\//i.test(form.target_url.trim())) {
      setError('The endpoint must be an https:// URL.');
      return;
    }
    if (form.event_types.length === 0) {
      setError('Choose at least one event to send.');
      return;
    }
    setSaving(true);
    await onSave({ ...form, target_url: form.target_url.trim() });
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-slate-900 border-slate-700 text-slate-100 max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit webhook' : 'New webhook'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="webhook_name" className="text-slate-300 text-xs">Name</Label>
            <Input id="webhook_name" required value={form.webhook_name} onChange={(e) => set('webhook_name', e.target.value)} className={FIELD} placeholder="Slack security channel" />
          </div>

          <div>
            <Label htmlFor="target_url" className="text-slate-300 text-xs">Target endpoint</Label>
            <Input id="target_url" required value={form.target_url} onChange={(e) => set('target_url', e.target.value)} className={FIELD} placeholder="https://hooks.example.com/reclaimme" />
          </div>

          <div>
            <Label className="text-slate-300 text-xs">Events that trigger this webhook</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1">
              {WEBHOOK_EVENTS.map((event) => (
                <label key={event.id} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.event_types.includes(event.id)}
                    onChange={() => toggleEvent(event.id)}
                    className="accent-cyan-500"
                  />
                  {event.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="secret_token" className="text-slate-300 text-xs">Signing secret (optional)</Label>
            <Input id="secret_token" value={form.secret_token || ''} onChange={(e) => set('secret_token', e.target.value)} className={FIELD} placeholder="Used to sign each payload" />
          </div>

          <div>
            <Label htmlFor="description" className="text-slate-300 text-xs">Notes</Label>
            <Textarea id="description" rows={2} value={form.description || ''} onChange={(e) => set('description', e.target.value)} className={FIELD} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-200">Active</p>
              <p className="text-xs text-slate-500">Inactive webhooks receive nothing.</p>
            </div>
            <Switch checked={form.is_active} onCheckedChange={(v) => set('is_active', v)} />
          </div>

          {error && <p className="text-xs text-red-300">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="border-slate-600 text-slate-300">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-cyan-600 hover:bg-cyan-500 text-white">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {initial ? 'Save changes' : 'Create webhook'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}