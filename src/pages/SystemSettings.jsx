import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Bell, ShieldCheck, Save, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import SharedSettingsGroup from '@/components/settings/shared_SettingsGroup';
import SharedToggleRow from '@/components/settings/shared_ToggleRow';

const FIELD = 'bg-slate-900 border-slate-600 text-white placeholder:text-slate-500';

const DEFAULTS = {
  setting_key: 'global',
  app_name: 'Reclaim Me',
  tagline: '',
  primary_color: '#06b6d4',
  support_email: '',
  notify_threats: true,
  notify_exposure: true,
  notify_weekly_digest: true,
  digest_frequency: 'weekly',
  require_mfa: true,
  auto_scrub: true,
  session_timeout_minutes: 30,
};

export default function SystemSettings() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [recordId, setRecordId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const load = async () => {
      const me = await base44.auth.me().catch(() => null);
      setIsAdmin(me?.role === 'admin');
      const page = await base44.entities.PlatformSettings.list({ limit: 1 });
      const record = (page.items || [])[0];
      if (record) {
        setRecordId(record.id);
        setSettings({ ...DEFAULTS, ...record });
      }
      setLoading(false);
    };
    load();
  }, []);

  const set = (key, value) => setSettings((s) => ({ ...s, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...settings, session_timeout_minutes: Number(settings.session_timeout_minutes) || 30 };
      delete payload.id;
      delete payload.created_by_id;
      delete payload.created_date;
      delete payload.updated_date;
      if (recordId) {
        await base44.entities.PlatformSettings.update(recordId, payload);
      } else {
        const created = await base44.entities.PlatformSettings.create(payload);
        setRecordId(created.id);
      }
      toast.success('Platform settings saved');
    } catch (err) {
      toast.error(err?.message || 'Could not save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading settings…
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto text-slate-100">
      <div className="mb-6">
        <Badge variant="outline" className="border-cyan-500/40 text-cyan-300 font-mono text-[10px] tracking-wider mb-2">
          PLATFORM · SYSTEM SETTINGS
        </Badge>
        <h1 className="text-2xl md:text-4xl font-bold gradient-text leading-tight">System Settings</h1>
        <p className="text-slate-400 text-sm mt-2 max-w-2xl">
          Branding, notification defaults and the platform-wide security toggles. Deeper policy controls live in
          Security Configuration.
        </p>
        {!isAdmin && (
          <div className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200/90">
              You are signed in without administrator rights, so these settings can be viewed but not saved.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <SharedSettingsGroup icon={Palette} title="Branding" description="How the product names and identifies itself.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="app_name" className="text-slate-300 text-xs">Product name</Label>
              <Input id="app_name" value={settings.app_name || ''} onChange={(e) => set('app_name', e.target.value)} className={FIELD} />
            </div>
            <div>
              <Label htmlFor="support_email" className="text-slate-300 text-xs">Support / auditor email</Label>
              <Input id="support_email" type="email" value={settings.support_email || ''} onChange={(e) => set('support_email', e.target.value)} className={FIELD} />
            </div>
          </div>
          <div>
            <Label htmlFor="tagline" className="text-slate-300 text-xs">Tagline</Label>
            <Input id="tagline" value={settings.tagline || ''} onChange={(e) => set('tagline', e.target.value)} className={FIELD} placeholder="Identity recovery that cannot be locked away from you." />
          </div>
          <div>
            <Label htmlFor="primary_color" className="text-slate-300 text-xs">Primary colour</Label>
            <div className="flex items-center gap-3 mt-1">
              <input
                id="primary_color"
                type="color"
                value={settings.primary_color || '#06b6d4'}
                onChange={(e) => set('primary_color', e.target.value)}
                className="h-9 w-14 rounded border border-slate-600 bg-slate-900 cursor-pointer"
              />
              <Input
                value={settings.primary_color || ''}
                onChange={(e) => set('primary_color', e.target.value)}
                className={`${FIELD} font-mono text-xs w-32`}
              />
              <span className="text-xs text-slate-500">Used on reports and exported documents.</span>
            </div>
          </div>
        </SharedSettingsGroup>

        <SharedSettingsGroup icon={Bell} title="Notification defaults" description="What the platform sends unless a user overrides it.">
          <SharedToggleRow
            label="Threat alerts"
            description="Notify immediately when a threat is detected."
            checked={settings.notify_threats}
            onChange={(v) => set('notify_threats', v)}
            disabled={!isAdmin}
          />
          <SharedToggleRow
            label="Exposure alerts"
            description="Notify when a new data-broker exposure is found."
            checked={settings.notify_exposure}
            onChange={(v) => set('notify_exposure', v)}
            disabled={!isAdmin}
          />
          <SharedToggleRow
            label="Weekly security digest"
            description="Send the summary of findings, removals and access events."
            checked={settings.notify_weekly_digest}
            onChange={(v) => set('notify_weekly_digest', v)}
            disabled={!isAdmin}
          />
          <div>
            <Label className="text-slate-300 text-xs">Digest frequency</Label>
            <Select value={settings.digest_frequency} onValueChange={(v) => set('digest_frequency', v)} disabled={!isAdmin}>
              <SelectTrigger className={`${FIELD} mt-1 w-full sm:w-48`}><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="off">Off</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </SharedSettingsGroup>

        <SharedSettingsGroup icon={ShieldCheck} title="Security configuration" description="Platform-wide toggles. Per-service policy is set in Security Configuration.">
          <SharedToggleRow
            label="Require multi-factor authentication"
            description="Second factor for every administrator sign-in."
            checked={settings.require_mfa}
            onChange={(v) => set('require_mfa', v)}
            disabled={!isAdmin}
          />
          <SharedToggleRow
            label="Automatic removal requests"
            description="Open opt-out requests automatically for critical findings."
            checked={settings.auto_scrub}
            onChange={(v) => set('auto_scrub', v)}
            disabled={!isAdmin}
          />
          <div>
            <Label htmlFor="session_timeout" className="text-slate-300 text-xs">Session idle timeout (minutes)</Label>
            <Input
              id="session_timeout"
              type="number"
              min="5"
              max="240"
              value={settings.session_timeout_minutes}
              onChange={(e) => set('session_timeout_minutes', e.target.value)}
              className={`${FIELD} mt-1 w-full sm:w-32`}
              disabled={!isAdmin}
            />
          </div>
          <Link to="/security-configuration" className="inline-flex items-center gap-1 text-xs text-cyan-300 hover:text-cyan-200">
            Open Security Configuration <ArrowRight className="w-3 h-3" />
          </Link>
        </SharedSettingsGroup>
      </div>

      <div className="sticky bottom-4 mt-6 flex justify-end">
        <Button onClick={save} disabled={saving || !isAdmin} className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save settings
        </Button>
      </div>
    </div>
  );
}