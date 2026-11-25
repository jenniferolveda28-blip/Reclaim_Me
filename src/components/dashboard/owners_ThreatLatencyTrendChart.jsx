import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import { subDays, format, startOfDay } from 'date-fns';
import { Activity, AlertTriangle, Gauge, ShieldAlert } from 'lucide-react';

const RANGE_DAYS = 14;
const THREAT_WEIGHT = { none: 0, low: 1, medium: 2, high: 3, critical: 4 };

const TrendTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload || {};
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs">
      <p className="text-slate-400 mb-2 font-semibold">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value === null || p.value === undefined ? 'No data' : p.value}
          {p.dataKey === 'latency' ? ' ms' : ''}
        </p>
      ))}
      {point.highSeverity > 0 && (
        <p className="text-red-400 mt-1">High/critical events: {point.highSeverity}</p>
      )}
      {point.spike && <p className="text-amber-400 mt-1 font-semibold">⚠ Spike detected</p>}
    </div>
  );
};

export default function OwnersThreatLatencyTrendChart() {
  const { data: securityLogs = [], isLoading: logsLoading } = useQuery({
    queryKey: ['threat_latency_logs'],
    queryFn: () => base44.entities.SecurityLog.list('-created_date', 500),
  });

  const { data: requests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ['threat_latency_requests'],
    queryFn: () => base44.entities.ProtectedRequest.list('-created_date', 500),
  });

  const chartData = useMemo(() => {
    const days = Array.from({ length: RANGE_DAYS }, (_, i) => {
      const date = subDays(new Date(), RANGE_DAYS - 1 - i);
      const dayStart = startOfDay(date).getTime();
      const dayEnd = dayStart + 86400000;

      const dayLogs = securityLogs.filter((l) => {
        const t = new Date(l.created_date).getTime();
        return t >= dayStart && t < dayEnd;
      });

      const dayRequests = requests.filter((r) => {
        const t = new Date(r.created_date).getTime();
        return t >= dayStart && t < dayEnd && typeof r.latency_ms === 'number';
      });

      const threatIndex = dayLogs.length
        ? Math.round(
            (dayLogs.reduce((sum, l) => sum + (THREAT_WEIGHT[l.threat_level] ?? 0), 0) /
              dayLogs.length /
              4) *
              100
          )
        : 0;

      const latency = dayRequests.length
        ? Math.round(dayRequests.reduce((s, r) => s + r.latency_ms, 0) / dayRequests.length)
        : null;

      return {
        day: format(date, 'MMM d'),
        threatIndex,
        latency,
        highSeverity: dayLogs.filter((l) => l.threat_level === 'high' || l.threat_level === 'critical').length,
        events: dayLogs.length,
      };
    });

    const latencyPoints = days.filter((d) => d.latency !== null);
    const avgLatency = latencyPoints.length
      ? latencyPoints.reduce((s, d) => s + d.latency, 0) / latencyPoints.length
      : 0;

    return days.map((d) => ({
      ...d,
      spike:
        (d.latency !== null && avgLatency > 0 && d.latency > avgLatency * 1.5) ||
        d.threatIndex >= 50,
    }));
  }, [securityLogs, requests]);

  const latencyValues = chartData.filter((d) => d.latency !== null).map((d) => d.latency);
  const avgLatency = latencyValues.length
    ? Math.round(latencyValues.reduce((a, b) => a + b, 0) / latencyValues.length)
    : null;
  const peakLatency = latencyValues.length ? Math.max(...latencyValues) : null;
  const highSeverityTotal = chartData.reduce((s, d) => s + d.highSeverity, 0);
  const spikeDays = chartData.filter((d) => d.spike).length;
  const hasData = securityLogs.length > 0 || requests.length > 0;

  const stats = [
    { label: 'Avg Latency', value: avgLatency !== null ? `${avgLatency}ms` : '—', icon: Gauge, color: 'text-cyan-400' },
    { label: 'Peak Latency', value: peakLatency !== null ? `${peakLatency}ms` : '—', icon: Activity, color: 'text-amber-400' },
    { label: `High/Critical (${RANGE_DAYS}d)`, value: highSeverityTotal, icon: ShieldAlert, color: 'text-red-400' },
    { label: 'Spike Days', value: spikeDays, icon: AlertTriangle, color: 'text-orange-400' },
  ];

  return (
    <Card className="multi-layer-card card-layer-threat rounded-xl border">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-base flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          Threat Levels &amp; System Latency — {RANGE_DAYS} Day Trend
          <span className="ml-2 text-xs font-normal text-slate-500">
            spikes flagged when latency runs 50% above average or threat level hits high
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 flex items-center gap-3">
              <s.icon className={`w-6 h-6 ${s.color}`} />
              <div>
                <div className={`text-lg font-black ${s.color}`}>{s.value}</div>
                <div className="text-slate-500 text-xs">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {logsLoading || requestsLoading ? (
          <div className="h-[260px] flex items-center justify-center text-slate-500 text-sm">
            Loading trend data…
          </div>
        ) : !hasData ? (
          <div className="h-[260px] flex flex-col items-center justify-center text-center">
            <Activity className="w-12 h-12 text-slate-600 mb-3" />
            <p className="text-slate-400 text-sm">
              No security events or routed requests yet — the trend appears as activity is logged.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="threatTrendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis
                yAxisId="threat"
                domain={[0, 100]}
                tick={{ fill: '#64748b', fontSize: 10 }}
                label={{ value: 'Threat Index', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
              />
              <YAxis
                yAxisId="latency"
                orientation="right"
                unit="ms"
                tick={{ fill: '#64748b', fontSize: 10 }}
                label={{ value: 'Latency (ms)', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 10 }}
              />
              <Tooltip content={<TrendTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              {avgLatency !== null && (
                <ReferenceLine
                  yAxisId="latency"
                  y={avgLatency}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  label={{ value: `Avg ${avgLatency}ms`, fill: '#f59e0b', fontSize: 10 }}
                />
              )}
              <Area
                yAxisId="threat"
                type="monotone"
                dataKey="threatIndex"
                name="Threat Level Index"
                stroke="#ef4444"
                fill="url(#threatTrendGrad)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="latency"
                type="monotone"
                dataKey="latency"
                name="Avg Latency"
                stroke="#22d3ee"
                strokeWidth={2}
                connectNulls
                dot={(props) => {
                  const { cx, cy, payload, index } = props;
                  if (payload?.latency === null || payload?.latency === undefined) return null;
                  return (
                    <circle
                      key={`latency-dot-${index}`}
                      cx={cx}
                      cy={cy}
                      r={payload.spike ? 5 : 3}
                      fill={payload.spike ? '#f59e0b' : '#22d3ee'}
                      stroke={payload.spike ? '#fbbf24' : 'none'}
                    />
                  );
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}