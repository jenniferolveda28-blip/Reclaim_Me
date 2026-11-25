import React, { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KeyRound, RefreshCw, AlertTriangle, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { PortalHeader, StatTile, SearchInput, EmptyState, LoadingRow } from '@/components/common/shared_PortalUI';

const STATUS_STYLE = {
  active: 'border-emerald-500/40 text-emerald-300',
  expiring_soon: 'border-amber-500/40 text-amber-300',
  expired: 'border-red-500/40 text-red-300',
  revoked: 'border-slate-600 text-slate-400',
};

const intervalLabel = (seconds) => {
  const s = Number(seconds || 0);
  if (!s) return '—';
  if (s < 3600) return `${Math.round(s / 60)} min`;
  if (s < 86400) return `${Math.round(s / 3600)} h`;
  return `${Math.round(s / 86400)} d`;
};

const timeUntil = (value) => {
  if (!value) return 'no expiry set';
  const diff = new Date(value).getTime() - Date.now();
  const days = Math.floor(diff / 86400000);
  if (diff < 0) return `${Math.abs(days)} days overdue`;
  if (days === 0) return 'expires today';
  return `in ${days} days`;
};

export default function KeyRotationManager() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [rotating, setRotating] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const load = async () => {
    const page = await base44.entities.CipherPass.list({ sort: '-created_date', limit: 200 });
    setKeys(page.items || []);
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      const me = await base44.auth.me().catch(() => null);
      setIsAdmin(me?.role === 'admin');
      await load();
    };
    init();
  }, []);

  const rotate = async (key) => {
    setRotating(key.id);
    try {
      const now = new Date();
      const expires = new Date(now.getTime() + Number(key.rotation_interval || 86400) * 1000);
      await base44.entities.CipherPass.update(key.id, {
        last_rotated: now.toISOString(),
        expires_at: expires.toISOString(),
        status: 'active',
      });
      await base44.entities.SecurityLog.create({
        event_type: 'key_rotation',
        details: `Manual rotation triggered for ${key.key_name || key.endpoint_group_id}`,
        success: true,
        threat_level: 'none',
      });
      toast.success(`${key.key_name || 'Key'} rotated`);
      await load();
    } catch (err) {
      toast.error(err?.message || 'Rotation failed');
    } finally {
      setRotating(null);
    }
  };

  const alerts = useMemo(() => {
    const soon = Date.now() + 7 * 86400000;
    return keys.filter(
      (k) => k.status === 'expired' || k.status === 'expiring_soon' || (k.expires_at && new Date(k.expires_at).getTime() < soon)
    );
  }, [keys]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return keys;
    return keys.filter((k) =>
      [k.key_name, k.endpoint_group_id, k.status, k.description]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(term))
    );
  }, [keys, query]);

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto text-slate-100">
      <PortalHeader
        badge="CIPHERPASS · KEY ROTATION"
        title="Key Rotation Manager"
        description="Every CipherPass key, its rotation interval and expiry, with a manual rotation control. Each rotation is written to the security log."
      />

      {!isAdmin && (
        <div className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200/90">Rotation requires administrator rights. You can review keys but not rotate them.</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatTile icon={KeyRound} label="Keys tracked" value={keys.length} />
        <StatTile icon={RefreshCw} label="Active" value={keys.filter((k) => k.status === 'active').length} tone="text-emerald-400" />
        <StatTile icon={Clock} label="Expiring within 7 days" value={alerts.length} tone="text-amber-400" />
        <StatTile icon={AlertTriangle} label="Expired" value={keys.filter((k) => k.status === 'expired').length} tone="text-red-400" />
      </div>

      {alerts.length > 0 && (
        <section className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <h2 className="text-sm font-bold text-amber-200 flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" /> Expiration alerts
          </h2>
          <ul className="space-y-1">
            {alerts.map((key) => (
              <li key={key.id} className="text-xs text-amber-100/80">
                {key.key_name || key.endpoint_group_id} — {timeUntil(key.expires_at)}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Search keys by name, group or status…" />
      </div>

      {loading ? (
        <LoadingRow label="Loading keys…" />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={KeyRound}
          title={keys.length === 0 ? 'No CipherPass keys registered' : 'No keys match this search'}
          hint={keys.length === 0 ? 'Keys created for protected endpoint groups appear here.' : undefined}
        />
      ) : (
        <div className="space-y-2">
          {visible.map((key) => (
            <div key={key.id} className="rounded-xl border border-slate-700 bg-slate-800/40 p-3 md:p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-slate-100 truncate">{key.key_name || 'Unnamed key'}</h3>
                    <Badge variant="outline" className={`text-[9px] ${STATUS_STYLE[key.status] || 'border-slate-600 text-slate-400'}`}>
                      {key.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Group {key.endpoint_group_id || '—'} · rotates every {intervalLabel(key.rotation_interval)} · used {key.usage_count || 0} times
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Last rotated {key.last_rotated ? new Date(key.last_rotated).toLocaleString() : 'never'} · {timeUntil(key.expires_at)}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => rotate(key)}
                  disabled={!isAdmin || rotating === key.id}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white shrink-0"
                >
                  {rotating === key.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  Rotate now
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}