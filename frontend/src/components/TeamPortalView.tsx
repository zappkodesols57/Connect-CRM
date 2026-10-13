import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  Image as ImageIcon,
  Layers,
  Upload,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  MessageSquare,
  Search,
  Filter,
  Check,
  Send,
  Plus,
  Briefcase,
  ExternalLink,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { Client, CalendarItem, Employee, AdHocTask, ItemStatus, CalendarItemNote } from '../types';
import { INITIAL_EMPLOYEES } from '../data/mockData';

interface TeamPortalViewProps {
  currentEmployee: Employee;
  employees?: Employee[];
  clients: Client[];
  adHocTasks: AdHocTask[];
  onUpdateCalendarItem: (item: Partial<CalendarItem>) => void;
  onUpdateAdHocTask: (task: AdHocTask) => void;
  onCreateAdHocTask: (task: Omit<AdHocTask, 'id' | 'created_at'>) => void;
  onPreviewMedia: (type: 'image' | 'reel' | 'carousel', url?: string | null, title?: string) => void;
  onSignOut: () => void;
  onOpenChat?: (clientName?: string) => void;
  onOpenShoots?: () => void;
  onOpenGrowth?: () => void;
}

export const TeamPortalView: React.FC<TeamPortalViewProps> = ({
  currentEmployee,
  employees,
  clients,
  adHocTasks,
  onUpdateCalendarItem,
  onUpdateAdHocTask,
  onCreateAdHocTask,
  onPreviewMedia,
  onSignOut,
  onOpenChat,
  onOpenShoots,
  onOpenGrowth,
}) => {
  const availableEmployees = employees || INITIAL_EMPLOYEES;
  const isManager = Boolean(
    currentEmployee.can_assign_tasks ??
    currentEmployee.is_manager ??
    currentEmployee.designation?.toLowerCase().includes('manager')
  );
  const canAssignTasks = isManager;
  const [activeTab, setActiveTab] = useState<'deliverables' | 'adhoc' | 'calendar' | 'attendance'>('deliverables');
  const [timeScope, setTimeScope] = useState<'TODAY' | 'ALL'>('ALL');
  const [clientFilter, setClientFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected client for read-only calendar view
  const [selectedCalendarClientId, setSelectedCalendarClientId] = useState<number>(clients[0]?.id || 1);

  // Note modal state for internal team queries on calendar dates
  const [noteModalItem, setNoteModalItem] = useState<{ item: CalendarItem; clientName: string } | null>(null);
  const [queryNoteText, setQueryNoteText] = useState('');

  // Upload modal state
  const [uploadModalItem, setUploadModalItem] = useState<{
    item: CalendarItem;
    clientName: string;
  } | null>(null);
  const [assetUrlInput, setAssetUrlInput] = useState('');
  const [internalNoteInput, setInternalNoteInput] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // New ad-hoc task modal state
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskClient, setNewTaskClient] = useState<number>(clients[0]?.id || 1);
  const [newTaskPriority, setNewTaskPriority] = useState<'HIGH' | 'MEDIUM' | 'NORMAL'>('NORMAL');
  const [newTaskDue, setNewTaskDue] = useState('2026-10-15');
  const [newTaskReferenceUrl, setNewTaskReferenceUrl] = useState('');
  const [assignedTeammateId, setAssignedTeammateId] = useState<number>(INITIAL_EMPLOYEES[1]?.id || 1600);

  // Attendance state
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [clockInTime, setClockInTime] = useState('09:30 AM');

  // Gather all calendar items assigned to this employee
  const myAssignedItems: { item: CalendarItem; client: Client }[] = [];
  clients.forEach((c) => {
    c.calendars?.forEach((cal) => {
      cal.items?.forEach((it) => {
        if (it.assigned_to && it.assigned_to.id === currentEmployee.id) {
          myAssignedItems.push({ item: it, client: c });
        }
      });
    });
  });

  // KPI calculations
  const totalTasks = myAssignedItems.length;
  const revisionsCount = myAssignedItems.filter(
    (x) => x.item.status === 'CHANGES_REQ' || Boolean(x.item.suggestion)
  ).length;
  const approvedCount = myAssignedItems.filter(
    (x) => x.item.status === 'APPROVED' || x.item.status === 'PUBLISHED'
  ).length;
  const submittedCount = myAssignedItems.filter(
    (x) => x.item.status === 'SUBMITTED' || x.item.status === 'INTERNAL_APPROVED'
  ).length;

  // Filtered deliverables
  const filteredDeliverables = myAssignedItems.filter(({ item, client }) => {
    if (clientFilter !== 'ALL' && client.slug !== clientFilter) return false;
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'REVISIONS' && !(item.status === 'CHANGES_REQ' || item.suggestion)) return false;
      if (statusFilter === 'SUBMITTED' && item.status !== 'SUBMITTED' && item.status !== 'INTERNAL_APPROVED') return false;
      if (statusFilter === 'APPROVED' && item.status !== 'APPROVED' && item.status !== 'PUBLISHED') return false;
      if (statusFilter === 'PENDING' && (item.status === 'APPROVED' || item.status === 'SUBMITTED')) return false;
    }
    if (priorityFilter !== 'ALL' && item.priority !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTopic = item.content_pillar?.toLowerCase().includes(q);
      const matchBrief = item.visual_brief?.toLowerCase().includes(q);
      const matchScript = item.reel_bytes_script?.toLowerCase().includes(q);
      const matchClient = client.name.toLowerCase().includes(q);
      if (!matchTopic && !matchBrief && !matchScript && !matchClient) return false;
    }
    return true;
  });

  // Sort: High priority first, then revisions, then scheduled_date
  filteredDeliverables.sort((a, b) => {
    const aRev = a.item.status === 'CHANGES_REQ' || Boolean(a.item.suggestion);
    const bRev = b.item.status === 'CHANGES_REQ' || Boolean(b.item.suggestion);
    if (aRev && !bRev) return -1;
    if (!aRev && bRev) return 1;

    const prioWeight: Record<string, number> = { HIGH: 3, MEDIUM: 2, NORMAL: 1 };
    const aP = prioWeight[a.item.priority || 'NORMAL'] || 1;
    const bP = prioWeight[b.item.priority || 'NORMAL'] || 1;
    if (aP !== bP) return bP - aP;

    return a.item.scheduled_date.localeCompare(b.item.scheduled_date);
  });

  // My adhoc tasks
  const myAdHocTasks = adHocTasks.filter((t) => t.assigned_to.id === currentEmployee.id);

  // Submit asset handler
  const handleOpenUpload = (item: CalendarItem, clientName: string) => {
    setUploadModalItem({ item, clientName });
    setAssetUrlInput(item.uploaded_asset_url || item.media_url || '');
    setInternalNoteInput(item.internal_notes || '');
    setUploadSuccess(false);
  };

  const handleSaveUploadedAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadModalItem) return;

    onUpdateCalendarItem({
      id: uploadModalItem.item.id,
      uploaded_asset_url: assetUrlInput.trim() || uploadModalItem.item.media_url,
      internal_notes: internalNoteInput.trim() || null,
      status: 'SUBMITTED', // Submits to Social Media Manager / Admin for internal approval!
    });

    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setUploadModalItem(null);
    }, 1200);
  };

  // Toggle ad-hoc task status
  const handleToggleAdHocStatus = (task: AdHocTask) => {
    const nextStatus = task.status === 'TODO' ? 'IN_PROGRESS' : task.status === 'IN_PROGRESS' ? 'DONE' : 'TODO';
    onUpdateAdHocTask({ ...task, status: nextStatus });
  };

  // Create new ad-hoc task
  const handleCreateAdHocTask = (e: React.FormEvent) => {
    e.preventDefault();
    const cl = clients.find((c) => c.id === newTaskClient);
    const assignedEmp = isManager
      ? availableEmployees.find((emp) => emp.id === assignedTeammateId) || currentEmployee
      : currentEmployee;

    onCreateAdHocTask({
      title: newTaskTitle,
      description: newTaskDesc,
      client_id: cl?.id,
      client_name: cl?.name,
      assigned_to: assignedEmp,
      assigned_by: `${currentEmployee.first_name} ${currentEmployee.last_name} (${isManager ? 'Manager' : 'Team'})`,
      due_date: newTaskDue,
      priority: newTaskPriority,
      status: 'TODO',
      reference_url: newTaskReferenceUrl || null,
    });
    setIsNewTaskModalOpen(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskReferenceUrl('');
  };

  // Add internal query/note on a calendar date
  const handleSaveQueryNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteModalItem || !queryNoteText.trim()) return;

    const newNote: CalendarItemNote = {
      id: Date.now(),
      author: `${currentEmployee.first_name} ${currentEmployee.last_name}`,
      role: isManager ? 'MANAGER' : 'EMPLOYEE',
      text: queryNoteText.trim(),
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const existingNotes = noteModalItem.item.team_notes || [];
    onUpdateCalendarItem({
      id: noteModalItem.item.id,
      calendar: noteModalItem.item.calendar,
      team_notes: [...existingNotes, newNote],
    });

    setQueryNoteText('');
    setNoteModalItem(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Employee Navigation Bar */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* User Profile */}
          <div className="flex items-center space-x-3.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-extrabold text-sm shadow-md"
              style={{ backgroundColor: currentEmployee.avatar_color || '#4F46E5' }}
            >
              {currentEmployee.first_name[0]}
              {currentEmployee.last_name[0]}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-base tracking-tight text-white">
                  {currentEmployee.first_name} {currentEmployee.last_name}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {currentEmployee.designation}
                </span>
                {canAssignTasks && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/25 text-purple-200 border border-purple-400/40">
                    👑 Manager (Task Delegation Rights)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 flex items-center space-x-2">
                <span>{currentEmployee.team_group}</span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{isClockedIn ? `Clocked in at ${clockInTime}` : 'Clocked Out'}</span>
                </span>
              </p>
            </div>
          </div>

          {/* Action Buttons: Chat, Shoots, Growth, Clock In & Sign Out */}
          <div className="flex items-center space-x-2 flex-wrap gap-1.5">
            {onOpenChat && (
              <button
                type="button"
                onClick={() => onOpenChat()}
                className="px-3 py-1.5 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Team Chat</span>
              </button>
            )}

            {onOpenShoots && (
              <button
                type="button"
                onClick={onOpenShoots}
                className="px-3 py-1.5 bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Shoots</span>
              </button>
            )}

            {onOpenGrowth && (
              <button
                type="button"
                onClick={onOpenGrowth}
                className="px-3 py-1.5 bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
              >
                <span>📈 Growth</span>
              </button>
            )}

            <button
              onClick={() => setIsClockedIn(!isClockedIn)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer border ${
                isClockedIn
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800 hover:bg-emerald-900/80'
                  : 'bg-amber-950/80 text-amber-300 border-amber-800 hover:bg-amber-900/80'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isClockedIn ? 'Clock Out' : 'Clock In Now'}</span>
            </button>

            <button
              onClick={onSignOut}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer border border-slate-700"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-2 border-t border-slate-800/80 pt-1">
          <button
            onClick={() => setActiveTab('deliverables')}
            className={`py-2.5 px-4 font-bold text-xs border-b-2 transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'deliverables'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Monthly Deliverables</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 font-mono text-blue-400">
              {totalTasks}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('adhoc')}
            className={`py-2.5 px-4 font-bold text-xs border-b-2 transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'adhoc'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Operational & Ad-hoc Tasks</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 font-mono text-amber-400">
              {myAdHocTasks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`py-2.5 px-4 font-bold text-xs border-b-2 transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'calendar'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>📅 Read-Only Calendar & Notes</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Assigned Tasks</span>
              <span className="text-2xl font-black text-slate-900">{totalTasks}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Submitted / Review</span>
              <span className="text-2xl font-black text-indigo-600">{submittedCount}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Upload className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Revisions Requested</span>
              <span className="text-2xl font-black text-rose-600">{revisionsCount}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Approved / Ready</span>
              <span className="text-2xl font-black text-emerald-600">{approvedCount}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* TAB 1: DELIVERABLES */}
        {activeTab === 'deliverables' && (
          <div className="space-y-4">
            {/* Filter and Search Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your deliverables, scripts, or clients..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Client filter */}
                <select
                  value={clientFilter}
                  onChange={(e) => setClientFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none"
                >
                  <option value="ALL">All Clients</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>

                {/* Priority filter */}
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="HIGH">🔴 High Priority</option>
                  <option value="MEDIUM">🟡 Medium Priority</option>
                  <option value="NORMAL">🟢 Normal Priority</option>
                </select>

                {/* Status filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="REVISIONS">⚠️ Revisions Needed</option>
                  <option value="SUBMITTED">⏳ Submitted for Review</option>
                  <option value="APPROVED">✅ Approved</option>
                  <option value="PENDING">📋 Pending Execution</option>
                </select>
              </div>
            </div>

            {/* Deliverables Card Grid */}
            {filteredDeliverables.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-sm">
                No deliverables match your filter criteria. Great job!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDeliverables.map(({ item, client }) => {
                  const hasRevision = item.status === 'CHANGES_REQ' || Boolean(item.suggestion);
                  const isSubmitted = item.status === 'SUBMITTED' || item.status === 'INTERNAL_APPROVED';
                  const isApproved = item.status === 'APPROVED' || item.status === 'PUBLISHED';

                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between shadow-xs hover:shadow-md ${
                        hasRevision
                          ? 'border-rose-300 ring-2 ring-rose-100 bg-rose-50/20'
                          : isApproved
                          ? 'border-emerald-200'
                          : 'border-slate-200'
                      }`}
                    >
                      {/* Top Row: Client & Scheduled Date */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: client.primary_color }}
                            />
                            <span className="font-extrabold text-xs text-slate-900">{client.name}</span>
                            {item.brand && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                {item.brand}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold">
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                              Oct {item.scheduled_date.split('-')[2]} · {item.scheduled_time || '11:00 AM'}
                            </span>
                          </div>
                        </div>

                        {/* Format, Category & Priority Badges */}
                        <div className="flex items-center space-x-1.5 flex-wrap gap-1 mb-2.5">
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              item.format === 'REEL'
                                ? 'bg-purple-100 text-purple-800'
                                : item.format === 'CAROUSEL'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {item.format === 'REEL' ? 'REEL' : item.format === 'CAROUSEL' ? 'CAROUSEL' : 'POST / SHARE'}
                          </span>

                          {item.post_category === 'EXTRA' && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                              ⚡ EXTRA POST
                            </span>
                          )}

                          {item.priority === 'HIGH' && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                              🔴 HIGH PRIORITY
                            </span>
                          )}

                          {/* Pipeline Status Pill */}
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                              isApproved
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : hasRevision
                                ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                                : isSubmitted
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {isApproved
                              ? '✅ APPROVED'
                              : hasRevision
                              ? '⚠️ CHANGES REQUESTED'
                              : isSubmitted
                              ? '⏳ MANAGER REVIEW'
                              : '📋 IN PROGRESS'}
                          </span>
                        </div>

                        {/* Title / Content Pillar */}
                        <h3 className="font-extrabold text-sm text-slate-900 leading-snug mb-1.5">
                          {item.content_pillar}
                        </h3>

                        {item.special_day && (
                          <p className="text-[11px] text-indigo-600 font-semibold mb-2">
                            ★ Occasion: {item.special_day}
                          </p>
                        )}

                        {/* Visual brief */}
                        {item.visual_brief && (
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 mb-2">
                            <span className="font-bold text-slate-800 block text-[11px] mb-0.5">
                              Visual Direction:
                            </span>
                            <p className="line-clamp-3 leading-relaxed">{item.visual_brief}</p>
                          </div>
                        )}

                        {/* Reel bytes script */}
                        {item.reel_bytes_script && (
                          <div className="bg-purple-50/60 p-2.5 rounded-xl border border-purple-200 text-xs text-purple-900 mb-2">
                            <span className="font-bold text-purple-800 block text-[11px] mb-0.5">
                              Reel Hook & Script:
                            </span>
                            <p className="italic line-clamp-3 leading-relaxed">"{item.reel_bytes_script}"</p>
                          </div>
                        )}

                        {/* Client Feedback Banner (Revision Loop) */}
                        {item.suggestion && (
                          <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-900 mb-2 flex items-start space-x-2">
                            <MessageSquare className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-rose-800 block">Client Revision Requested:</span>
                              <p className="mt-0.5 leading-relaxed font-medium">"{item.suggestion}"</p>
                            </div>
                          </div>
                        )}

                        {/* Uploaded Asset preview if any */}
                        {item.uploaded_asset_url && (
                          <div className="flex items-center space-x-2 text-[11px] text-blue-600 font-bold bg-blue-50/50 p-2 rounded-xl border border-blue-100 mb-2">
                            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                            <span className="truncate">Uploaded: {item.uploaded_asset_url}</span>
                          </div>
                        )}
                      </div>

                      {/* Bottom Action Buttons */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                        <button
                          onClick={() =>
                            onPreviewMedia(
                              item.media_type,
                              item.uploaded_asset_url || item.media_url,
                              `${client.name} - ${item.content_pillar}`
                            )
                          }
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>Preview</span>
                        </button>

                        <button
                          onClick={() => handleOpenUpload(item, client.name)}
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-xs ${
                            hasRevision
                              ? 'bg-rose-600 hover:bg-rose-500 text-white'
                              : 'bg-blue-600 hover:bg-blue-500 text-white'
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{hasRevision ? 'Re-upload Revision' : item.uploaded_asset_url ? 'Update Asset' : 'Upload Creative'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AD-HOC OPERATIONAL TASKS */}
        {activeTab === 'adhoc' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Operational & Ad-hoc Assignments</h2>
                <p className="text-xs text-slate-500">
                  Non-calendar tasks assigned by social media managers (shoots, audits, bio revamps).
                </p>
              </div>
              {canAssignTasks ? (
                <button
                  onClick={() => setIsNewTaskModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Assign Task to Teammate (Manager)</span>
                </button>
              ) : (
                <div className="px-3.5 py-1.5 bg-slate-100 rounded-xl text-slate-500 text-[11px] font-medium flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Task assignments managed by designated Agency Leads</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myAdHocTasks.length === 0 ? (
                <div className="col-span-2 bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-sm">
                  No active ad-hoc operational tasks assigned yet.
                </div>
              ) : (
                myAdHocTasks.map((t) => (
                  <div
                    key={t.id}
                    className={`bg-white p-5 rounded-2xl border transition shadow-xs flex flex-col justify-between ${
                      t.status === 'DONE'
                        ? 'border-emerald-200 bg-emerald-50/10'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {t.client_name || 'General Operations'}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            t.priority === 'HIGH'
                              ? 'bg-rose-100 text-rose-800'
                              : t.priority === 'MEDIUM'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {t.priority} PRIORITY
                        </span>
                      </div>

                      <h3 className={`font-bold text-sm text-slate-900 ${t.status === 'DONE' ? 'line-through text-slate-400' : ''}`}>
                        {t.title}
                      </h3>
                      {t.description && (
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{t.description}</p>
                      )}

                      <div className="mt-3 text-[11px] text-slate-400 flex items-center space-x-3">
                        <span>Assigned by: <strong className="text-slate-600">{t.assigned_by}</strong></span>
                        <span>•</span>
                        <span>Due: <strong className="text-slate-700">{t.due_date}</strong></span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Status: <strong className="text-slate-800">{t.status}</strong>
                      </span>
                      <button
                        onClick={() => handleToggleAdHocStatus(t)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                          t.status === 'DONE'
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{t.status === 'DONE' ? 'Reopen Task' : 'Mark Completed'}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Read-Only Calendar View with Internal Notes / Queries */}
        {activeTab === 'calendar' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Agency Master Calendar (Read-Only)</h2>
                <p className="text-xs text-slate-500">
                  Inspect client schedules & raise internal notes/queries on specific dates for managers and admin.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-700">Client:</span>
                <select
                  value={selectedCalendarClientId}
                  onChange={(e) => setSelectedCalendarClientId(Number(e.target.value))}
                  className="border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 bg-white"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {(() => {
              const selectedClient = clients.find((c) => c.id === selectedCalendarClientId) || clients[0];
              const cal = selectedClient?.calendars?.[0];
              const calItems = cal?.items || [];

              if (calItems.length === 0) {
                return (
                  <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-sm">
                    No deliverables found for {selectedClient?.name}.
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {calItems.map((it) => (
                    <div
                      key={it.id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between shadow-xs hover:border-blue-400 transition space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900">
                            Day {it.scheduled_date.split('-')[2]} · {it.day_of_week}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              it.format === 'REEL'
                                ? 'bg-purple-100 text-purple-700'
                                : it.format === 'CAROUSEL'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {it.format}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-bold text-xs text-slate-800">{it.content_pillar}</h4>
                          {it.special_day && (
                            <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              ★ {it.special_day}
                            </span>
                          )}
                          <p className="text-[11px] text-slate-500 line-clamp-2">
                            {it.visual_brief || it.reel_bytes_script || it.caption || 'Creative brief pending.'}
                          </p>
                        </div>

                        {it.reference_url && (
                          <a
                            href={it.reference_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center space-x-1 text-[10px] text-blue-600 font-bold hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Inspiration / Benchmark URL</span>
                          </a>
                        )}

                        {/* Team Notes / Queries Display */}
                        {it.team_notes && it.team_notes.length > 0 && (
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1 mt-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                              Team Internal Notes ({it.team_notes.length}):
                            </span>
                            {it.team_notes.map((note) => (
                              <div key={note.id} className="text-[11px] text-slate-700 border-l-2 border-indigo-400 pl-2 py-0.5">
                                <span className="font-bold text-slate-900">{note.author}</span>{' '}
                                <span className="text-[9px] text-slate-400">({note.role})</span>: {note.text}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Button: Add Note / Question */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-semibold">{it.status}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setNoteModalItem({ item: it, clientName: selectedClient.name });
                            setQueryNoteText('');
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center space-x-1 transition cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>+ Add Query Note</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}
      </main>

      {/* Upload Asset Modal */}
      {uploadModalItem && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Upload Deliverable Asset</h3>
                <p className="text-xs text-slate-400">
                  {uploadModalItem.clientName} · {uploadModalItem.item.content_pillar}
                </p>
              </div>
              <button
                onClick={() => setUploadModalItem(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUploadedAsset} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Creative File / Video Link / Drive URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    required
                    value={assetUrlInput}
                    onChange={(e) => setAssetUrlInput(e.target.value)}
                    placeholder="https://drive.google.com/... or https://..."
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex space-x-1 mt-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setAssetUrlInput(
                        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
                      )
                    }
                    className="text-[10px] px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-medium cursor-pointer"
                  >
                    Sample Reel MP4
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setAssetUrlInput(
                        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
                      )
                    }
                    className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium cursor-pointer"
                  >
                    Sample Creative JPG
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Internal Notes for Social Media Manager
                </label>
                <textarea
                  rows={2}
                  value={internalNoteInput}
                  onChange={(e) => setInternalNoteInput(e.target.value)}
                  placeholder="e.g. Added high-res hospital logo and doctor quote as requested..."
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                ℹ️ Once you submit, this deliverable moves to <strong>Manager Review</strong>. After internal approval, it will become visible in the client calendar.
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setUploadModalItem(null)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadSuccess}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5"
                >
                  {uploadSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Submitted!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit for Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Ad-hoc Task Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Assign Operational Task</h3>
                <p className="text-xs text-slate-400">Non-calendar task for {currentEmployee.first_name}</p>
              </div>
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAdHocTask} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Shoot Doctor Reel on Friday at OPD"
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Associated Client</label>
                <select
                  value={newTaskClient}
                  onChange={(e) => setNewTaskClient(parseInt(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Priority</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['NORMAL', 'MEDIUM', 'HIGH'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewTaskPriority(p)}
                      className={`py-1.5 px-2 rounded-xl font-bold border transition text-center ${
                        newTaskPriority === p
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {p === 'HIGH' ? '🔴 High' : p === 'MEDIUM' ? '🟡 Med' : '🟢 Norm'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Manager Delegation to Teammate */}
              {isManager && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assign To Teammate (Manager Rights)</label>
                  <select
                    value={assignedTeammateId}
                    onChange={(e) => setAssignedTeammateId(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-800"
                  >
                    {availableEmployees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.first_name} {emp.last_name} · {emp.designation} {emp.is_manager || emp.can_assign_tasks ? '(Lead)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Inspiration / Benchmark URL (Optional)</label>
                <input
                  type="url"
                  value={newTaskReferenceUrl}
                  onChange={(e) => setNewTaskReferenceUrl(e.target.value)}
                  placeholder="https://instagram.com/reel/..."
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Due Date</label>
                <input
                  type="date"
                  value={newTaskDue}
                  onChange={(e) => setNewTaskDue(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Instructions</label>
                <textarea
                  rows={2}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Add specific instructions for this task..."
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-xs transition"
                >
                  {isManager ? 'Assign Task to Teammate' : 'Create My Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Internal Query Note Modal */}
      {noteModalItem && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="px-6 py-4 bg-indigo-950 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Add Internal Query / Question</h3>
                <p className="text-xs text-indigo-200">
                  {noteModalItem.clientName} · Day {noteModalItem.item.scheduled_date.split('-')[2]} ({noteModalItem.item.content_pillar})
                </p>
              </div>
              <button onClick={() => setNoteModalItem(null)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveQueryNote} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Query / Question for Managers & Admin</label>
                <textarea
                  required
                  rows={3}
                  value={queryNoteText}
                  onChange={(e) => setQueryNoteText(e.target.value)}
                  placeholder="e.g. Script length is over 60 seconds, should we trim? Do we have raw logo files?"
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Visible to Agency Director, Social Media Managers, and Team members in the calendar.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setNoteModalItem(null)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition"
                >
                  Post Internal Query
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
