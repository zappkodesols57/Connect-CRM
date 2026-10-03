import React, { useState } from 'react';
import {
  Target,
  PlusCircle,
  FileSpreadsheet,
  Send,
  PlayCircle,
  Trash2,
  CalendarPlus,
  Check,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { Client, MonthlyCalendar, CalendarItem } from '../types';

interface AgencyAdminViewProps {
  activeClient: Client;
  calendar: MonthlyCalendar | null;
  onOpenCreateCalendar: () => void;
  onOpenAddPost: () => void;
  onPreviewMedia: (type: 'image' | 'reel' | 'carousel', url?: string | null, title?: string) => void;
  onDeletePost: (itemId: number) => Promise<void>;
  onExportExcel: () => void;
  onSubmitBatch: () => void;
}

export const AgencyAdminView: React.FC<AgencyAdminViewProps> = ({
  activeClient,
  calendar,
  onOpenCreateCalendar,
  onOpenAddPost,
  onPreviewMedia,
  onDeletePost,
  onExportExcel,
  onSubmitBatch,
}) => {
  const [formatFilter, setFormatFilter] = useState('ALL');

  const items = calendar?.items || [];
  const approvedCount = items.filter((i) => i.status === 'APPROVED').length;
  const totalCount = items.length;
  const percentage = Math.round((approvedCount / (totalCount || 1)) * 100);

  const filteredItems = items.filter((i) => {
    if (formatFilter === 'ALL') return true;
    return i.format === formatFilter;
  });

  return (
    <div className="flex-1 flex flex-col p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Deliverables Quota Meter */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">
              {calendar ? `${calendar.month} Target Meter` : 'Deliverables Target'}
            </span>
            <Target className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">
              {approvedCount} / {totalCount}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">
              ({percentage}% Reviewed)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-2">
            <span>Reels Target: {calendar?.target_reels || activeClient.target_reels}</span>
            <span>Creatives: {calendar?.target_creatives || activeClient.target_creatives}</span>
          </div>
        </div>

        {/* Card 2: Team Workload (Rahul) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Rahul (Sr. Designer)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold text-slate-900">22 Done</span>
            <span className="text-xs text-slate-500">/ 25 Assigned</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '88%' }} />
          </div>
          <span className="text-[11px] text-slate-400 mt-2">3 pending QA • Workload: 88%</span>
        </div>

        {/* Card 3: Team Workload (Sneha) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Sneha (Video Editor)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold text-slate-900">14 Reels</span>
            <span className="text-xs text-slate-500">/ 16 Assigned</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '87%' }} />
          </div>
          <span className="text-[11px] text-slate-400 mt-2">2 rendering • S3 direct sync</span>
        </div>

        {/* Card 4: Quick Action Panel */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 p-5 rounded-2xl text-white shadow flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-widest">
              Calendar Operations
            </span>
            <p className="text-xs text-slate-300 mt-0.5">
              {calendar ? `${calendar.month} ${calendar.year} Active` : 'No Active Calendar'}
            </p>
          </div>
          <div className="space-y-2 mt-3">
            <button
              onClick={onOpenCreateCalendar}
              className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition shadow"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Create New Month Calendar</span>
            </button>
            <button
              onClick={onExportExcel}
              className="w-full py-1.5 px-3 bg-emerald-700 hover:bg-emerald-600 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition shadow"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export to Excel (.CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Schedule Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Table Header / Toolbar */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <span>{activeClient.name}</span>
                <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {calendar ? `${calendar.month} ${calendar.year}` : 'Overview'}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Pillars: {activeClient.special_notes || 'Doctor Branding, Trust, Promotions'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-xs text-slate-500">
              <span>Filter:</span>
              <select
                value={formatFilter}
                onChange={(e) => setFormatFilter(e.target.value)}
                className="border border-slate-200 rounded-lg px-2 py-1 text-xs bg-slate-50 focus:outline-none"
              >
                <option value="ALL">All Formats</option>
                <option value="IMAGE">Images Only</option>
                <option value="REEL">Reels Only</option>
                <option value="CAROUSEL">Carousels Only</option>
              </select>
            </div>

            <button
              onClick={onOpenAddPost}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Post</span>
            </button>

            <button
              onClick={onExportExcel}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow transition"
              title="Download Excel matching Oct Calender 2026.xlsx"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Excel</span>
            </button>

            <button
              onClick={onSubmitBatch}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow transition"
            >
              <Send className="w-3.5 h-3.5 text-blue-400" />
              <span>Submit to Client</span>
            </button>
          </div>
        </div>

        {/* Schedule Table (Matching Excel columns) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold select-none">
                <th className="py-3 px-4 w-12 text-center">Sr.</th>
                <th className="py-3 px-4 w-28">Date & Day</th>
                <th className="py-3 px-4 w-36">Special Day</th>
                <th className="py-3 px-4 w-32">Content Pillar</th>
                <th className="py-3 px-4 w-24">Type</th>
                <th className="py-3 px-4">Visual Direction / Brief</th>
                <th className="py-3 px-4">Content Copy / Reel Bytes</th>
                <th className="py-3 px-4 w-28 text-center">Media (S3)</th>
                <th className="py-3 px-4 w-28 text-center">Status</th>
                <th className="py-3 px-4 w-20 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-slate-400">
                    No posts scheduled yet. Click "+ Add Post" or "Create New Month Calendar" to initialize!
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-mono text-center text-slate-400">
                      {item.sr_no < 10 ? `0${item.sr_no}` : item.sr_no}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      {item.scheduled_date}{' '}
                      <span className="text-slate-400 block text-[10px]">{item.day_of_week}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-medium">
                        {item.special_day || '—'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{item.content_pillar}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          item.format === 'REEL'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : item.format === 'CAROUSEL'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {item.format}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate" title={item.visual_brief || ''}>
                      {item.visual_brief || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 italic max-w-xs truncate" title={item.reel_bytes_script || ''}>
                      {item.reel_bytes_script || item.caption || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onPreviewMedia(item.media_type, item.media_url, item.content_pillar)}
                        className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          item.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.status === 'CHANGES_REQ'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : item.status === 'READY_FOR_CLIENT'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onDeletePost(item.id)}
                        className="text-slate-400 hover:text-rose-600 transition"
                        title="Delete slot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredItems.length} items for {activeClient.name}</span>
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1 text-emerald-600 font-medium">
              <Check className="w-3.5 h-3.5" />
              <span>Auto-saved to Database</span>
            </span>
            <button
              onClick={onExportExcel}
              className="text-blue-600 hover:underline font-semibold flex items-center space-x-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Download Excel Format (.csv)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
