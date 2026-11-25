import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const FIELD = 'bg-slate-900 border-slate-600 text-white placeholder:text-slate-500';

const EMPTY = { full_name: '', email: '', track: 'engineer', organization: '', focus_area: '', message: '' };

export default function SharedPartnerApplicationForm() {
  const [form, setForm] = React.useState(EMPTY);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState('');

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await base44.entities.PartnerApplication.create({ ...form, status: 'new' });
      setSubmitted(true);
      setForm(EMPTY);
    } catch (err) {
      setError(err?.message || 'Could not send your application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-6 text-center">
        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-100 mb-1">Application received</h3>
        <p className="text-sm text-slate-400">
          Every application is read by the founder. Expect a reply within five working days.
        </p>
        <Button variant="outline" onClick={() => setSubmitted(false)} className="mt-4 border-slate-600 text-slate-300">
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-slate-700 bg-slate-800/40 p-4 md:p-6 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="full_name" className="text-slate-300 text-xs">Full name</Label>
          <Input id="full_name" required value={form.full_name} onChange={(e) => set('full_name', e.target.value)} className={FIELD} />
        </div>
        <div>
          <Label htmlFor="email" className="text-slate-300 text-xs">Email</Label>
          <Input id="email" type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} className={FIELD} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label className="text-slate-300 text-xs">Which track</Label>
          <Select value={form.track} onValueChange={(v) => set('track', v)}>
            <SelectTrigger className={FIELD}><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="engineer">Engineering / co-development</SelectItem>
              <SelectItem value="lab">University lab / research</SelectItem>
              <SelectItem value="investor">Investor</SelectItem>
              <SelectItem value="advisor">Advisor (regulatory, clinical, legal)</SelectItem>
              <SelectItem value="other">Something else</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="organization" className="text-slate-300 text-xs">Lab, university or firm</Label>
          <Input id="organization" value={form.organization} onChange={(e) => set('organization', e.target.value)} className={FIELD} />
        </div>
      </div>

      <div>
        <Label htmlFor="focus_area" className="text-slate-300 text-xs">Discipline or focus</Label>
        <Input id="focus_area" value={form.focus_area} onChange={(e) => set('focus_area', e.target.value)} className={FIELD} placeholder="Microfluidics, biosensors, secure-element firmware, bioinformatics…" />
      </div>

      <div>
        <Label htmlFor="message" className="text-slate-300 text-xs">What would you want to work on?</Label>
        <Textarea id="message" rows={4} value={form.message} onChange={(e) => set('message', e.target.value)} className={FIELD} placeholder="A few lines is enough. Specifics help." />
      </div>

      {error && (
        <p className="text-xs text-red-300 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </p>
      )}

      <Button type="submit" disabled={submitting} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white">
        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
        Start the conversation
      </Button>
      <p className="text-[11px] text-slate-500 text-center">
        No deck required. Nothing is shared with third parties.
      </p>
    </form>
  );
}