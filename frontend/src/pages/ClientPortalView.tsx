import React from 'react';
import {
  Check,
  CheckCircle,
  CheckCheck,
  MessageSquare,
  Play,
  Maximize2,
  FileSpreadsheet,
  Sparkles,
} from 'lucide-react';
import { Client, MonthlyCalendar, CalendarItem } from '../types';

interface ClientPortalViewProps {
  client: Client;
  calendar: MonthlyCalendar | null;
  onPreviewMedia: (type: 'image' | 'reel' | 'carousel', url?: string | null, title?: string) => void;
  onOpenSuggestion: (itemId: number) => void;
  onApprovePost: (itemId: number) => Promise<void>;
  onApproveAll: () => Promise<void>;
  onExportExcel: () => void;
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  client,
  calendar,
  onPreviewMedia,
  onOpenSuggestion,
  onApprovePost,
  onApproveAll,
  onExportExcel,
}) => {
  const items = calendar?.items || [];
  const approvedCount = items.filter((i) => i.status === 'APPROVED').length;
  const totalCount = items.length;

  return (
    <div className="flex-1 flex flex-col p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Client Branded Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-xl shadow">
            {client.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-slate-900">{client.name}</h1>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-emerald-100 text-emerald-800">
                Verified Client
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Monthly Social Media Content Review & Approval Portal
            </p>
          </div>
        </div>

        {/* Quota Review Counters & Action Buttons */}
        <div className="flex items-center space-x-4 text-xs">
          <div className="text-right">
            <span className="text-slate-400 block">Content Review Status</span>
            <span className="text-sm font-bold text-slate-800">
              Reviewed: {approvedCount} of {totalCount} Items Approved
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <button
            onClick={onExportExcel}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition flex items-center space-x-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Calendar</span>
          </button>
          <button
            onClick={onApproveAll}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow transition flex items-center space-x-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Approve Entire Calendar</span>
          </button>
        </div>
      </div>

      {/* Cloud Streaming Notice Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 px-4 flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>
            <strong>Frictionless Cloud Streaming:</strong> You don't need a Google Drive account or permission access. All 4K Reels, Carousels, and Creatives play instantly in your browser!
          </span>
        </div>
        <span className="text-blue-700 font-semibold">Zero Buffering • Fast Preview</span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            No items ready for review yet. The agency team is currently planning the schedule!
          </div>
        ) : (
          items.map((item) => {
            const isApproved = item.status === 'APPROVED';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
              >
                {/* Media Preview Box */}
                {item.format === 'REEL' ? (
                  <div
                    onClick={() => onPreviewMedia('reel', item.media_url, item.content_pillar)}
                    className="relative bg-slate-900 h-52 flex items-center justify-center overflow-hidden group cursor-pointer"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80"
                      alt="Thumb"
                      className="w-full h-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                      <Play className="w-5 h-5 ml-0.5" />
                    </div>
                    <div className="absolute top-3 left-3 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                      REEL • VERTICAL VIDEO
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white text-[11px] font-medium truncate">
                      {item.reel_bytes_script || 'Doctor Speaks to Camera'}
                    </div>
                  </div>
                ) : item.format === 'CAROUSEL' ? (
                  <div
                    onClick={() => onPreviewMedia('carousel', '', item.content_pillar)}
                    className="relative bg-slate-100 h-52 flex items-center justify-center overflow-hidden group cursor-pointer"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80"
                      alt="Carousel"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                      CAROUSEL • 5 SLIDES
                    </div>
                    <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      Click to Swipe
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => onPreviewMedia('image', item.media_url, item.content_pillar)}
                    className="relative bg-slate-100 h-52 flex items-center justify-center overflow-hidden group cursor-pointer"
                  >
                    <img
                      src={
                        item.media_url ||
                        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
                      }
                      alt="Creative"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      IMAGE • {item.scheduled_date}
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold space-x-1">
                      <Maximize2 className="w-4 h-4" />
                      <span>Preview High-Res</span>
                    </div>
                  </div>
                )}

                {/* Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wide">
                        {item.content_pillar}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          isApproved
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.status === 'CHANGES_REQ'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {item.special_day && item.special_day !== '—'
                        ? item.special_day
                        : `${item.content_pillar} Post`}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {item.caption || item.reel_bytes_script || item.visual_brief}
                    </p>
                  </div>

                  {/* Actions */}
                  {isApproved ? (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Approved by Client</span>
                      <span className="text-emerald-600 font-bold flex items-center space-x-1">
                        <CheckCheck className="w-4 h-4" />
                        <span>Locked</span>
                      </span>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
                      <button
                        onClick={() => onApprovePost(item.id)}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 transition shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Post</span>
                      </button>
                      <button
                        onClick={() => onOpenSuggestion(item.id)}
                        className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center justify-center space-x-1 transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                        <span>Suggest Change</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
