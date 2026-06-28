import { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from 'recharts';
import { Users, Clock, TrendingUp, Calendar, Monitor, Smartphone, Tablet, Globe } from 'lucide-react';
import adminApi from '../../services/adminApi';
import { AdminCard } from '../../components/admin/AdminUi';

const DEVICE_ICONS = { desktop: Monitor, mobile: Smartphone, tablet: Tablet };
const DEVICE_COLORS = { desktop: '#6366f1', mobile: '#22c55e', tablet: '#f59e0b' };
const REF_COLORS = { direct: '#6366f1', search: '#22c55e', social: '#f59e0b', other: '#71717a' };

const CHART_COLOR = '#6366f1';
const CHART_GRID  = '#2a2a3a';

function StatCard({ icon: Icon, label, value, sub, color = 'text-accent-light' }) {
  return (
    <div className="glass-panel p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
        </div>
        <div className={`p-2 rounded-lg icon-box ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

function fmtDuration(secs) {
  if (!secs) return '0s';
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m ${secs % 60}s`;
}

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-raised border border-surface-border rounded-lg px-3 py-2 text-xs">
      <p className="text-muted-foreground mb-0.5">{label}</p>
      <p className="font-semibold text-foreground">{payload[0].value} visitors</p>
    </div>
  );
};

export default function AdminAnalyticsPage() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getAnalytics()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-muted-foreground">Loading analytics…</div>;
  if (!data)   return <div className="p-8 text-danger">Failed to load analytics.</div>;

  const { overview, deviceBreakdown, browserBreakdown, referrerBreakdown, topSections, chartData, recent } = data;

  // Format chart dates to short form
  const chart = chartData.map((d) => ({ ...d, label: fmtDate(d.date) }));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold text-foreground">Analytics</h1>

      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}     label="Total Visitors"   value={overview.total.toLocaleString()} />
        <StatCard icon={Calendar}  label="Today"            value={overview.today} color="text-success-fg" />
        <StatCard icon={TrendingUp} label="This Week"       value={overview.thisWeek} color="text-warning-fg" />
        <StatCard icon={Clock}     label="Avg Time on Page" value={fmtDuration(overview.avgDuration)} color="text-accent-light" />
      </div>

      {/* Visitors over time */}
      <AdminCard title="Visitors — last 30 days">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chart} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="visitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={CHART_COLOR} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CHART_COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
            <XAxis dataKey="label" tick={{ fill: '#a1a1aa', fontSize: 10 }} tickLine={false} axisLine={false} interval={4} />
            <YAxis tick={{ fill: '#a1a1aa', fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="count" stroke={CHART_COLOR} strokeWidth={2} fill="url(#visitGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </AdminCard>

      {/* Device + Referrer row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Device breakdown */}
        <AdminCard title="Devices">
          <div className="space-y-3 mt-2">
            {deviceBreakdown.map((d) => {
              const Icon = DEVICE_ICONS[d.name] || Monitor;
              const pct  = overview.total ? Math.round((d.value / overview.total) * 100) : 0;
              const color = DEVICE_COLORS[d.name] || '#6366f1';
              return (
                <div key={d.name} className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="capitalize text-foreground">{d.name}</span>
                      <span className="text-muted-foreground">{d.value} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface-overlay overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </AdminCard>

        {/* Referrer breakdown */}
        <AdminCard title="Traffic Sources">
          <div className="space-y-3 mt-2">
            {referrerBreakdown.map((r) => {
              const pct   = overview.total ? Math.round((r.value / overview.total) * 100) : 0;
              const color = REF_COLORS[r.name] || '#71717a';
              return (
                <div key={r.name} className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="capitalize text-foreground">{r.name}</span>
                      <span className="text-muted-foreground">{r.value} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface-overlay overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </AdminCard>
      </div>

      {/* Browser + Top sections row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Browser breakdown */}
        <AdminCard title="Browsers">
          <div className="space-y-2 mt-2">
            {browserBreakdown.map((b, i) => (
              <div key={b.name} className="flex items-center justify-between text-sm">
                <span className="text-foreground/90">{b.name}</span>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-1.5 rounded-full bg-surface-overlay overflow-hidden">
                    <div className="h-full rounded-full bg-accent"
                      style={{ width: `${Math.round((b.value / (browserBreakdown[0]?.value || 1)) * 100)}%` }} />
                  </div>
                  <span className="text-muted-foreground text-xs w-8 text-right">{b.value}</span>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Top sections */}
        <AdminCard title="Top Sections Viewed">
          <div className="space-y-2 mt-2">
            {topSections.length === 0 && (
              <p className="text-xs text-muted-foreground">No section data yet.</p>
            )}
            {topSections.map((s) => (
              <div key={s.slug} className="flex items-center justify-between text-sm">
                <span className="font-mono text-xs text-foreground/90">{s.slug}</span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{s.views} views</span>
                  <span>~{fmtDuration(s.avgDuration)} avg</span>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      {/* Recent visitors */}
      <AdminCard title="Recent Visitors">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-surface-border text-muted-foreground">
                <th className="text-left py-2 pr-4 font-medium">Session</th>
                <th className="text-left py-2 pr-4 font-medium">Device</th>
                <th className="text-left py-2 pr-4 font-medium">Browser / OS</th>
                <th className="text-left py-2 pr-4 font-medium">Source</th>
                <th className="text-left py-2 pr-4 font-medium">Time</th>
                <th className="text-left py-2 font-medium">Sections</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((v) => (
                <tr key={v.sessionId} className="border-b border-surface-border/50 hover:bg-surface-overlay transition-colors">
                  <td className="py-2 pr-4 font-mono text-muted-foreground truncate max-w-[100px]">{v.sessionId.slice(-8)}</td>
                  <td className="py-2 pr-4 capitalize text-foreground/90">{v.device}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{v.browser} / {v.os}</td>
                  <td className="py-2 pr-4">
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                      v.referrerType === 'direct'  ? 'bg-accent-bg text-accent-light' :
                      v.referrerType === 'social'  ? 'bg-warning-bg text-warning-fg' :
                      v.referrerType === 'search'  ? 'bg-success-bg text-success-fg' :
                      'bg-surface-overlay text-muted-foreground'
                    }`}>
                      {v.referrerType}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">{fmtDuration(v.duration)}</td>
                  <td className="py-2 text-muted-foreground">{v.sections?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {recent.length === 0 && <p className="text-xs text-muted-foreground py-4 text-center">No visitors yet.</p>}
        </div>
      </AdminCard>
    </div>
  );
}
