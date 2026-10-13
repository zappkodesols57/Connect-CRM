import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Video,
  Image as ImageIcon,
  Layers,
  PlayCircle,
  CheckCircle,
  MessageSquare,
  Sparkles,
  Send,
  X,
} from 'lucide-react';
import { Client, MonthlyCalendar, CalendarItem } from '../types';

interface ClientCalendarViewProps {
  client: Client;
  onApproveItem: (itemId: number) => void;
  onSuggestItem: (itemId: number, feedback: string) => void;
}

export const ClientCalendarView: React.FC<ClientCalendarViewProps> = ({
  client,
  onApproveItem,
  onSuggestItem,
}) => {
  const [selectedCalendarId, setSelectedCalendarId] = useState<number>(client.calendars?.[0]?.id || 0);
  const calendar: MonthlyCalendar | undefined =
    client.calendars?.find((c) => c.id === selectedCalendarId) || client.calendars?.[0];
  const items: CalendarItem[] = calendar?.items || [];

  const currentMonthName = calendar?.month || 'October';
  const currentYear = calendar?.year || 2026;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthIndex = Math.max(0, monthNames.indexOf(currentMonthName));
  const totalDays = new Date(currentYear, monthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, monthIndex, 1).getDay(); // 0 is Sunday
  const startOffset = (firstDayOfWeek + 6) % 7; // Monday-based offset
  const monthNumStr = (monthIndex + 1).toString().padStart(2, '0');
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Dual-brand handling (e.g., Nelson Luxe Hospital vs Nelson Hospital)
  const brands = client.brands || [];
  const hasBrands = brands.length > 0;
  const [activeBrandFilter, setActiveBrandFilter] = useState<string>('ALL');

  // Review Modal State
  const [selectedItem, setSelectedItem] = useState<CalendarItem | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Check if calendar is in Planning phase or has topics planned without uploaded media
  const isPlanningPhase =
    calendar?.status === 'PLANNING' ||
    (items.length > 0 && items.filter((i) => i.status === 'READY_FOR_CLIENT' || i.status === 'APPROVED').length === 0);

  // Client visibility gatekeeper:
  // If calendar is in planning phase, allow client to see planned topics and script hooks for early sign-off!
  const clientVisibleItems = isPlanningPhase
    ? items
    : items.filter(
        (i) =>
          i.status === 'READY_FOR_CLIENT' ||
          i.status === 'CHANGES_REQ' ||
          i.status === 'APPROVED' ||
          i.status === 'PUBLISHED' ||
          i.status === 'DRAFT'
      );

  const getDayItems = (dayNum: number) => {
    const dateStr = `${currentYear}-${monthNumStr}-${dayNum < 10 ? '0' : ''}${dayNum}`;
    const dayItems = clientVisibleItems.filter((i) => i.scheduled_date === dateStr);
    if (hasBrands && activeBrandFilter !== 'ALL') {
      return dayItems.filter((i) => i.brand === activeBrandFilter);
    }
    return dayItems;
  };

  const handleOpenReview = (item: CalendarItem) => {
    setSelectedItem(item);
    setFeedbackText(item.suggestion || '');
    setFeedbackSuccess(false);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !feedbackText.trim()) return;
    onSuggestItem(selectedItem.id, feedbackText);
    setFeedbackSuccess(true);
    setTimeout(() => {
      setFeedbackSuccess(false);
      setSelectedItem(null);
    }, 1500);
  };

  const handleApprove = (itemId: number) => {
    onApproveItem(itemId);
    if (selectedItem) {
      setSelectedItem({ ...selectedItem, status: 'APPROVED' });
    }
  };

  // Upcoming deliverables overview
  const totalReels = items.filter((i) => i.format === 'REEL').length;
  const totalPosts = items.filter((i) => i.format === 'IMAGE' || i.format === 'CAROUSEL').length;
  const approvedCount = items.filter((i) => i.status === 'APPROVED').length;

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
      {/* Top Client Brand & Deliverables Ribbon */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Dedicated Client Portal</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{client.name}</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Review your upcoming {currentMonthName} {currentYear} content calendar. Click on any scheduled day to preview video reels, suggest edits, or approve.
          </p>
        </div>

        {/* Deliverables Overview ("What they have to get & what they have to post") */}
        <div className="flex items-center space-x-4 bg-slate-50 px-5 py-3.5 rounded-2xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">To Post / Scheduled</span>
            <span className="text-lg font-black text-slate-800">{items.length} Posts</span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">To Get (Reels)</span>
            <span className="text-lg font-black text-purple-700">{totalReels} Reels</span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Approved</span>
            <span className="text-lg font-black text-emerald-600">{approvedCount} / {items.length}</span>
          </div>
        </div>
      </div>

      {/* Early Planning Phase Notification */}
      {isPlanningPhase && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-2xl flex items-center justify-between text-xs shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-xl text-blue-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Next Month Content & Topic Planning Phase</h4>
              <p className="text-slate-600 text-xs">
                Review scheduled topics, visual briefs, and script hooks before creative production starts. Tap any day to approve or suggest topic tweaks!
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-[11px] shrink-0">
            Early Feedback Open
          </span>
        </div>
      )}

      {/* Month Switcher Bar for Client */}
      {client.calendars && client.calendars.length > 1 && (
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider pl-1">Month:</span>
          <div className="flex items-center space-x-2">
            {client.calendars.map((cal) => {
              const isSelected = calendar?.id === cal.id;
              return (
                <button
                  key={cal.id}
                  onClick={() => setSelectedCalendarId(cal.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>{cal.month} {cal.year}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Dual Brand Schedule Tabs for Client */}
      {hasBrands && (
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider pl-1">Brand Schedule:</span>
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveBrandFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                activeBrandFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>All Brands</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-mono">
                {items.length}
              </span>
            </button>
            {brands.map((b) => {
              const count = items.filter((i) => i.brand === b).length;
              const isSelected = activeBrandFilter === b;
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => setActiveBrandFilter(b)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{b}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Visual Monthly Calendar Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">
              {currentMonthName} {currentYear} Content Schedule
            </h2>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              <span className="text-slate-600 font-medium">Reel</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span className="text-slate-600 font-medium">Post / Share</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-600 font-medium">Carousel</span>
            </span>
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider py-1 border-b border-slate-100">
          {dayNames.map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>

        {/* The Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`offset-${i}`} className="min-h-[105px] rounded-xl bg-slate-50/40 border border-transparent" />
          ))}

          {Array.from({ length: totalDays }).map((_, i) => {
            const dayNum = i + 1;
            const dayItems = getDayItems(dayNum);
            const hasItems = dayItems.length > 0;

            return (
              <div
                key={`client-day-${currentMonthName}-${dayNum}`}
                className={`min-h-[110px] p-2 rounded-xl border flex flex-col justify-between transition-all ${
                  hasItems
                    ? 'bg-white border-slate-200 hover:border-emerald-500 hover:shadow-md'
                    : 'bg-slate-50/50 border-slate-100 text-slate-300'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span
                    className={`text-xs font-bold ${
                      hasItems ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {dayNum}
                  </span>

                  {hasItems && (
                    <div className="flex items-center space-x-1">
                      {dayItems.map((item) => (
                        <span
                          key={item.id}
                          className={`w-2 h-2 rounded-full ${
                            item.format === 'REEL'
                              ? 'bg-purple-600'
                              : item.format === 'CAROUSEL'
                              ? 'bg-amber-500'
                              : 'bg-blue-600'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Day Content */}
                {hasItems ? (
                  <div className="space-y-1.5 my-1 flex-1">
                    {dayItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleOpenReview(item)}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-emerald-50/80 border border-slate-200/80 hover:border-emerald-300 transition cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-block px-1 py-0.2 rounded text-[8px] font-extrabold ${
                              item.format === 'REEL'
                                ? 'bg-purple-100 text-purple-800'
                                : item.format === 'CAROUSEL'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {item.format === 'REEL' ? '🎬 REEL' : item.format === 'CAROUSEL' ? '📑 CAROUSEL' : '🖼️ POST'}
                          </span>
                          <span
                            className={`text-[8px] font-bold ${
                              item.status === 'APPROVED'
                                ? 'text-emerald-600'
                                : item.status === 'CHANGES_REQ'
                                ? 'text-rose-600'
                                : 'text-blue-600'
                            }`}
                          >
                            {item.status === 'APPROVED' ? '✓ OK' : item.status === 'CHANGES_REQ' ? 'Feedback' : 'Review →'}
                          </span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-800 line-clamp-1 leading-tight mt-0.5 group-hover:text-emerald-700">
                          {item.content_pillar}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-300 flex-1 flex items-center justify-center">
                    —
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Review & Suggestion Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  Post Review • {selectedItem.day_of_week}, {selectedItem.scheduled_date}
                </span>
                <h3 className="text-base font-bold">{selectedItem.content_pillar}</h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              {/* Media Preview Player or Planning Brief Card */}
              {isPlanningPhase || selectedItem.status === 'DRAFT' || (!selectedItem.uploaded_asset_url && !selectedItem.media_url) ? (
                <div className="rounded-2xl p-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-slate-800 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Creative Asset in Production Planning</h4>
                    <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                      Final video/graphic is being produced by the team. Review the planned hook, occasion, and script below and share your suggestions.
                    </p>
                  </div>
                  {selectedItem.reference_url && (
                    <div className="pt-2">
                      <a
                        href={selectedItem.reference_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600/30 text-blue-300 border border-blue-400/40 text-xs font-bold hover:bg-blue-600/50 transition"
                      >
                        <span>View Inspiration / Benchmark Link →</span>
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex justify-center items-center">
                  {selectedItem.media_type === 'reel' ? (
                    <div className="w-full max-w-xs py-4 flex flex-col items-center">
                      <span className="text-[10px] text-slate-400 mb-2 font-mono flex items-center space-x-1">
                        <Video className="w-3.5 h-3.5 text-purple-400" />
                        <span>9:16 Instagram Reel Preview</span>
                      </span>
                      <video
                        controls
                        autoPlay
                        loop
                        playsInline
                        className="w-64 h-96 object-cover rounded-xl shadow-2xl border border-slate-800"
                        src={selectedItem.media_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                      />
                    </div>
                  ) : (
                    <div className="w-full max-h-72 overflow-hidden flex items-center justify-center">
                      <img
                        src={selectedItem.media_url || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'}
                        alt={selectedItem.content_pillar}
                        className="max-h-72 w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Brief & Script */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                {selectedItem.special_day && (
                  <div className="text-indigo-700 font-bold">
                    ★ Occasion: {selectedItem.special_day}
                  </div>
                )}

                {selectedItem.visual_brief && (
                  <div>
                    <span className="font-bold text-slate-700">Visual Concept: </span>
                    <span className="text-slate-600">{selectedItem.visual_brief}</span>
                  </div>
                )}

                {selectedItem.reel_bytes_script && (
                  <div>
                    <span className="font-bold text-purple-700">Reel Hook & Script: </span>
                    <p className="text-slate-700 italic mt-0.5">"{selectedItem.reel_bytes_script}"</p>
                  </div>
                )}

                {selectedItem.caption && (
                  <div>
                    <span className="font-bold text-slate-700">Caption / Copy: </span>
                    <p className="text-slate-600 mt-0.5">{selectedItem.caption}</p>
                  </div>
                )}
              </div>

              {/* Approval & Changes Section */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>Client Feedback & Suggestions</span>
                  </h4>
                  <button
                    onClick={() => handleApprove(selectedItem.id)}
                    className={`px-4 py-2 rounded-xl font-bold flex items-center space-x-1.5 transition cursor-pointer shadow ${
                      selectedItem.status === 'APPROVED'
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{selectedItem.status === 'APPROVED' ? 'Approved Post' : 'Approve This Post'}</span>
                  </button>
                </div>

                <form onSubmit={handleSubmitFeedback} className="space-y-2">
                  <textarea
                    rows={3}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Have changes or suggestions? E.g., 'Update doctor photo', 'Change caption hook', etc."
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Submitting creates a revision ticket for the agency team.
                    </span>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center space-x-1.5 transition cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Submit Suggestion</span>
                    </button>
                  </div>
                </form>

                {feedbackSuccess && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold text-center">
                    ✓ Feedback submitted successfully! The agency design team has been notified.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
