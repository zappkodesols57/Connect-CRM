import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle,
  Video,
  Image as ImageIcon,
  Layers,
  Calendar,
  Target,
  BarChart2,
  Clock,
  Star,
  MessageSquare,
  Zap,
  ArrowUpRight,
} from 'lucide-react';
import { Client, Employee } from '../types';

interface AdminDashboardProps {
  clients: Client[];
  employees: Employee[];
  onOpenClient: (client: Client) => void;
}

// Map Tailwind class → hex for inline style usage
const avatarColorMap: Record<string, string> = {
  'bg-indigo-600': '#4F46E5',
  'bg-purple-600': '#9333EA',
  'bg-pink-600': '#DB2777',
  'bg-blue-600': '#2563EB',
  'bg-teal-600': '#0D9488',
  'bg-amber-600': '#D97706',
  'bg-emerald-600': '#059669',
  'bg-cyan-600': '#0891B2',
};

const getAvatarHex = (cls: string) => avatarColorMap[cls] ?? '#6B7280';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  clients,
  employees,
  onOpenClient,
}) => {
  /* ── Month Selection State ── */
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    clients.forEach(c => {
      c.calendars?.forEach(cal => {
        set.add(`${cal.month}-${cal.year}`);
      });
    });
    if (set.size === 0) return [{ month: 'October', year: 2026 }];
    
    return Array.from(set).map(str => {
      const [month, yearStr] = str.split('-');
      return { month, year: parseInt(yearStr, 10) };
    }).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      const m = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      return m.indexOf(a.month) - m.indexOf(b.month);
    });
  }, [clients]);

  const defaultM = availableMonths.find(m => m.month === 'October' && m.year === 2026) || availableMonths[0];
  const [selectedMonth, setSelectedMonth] = useState<string>(defaultM.month);
  const [selectedYear, setSelectedYear] = useState<number>(defaultM.year);

  /* ── Aggregate stats ── */
  const allItems = clients.flatMap((c) => {
    const cal = c.calendars?.find(cal => cal.month === selectedMonth && cal.year === selectedYear);
    return cal?.items ?? [];
  });
  const totalPlanned   = allItems.length;
  const totalApproved  = allItems.filter((i) => i.status === 'APPROVED').length;
  const totalRevisions = allItems.filter((i) => i.status === 'CHANGES_REQ' || i.suggestion).length;
  const totalDraft     = allItems.filter((i) => i.status === 'DRAFT').length;
  const totalReels     = allItems.filter((i) => i.format === 'REEL').length;
  const totalPosts     = allItems.filter((i) => i.format === 'IMAGE').length;
  const totalCarousels = allItems.filter((i) => i.format === 'CAROUSEL').length;
  const approvalRate   = totalPlanned > 0 ? Math.round((totalApproved / totalPlanned) * 100) : 0;

  /* ── Employee workload ── */
  const employeeStats = employees.map((emp) => {
    const assigned = allItems.filter((i) => i.assigned_to?.id === emp.id);
    const clientsWorking = [...new Set(
      clients
        .filter((c) => {
          const cal = c.calendars?.find(cal => cal.month === selectedMonth && cal.year === selectedYear);
          return (cal?.items ?? []).some((i) => i.assigned_to?.id === emp.id);
        })
        .map((c) => c.name)
    )];
    const reels = assigned.filter((i) => i.format === 'REEL').length;
    const posts = assigned.filter((i) => i.format !== 'REEL').length;
    return { emp, assigned: assigned.length, reels, posts, clientsWorking };
  }).sort((a, b) => b.assigned - a.assigned);

  const maxAssigned = Math.max(...employeeStats.map((e) => e.assigned), 1);

  /* ── Detailed Items & Funnel Stats ── */
  const allDetailedItems = clients.flatMap((c) => {
    const cal = c.calendars?.find(cal => cal.month === selectedMonth && cal.year === selectedYear);
    return (cal?.items ?? []).map((i) => ({ ...i, clientName: c.name, clientColor: c.primary_color }));
  });

  const funnelDraft = allDetailedItems.filter(i => i.status === 'DRAFT' || i.status === 'PLANNING').length;
  const funnelInternal = allDetailedItems.filter(i => i.status === 'SUBMITTED' || i.status === 'INTERNAL_APPROVED').length;
  const funnelClientReview = allDetailedItems.filter(i => i.status === 'READY_FOR_CLIENT').length;
  const funnelRevisions = allDetailedItems.filter(i => i.status === 'CHANGES_REQ').length;
  const funnelApproved = allDetailedItems.filter(i => i.status === 'APPROVED' || i.status === 'PUBLISHED').length;

  /* ── Revision items ── */
  const revisionItems = allDetailedItems.filter((i) => i.status === 'CHANGES_REQ' || i.suggestion);

  /* ── Urgent Items ── */
  const urgentItems = allDetailedItems
    .filter(i => i.status !== 'APPROVED' && i.status !== 'PUBLISHED')
    .sort((a, b) => (a.scheduled_date || '').localeCompare(b.scheduled_date || ''))
    .slice(0, 5);

  /* ── KPI cards ── */
  const kpis = [
    {
      label: 'Active Clients',
      value: clients.length,
      sub: `${selectedMonth} ${selectedYear} retainers`,
      icon: Users,
      color: '#3B82F6',
      bg: '#EFF6FF',
    },
    {
      label: 'Posts Planned',
      value: totalPlanned,
      sub: `${approvalRate}% approved`,
      icon: Calendar,
      color: '#8B5CF6',
      bg: '#F5F3FF',
    },
    {
      label: 'Client Approvals',
      value: totalApproved,
      sub: `${totalDraft} still in draft`,
      icon: CheckCircle,
      color: '#10B981',
      bg: '#ECFDF5',
    },
    {
      label: 'Pending Revisions',
      value: totalRevisions,
      sub: totalRevisions > 0 ? 'Needs attention' : 'All clear ✓',
      icon: AlertCircle,
      color: totalRevisions > 0 ? '#EF4444' : '#10B981',
      bg: totalRevisions > 0 ? '#FEF2F2' : '#ECFDF5',
    },
  ];

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <BarChart2 className="w-5 h-5 text-blue-600" />
            <span>Agency Analytics Dashboard</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Zappkode Social Media Division · Real-time overview
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Month Selector */}
          <select
            value={`${selectedMonth}-${selectedYear}`}
            onChange={(e) => {
              const [m, y] = e.target.value.split('-');
              setSelectedMonth(m);
              setSelectedYear(parseInt(y, 10));
            }}
            className="bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
          >
            {availableMonths.map(m => (
              <option key={`${m.month}-${m.year}`} value={`${m.month}-${m.year}`}>
                {m.month} {m.year}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-700 hidden sm:inline">Live Demo Data</span>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col space-y-3"
          >
            <div className="flex items-center justify-between">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: k.bg }}
              >
                <k.icon className="w-4.5 h-4.5" style={{ color: k.color }} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-300" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-900">{k.value}</p>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{k.label}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Global Content Pipeline Funnel ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
             <Layers className="w-4 h-4 text-blue-500" />
             <span>Global Content Pipeline Funnel</span>
          </h2>
          <span className="text-[11px] font-bold text-slate-500">{totalPlanned} total items</span>
        </div>
        
        <div className="w-full flex rounded-full h-3 overflow-hidden bg-slate-100">
          {totalPlanned > 0 && (
            <>
              <div style={{ width: `${(funnelDraft/totalPlanned)*100}%` }} className="bg-slate-300 transition-all hover:opacity-80" title={`Draft/Planning: ${funnelDraft}`} />
              <div style={{ width: `${(funnelInternal/totalPlanned)*100}%` }} className="bg-blue-400 transition-all hover:opacity-80" title={`Internal Review: ${funnelInternal}`} />
              <div style={{ width: `${(funnelClientReview/totalPlanned)*100}%` }} className="bg-amber-400 transition-all hover:opacity-80" title={`Ready for Client: ${funnelClientReview}`} />
              <div style={{ width: `${(funnelRevisions/totalPlanned)*100}%` }} className="bg-rose-500 transition-all hover:opacity-80" title={`Revisions Needed: ${funnelRevisions}`} />
              <div style={{ width: `${(funnelApproved/totalPlanned)*100}%` }} className="bg-emerald-500 transition-all hover:opacity-80" title={`Approved: ${funnelApproved}`} />
            </>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-4 pt-1 text-[10px] font-bold">
           <div className="flex items-center space-x-1.5"><div className="w-2 h-2 rounded-full bg-slate-300"/><span className="text-slate-600">Planning & Draft ({funnelDraft})</span></div>
           <div className="flex items-center space-x-1.5"><div className="w-2 h-2 rounded-full bg-blue-400"/><span className="text-slate-600">Internal Review ({funnelInternal})</span></div>
           <div className="flex items-center space-x-1.5"><div className="w-2 h-2 rounded-full bg-amber-400"/><span className="text-slate-600">Client Review ({funnelClientReview})</span></div>
           <div className="flex items-center space-x-1.5"><div className="w-2 h-2 rounded-full bg-rose-500"/><span className="text-slate-600">Revisions ({funnelRevisions})</span></div>
           <div className="flex items-center space-x-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"/><span className="text-slate-600">Approved ({funnelApproved})</span></div>
        </div>
      </div>

      {/* ── Content Format Breakdown + Approval Rate ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Format Breakdown */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Content Format Breakdown</h2>
            <p className="text-[11px] text-slate-500">All clients · {selectedMonth} {selectedYear}</p>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Reels', count: totalReels, total: totalPlanned, color: '#8B5CF6', icon: Video, bg: '#F5F3FF' },
              { label: 'Posts / Images', count: totalPosts, total: totalPlanned, color: '#3B82F6', icon: ImageIcon, bg: '#EFF6FF' },
              { label: 'Carousels', count: totalCarousels, total: totalPlanned, color: '#F59E0B', icon: Layers, bg: '#FFFBEB' },
            ].map((f) => {
              const pct = totalPlanned > 0 ? Math.round((f.count / totalPlanned) * 100) : 0;
              return (
                <div key={f.label} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: f.bg }}>
                        <f.icon className="w-3.5 h-3.5" style={{ color: f.color }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{f.label}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900">{f.count} <span className="text-slate-400 font-normal">({pct}%)</span></span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: f.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Status pills */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Approved', val: totalApproved, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
              { label: 'Ready', val: allItems.filter(i => i.status === 'READY_FOR_CLIENT').length, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
              { label: 'Draft', val: totalDraft, color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200' },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl border py-2 ${s.bg}`}>
                <p className={`text-base font-extrabold ${s.color}`}>{s.val}</p>
                <p className="text-[10px] text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Per-Client Progress */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Client Content Progress</h2>
              <p className="text-[11px] text-slate-500">Reels · Posts · Approval rate vs. monthly target</p>
            </div>
            <Target className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {clients.map((client) => {
              const cal = client.calendars?.find(c => c.month === selectedMonth && c.year === selectedYear);
              const items = cal?.items ?? [];
              const reels     = items.filter((i) => i.format === 'REEL').length;
              const posts     = items.filter((i) => i.format === 'IMAGE').length;
              const carousels = items.filter((i) => i.format === 'CAROUSEL').length;
              const approved  = items.filter((i) => i.status === 'APPROVED').length;
              const approvalPct = items.length > 0 ? Math.round((approved / items.length) * 100) : 0;
              const reelPct   = client.target_reels > 0 ? Math.min(100, Math.round((reels / client.target_reels) * 100)) : 0;
              const postPct   = client.target_creatives > 0 ? Math.min(100, Math.round(((posts + carousels) / client.target_creatives) * 100)) : 0;

              return (
                <div key={client.id} className="border border-slate-100 rounded-xl p-4 hover:border-slate-300 transition cursor-pointer group" onClick={() => onOpenClient(client)}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-extrabold shadow"
                        style={{ backgroundColor: client.primary_color }}
                      >
                        {client.code.substring(0, 2)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">{client.name}</p>
                        <p className="text-[10px] text-slate-500">{client.industry} · {items.length} posts planned</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                        approvalPct >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        approvalPct >= 40 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {approvalPct}% approved
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-400 transition" />
                    </div>
                  </div>

                  {/* Mini stat row */}
                  <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                    {[
                      { label: 'Reels', val: reels, target: client.target_reels, color: '#8B5CF6' },
                      { label: 'Posts', val: posts + carousels, target: client.target_creatives, color: '#3B82F6' },
                      { label: 'Approved', val: approved, target: items.length, color: '#10B981' },
                    ].map((s) => (
                      <div key={s.label} className="bg-slate-50 rounded-lg py-2">
                        <p className="text-sm font-extrabold" style={{ color: s.color }}>{s.val}</p>
                        <p className="text-[10px] text-slate-400">{s.label} / {s.target} target</p>
                      </div>
                    ))}
                  </div>

                  {/* Progress bars */}
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-slate-500 w-16 shrink-0">Reels</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-purple-500 transition-all" style={{ width: `${reelPct}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 w-8 text-right">{reelPct}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-slate-500 w-16 shrink-0">Creatives</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-blue-500 transition-all" style={{ width: `${postPct}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 w-8 text-right">{postPct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Employee Workload ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Team Workload — ZEMS Social Media</h2>
            <p className="text-[11px] text-slate-500">Task assignment across all active clients · {selectedMonth} {selectedYear}</p>
          </div>
          <div className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200 rounded-xl px-2.5 py-1">
            <Zap className="w-3 h-3 text-emerald-600" />
            <span className="text-[10px] font-bold text-emerald-700">{employees.length} members</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {employeeStats.map(({ emp, assigned, reels, posts, clientsWorking }) => {
            const hexColor = getAvatarHex(emp.avatar_color ?? '');
            const workloadPct = maxAssigned > 0 ? Math.round((assigned / maxAssigned) * 100) : 0;
            return (
              <div
                key={emp.id}
                className="flex items-start space-x-3 p-3.5 rounded-xl border border-slate-100 hover:border-slate-300 transition bg-slate-50/60"
              >
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-extrabold shrink-0 shadow"
                  style={{ backgroundColor: hexColor }}
                >
                  {emp.first_name[0]}{emp.last_name[0]}
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900 truncate">{emp.first_name} {emp.last_name}</p>
                      <p className="text-[10px] text-slate-500">{emp.designation}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-extrabold text-slate-900">{assigned}</p>
                      <p className="text-[10px] text-slate-400">tasks</p>
                    </div>
                  </div>

                  {/* Workload bar */}
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: `${workloadPct}%`, backgroundColor: hexColor }}
                    />
                  </div>

                  {/* Pills row */}
                  <div className="flex items-center flex-wrap gap-1">
                    {reels > 0 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                        🎬 {reels} Reels
                      </span>
                    )}
                    {posts > 0 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                        🖼 {posts} Posts
                      </span>
                    )}
                    {clientsWorking.map((name) => (
                      <span key={name} className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-600 truncate max-w-[90px]">
                        {name}
                      </span>
                    ))}
                    {assigned === 0 && (
                      <span className="text-[9px] text-slate-400 italic">No tasks assigned yet</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ── Pending Revisions Feed ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-rose-500" />
                <span>Client Revision Requests</span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Items flagged by clients needing changes</p>
            </div>
            {revisionItems.length > 0 && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                {revisionItems.length} open
              </span>
            )}
          </div>

          {revisionItems.length === 0 ? (
            <div className="p-10 text-center flex-1 flex flex-col items-center justify-center">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">All clear! 🎉</p>
              <p className="text-xs text-slate-500 mt-0.5">No pending client revision requests right now.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
              {revisionItems.map((item) => (
                <div key={item.id} className="px-5 py-3.5 flex items-start space-x-3 hover:bg-rose-50/40 transition">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-rose-500" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap gap-1">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: item.clientColor }}>
                        {item.clientName}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.format === 'REEL' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        item.format === 'CAROUSEL' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {item.format}
                      </span>
                      <span className="text-[10px] text-slate-500">{item.scheduled_date}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 mt-1 truncate">{item.content_pillar}</p>
                    {item.suggestion && (
                      <p className="text-[11px] text-rose-700 mt-0.5 italic truncate">💬 "{item.suggestion}"</p>
                    )}
                  </div>
                  {item.assigned_to && (
                    <div className="shrink-0 flex items-center space-x-1.5 text-[10px] text-slate-500">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-extrabold" style={{ backgroundColor: getAvatarHex(item.assigned_to.avatar_color ?? '') }}>
                        {item.assigned_to.first_name[0]}{item.assigned_to.last_name[0]}
                      </div>
                      <span className="hidden sm:inline">{item.assigned_to.first_name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Urgent "At-Risk" Deliverables ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <span>Urgent "At-Risk" Items</span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Earliest upcoming items not yet approved</p>
            </div>
            {urgentItems.length > 0 && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                {urgentItems.length} at risk
              </span>
            )}
          </div>

          {urgentItems.length === 0 ? (
            <div className="p-10 text-center flex-1 flex flex-col items-center justify-center">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">All caught up! 🎉</p>
              <p className="text-xs text-slate-500 mt-0.5">No urgent deliverables pending approval.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
              {urgentItems.map((item) => (
                <div key={item.id} className="px-5 py-3.5 flex items-start space-x-3 hover:bg-orange-50/40 transition">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap gap-1">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: item.clientColor }}>
                        {item.clientName}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {item.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 mt-1.5 truncate">{item.content_pillar || item.caption}</p>
                    <div className="flex items-center space-x-1.5 mt-1 text-[10px] font-bold text-orange-600">
                      <Clock className="w-3 h-3" />
                      <span>Due: {item.scheduled_date}</span>
                    </div>
                  </div>
                  {item.assigned_to && (
                    <div className="shrink-0 flex flex-col items-end space-y-1">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-extrabold" style={{ backgroundColor: getAvatarHex(item.assigned_to.avatar_color ?? '') }}>
                        {item.assigned_to.first_name[0]}{item.assigned_to.last_name[0]}
                      </div>
                      <span className="text-[9px] text-slate-400">{item.assigned_to.first_name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Quick Target Summary ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Star className="w-4 h-4 text-amber-500" />
            <span>Monthly Targets — All Clients</span>
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Contracted deliverables vs. current planned count</p>
        </div>

        <div className="overflow-x-auto max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-white z-10 shadow-sm">
              <tr className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wide border-b border-slate-100">
                <th className="py-2 pr-4">Client</th>
                <th className="py-2 pr-4 text-center">Target Reels</th>
                <th className="py-2 pr-4 text-center">Target Creatives</th>
                <th className="py-2 pr-4 text-center">Target Stories</th>
                <th className="py-2 pr-4 text-center">Planned</th>
                <th className="py-2 text-center">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {clients.map((client) => {
                const cal = client.calendars?.find(c => c.month === selectedMonth && c.year === selectedYear);
                const items  = cal?.items ?? [];
                const reels  = items.filter((i) => i.format === 'REEL').length;
                const posts  = items.filter((i) => i.format !== 'REEL').length;
                const health = items.length >= (client.target_reels + client.target_creatives) * 0.6
                  ? 'On Track' : items.length > 0 ? 'In Progress' : 'Not Started';
                return (
                  <tr key={client.id} className="hover:bg-slate-50 transition cursor-pointer" onClick={() => onOpenClient(client)}>
                    <td className="py-3 pr-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: client.primary_color }} />
                        <span className="font-semibold text-slate-800 truncate max-w-[140px]">{client.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-center">
                      <span className="font-bold text-purple-600">{reels}</span>
                      <span className="text-slate-400"> / {client.target_reels}</span>
                    </td>
                    <td className="py-3 pr-4 text-center">
                      <span className="font-bold text-blue-600">{posts}</span>
                      <span className="text-slate-400"> / {client.target_creatives}</span>
                    </td>
                    <td className="py-3 pr-4 text-center">
                      <span className="text-slate-500">{client.target_stories}</span>
                    </td>
                    <td className="py-3 pr-4 text-center font-bold text-slate-800">{items.length}</td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        health === 'On Track'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : health === 'In Progress'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {health === 'On Track' ? '✓ ' : ''}{health}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
