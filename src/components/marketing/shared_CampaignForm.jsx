import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const EMPTY = {
  name: '',
  audience: 'personal_authentication',
  channel: '',
  status: 'draft',
  start_date: '',
  end_date: '',
  budget: 0,
  spend: 0,
  leads_count: 0,
  conversions_count: 0,
  goal: '',
  notes: '',
};

const FIELD = 'bg-slate-900 border-slate-600 text-white placeholder:text-slate-500';

export default function SharedCampaignForm({ open, initial, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(initial ? { ...EMPTY, ...initial } : EMPTY);
  }, [open, initial]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave({
      ...form,
      budget: Number(form.budget) || 0,
      spend: Number(form.spend) || 0,
      leads_count: Number(form.leads_count) || 0,
      conversions_count: Number(form.conversions_count) || 0,
    });
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-slate-900 border-slate-700 text-slate-100 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit campaign' : 'New campaign'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-slate-300 text-xs">Campaign name</Label>
            <Input id="name" required value={form.name} onChange={(e) => set('name', e.target.value)} className={FIELD} placeholder="Privacy communities — recovery story" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-slate-300 text-xs">Audience</Label>
              <Select value={form.audience} onValueChange={(v) => set('audience', v)}>
                <SelectTrigger className={FIELD}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal_authentication">Personal authentication users</SelectItem>
                  <SelectItem value="biotech_partners">Biotech partners</SelectItem>
                  <SelectItem value="investors">Investors</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-slate-300 text-xs">Status</Label>
              <Select value={form.status} onValueChange={(v) => set('status', v)}>
                <SelectTrigger className={FIELD}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="channel" className="text-slate-300 text-xs">Primary channel</Label>
              <Input id="channel" value={form.channel} onChange={(e) => set('channel', e.target.value)} className={FIELD} placeholder="BioSpace, LinkedIn, university labs" />
            </div>
            <div>
              <Label htmlFor="goal" className="text-slate-300 text-xs">Measured on</Label>
              <Input id="goal" value={form.goal} onChange={(e) => set('goal', e.target.value)} className={FIELD} placeholder="Technical calls booked" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <Label htmlFor="start" className="text-slate-300 text-xs">Start</Label>
              <Input id="start" type="date" value={form.start_date || ''} onChange={(e) => set('start_date', e.target.value)} className={FIELD} />
            </div>
            <div>
              <Label htmlFor="end" className="text-slate-300 text-xs">End</Label>
              <Input id="end" type="date" value={form.end_date || ''} onChange={(e) => set('end_date', e.target.value)} className={FIELD} />
            </div>
            <div>
              <Label htmlFor="budget" className="text-slate-300 text-xs">Budget ($)</Label>
              <Input id="budget" type="number" min="0" value={form.budget} onChange={(e) => set('budget', e.target.value)} className={FIELD} />
            </div>
            <div>
              <Label htmlFor="spend" className="text-slate-300 text-xs">Spend ($)</Label>
              <Input id="spend" type="number" min="0" value={form.spend} onChange={(e) => set('spend', e.target.value)} className={FIELD} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="leads" className="text-slate-300 text-xs">Leads</Label>
              <Input id="leads" type="number" min="0" value={form.leads_count} onChange={(e) => set('leads_count', e.target.value)} className={FIELD} />
            </div>
            <div>
              <Label htmlFor="conversions" className="text-slate-300 text-xs">Conversions</Label>
              <Input id="conversions" type="number" min="0" value={form.conversions_count} onChange={(e) => set('conversions_count', e.target.value)} className={FIELD} />
            </div>
          </div>

          <div>
            <Label htmlFor="notes" className="text-slate-300 text-xs">Notes</Label>
            <Textarea id="notes" rows={3} value={form.notes || ''} onChange={(e) => set('notes', e.target.value)} className={FIELD} placeholder="Next actions, what worked, what to cut" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="border-slate-600 text-slate-300">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-cyan-600 hover:bg-cyan-500 text-white">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {initial ? 'Save changes' : 'Create campaign'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}