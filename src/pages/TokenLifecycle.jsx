import React, { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { KeyRound, Clock, Activity, CalendarClock } from 'lucide-react';
import { PortalHeader, StatTile, SearchInput, FilterChips, EmptyState, LoadingRow } from '@/components/common/shared_PortalUI';

const STATUS_FILTERS = [
  { id: 'all', label: 'All keys' },
  { id: 'active', label: 'Active' },
  { id: 'expiring_soon', label: 'Expiring soon' },
  { id: 'expired', label: 'Expired' },
  { id: 'revoked', label: 'Revoked' },
];

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

const fmt = (value) => (value ? new Date(value).toLocaleString() : '—');

export default function TokenLifecycle() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    const load = async () => {
      const page = await base44.entities.CipherPass.list({ sort: '-created_date', limit: 200 });
      setKeys(page.items || []);
      setLoading(false);
    };
    load();
  }, []);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return keys.filter((k) => {
      const matchesStatus = status === 'all' || k.status === status;
      const matchesQuery =
        !term ||
        [k.key_name, k.endpoint_group_id, k.description]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(term));
      return matchesStatus && matchesQuery;
    });
  }, [keys, query, status]);

  const totalUsage = keys.reduce((sum, k) => sum + Number(k.usage_count || 0), 0);

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto text-slate-100">
      <PortalHeader
        badge="CIPHERPASS · TOKEN LIFECYCLE"
        title="Token Lifecycle Manager"
        description="Every CipherPass key with its rotation interval, usage count and expiration date, so nothing quietly outlives its policy."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatTile icon={KeyRound} label="Keys in lifecycle" value={keys.length} />
        <StatTile icon={Activity} label="Active" value={keys.filter((k) => k.status === 'active').length} tone="text-emerald-400" />
        <StatTile icon={Clock} label="Expiring or expired" value={keys.filter((k) => k.status === 'expiring_soon' || k.status === 'expired').length} tone="text-amber-400" />
        <StatTile icon={CalendarClock} label="Total uses recorded" value={totalUsage} tone="text-purple-400" />
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Search keys or endpoint groups…" />
        <FilterChips options={STATUS_FILTERS} value={status} onChange={setStatus} />
      </div>

      {loading ? (
        <LoadingRow label="Loading token lifecycle…" />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={KeyRound}
          title={keys.length === 0 ? 'No CipherPass keys yet' : 'No keys match this filter'}
          hint={keys.length === 0 ? 'Keys appear here when a protected endpoint group is created.' : undefined}
        />
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-700">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 text-slate-400">
                <tr>
                  <th className="px-3 py-2 font-medium">Key</th>
                  <th className="px-3 py-2 font-medium">Endpoint group</th>
                  <th className="px-3 py-2 font-medium">Rotation</th>
                  <th className="px-3 py-2 font-medium">Last rotated</th>
                  <th className="px-3 py-2 font-medium">Expires</th>
                  <th className="px-3 py-2 font-medium">Uses</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((key) => (
                  <tr key={key.id} className="border-t border-slate-800">
                    <td className="px-3 py-2 text-slate-200">{key.key_name || '—'}</td>
                    <td className="px-3 py-2 text-slate-400">{key.endpoint_group_id || '—'}</td>
                    <td className="px-3 py-2 text-slate-400">{intervalLabel(key.rotation_interval)}</td>
                    <td className="px-3 py-2 text-slate-400">{fmt(key.last_rotated)}</td>
                    <td className="px-3 py-2 text-slate-400">{fmt(key.expires_at)}</td>
                    <td className="px-3 py-2 text-slate-200">{key.usage_count || 0}</td>
                    <td className="px-3 py-2">
                      <Badge variant="outline" className={`text-[9px] ${STATUS_STYLE[key.status] || 'border-slate-600 text-slate-400'}`}>
                        {key.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-2">
            {visible.map((key) => (
              <div key={key.id} className="rounded-xl border border-slate-700 bg-slate-800/40 p-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-slate-100 truncate">{key.key_name || 'Unnamed key'}</h3>
                  <Badge variant="outline" className={`text-[9px] shrink-0 ${STATUS_STYLE[key.status] || 'border-slate-600 text-slate-400'}`}>
                    {key.status}
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500">Group {key.endpoint_group_id || '—'}</p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] text-slate-400">
                  <span>Rotates every {intervalLabel(key.rotation_interval)}</span>
                  <span>Uses {key.usage_count || 0}</span>
                  <span>Last {fmt(key.last_rotated)}</span>
                  <span>Expires {fmt(key.expires_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}