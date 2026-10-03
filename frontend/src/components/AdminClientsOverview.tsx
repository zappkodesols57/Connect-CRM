import React from 'react';
import { Building2, Calendar, ArrowRight, Video, Image as ImageIcon, Layers } from 'lucide-react';
import { Client, CalendarItem } from '../types';

interface AdminClientsOverviewProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
}

export const AdminClientsOverview: React.FC<AdminClientsOverviewProps> = ({
  clients,
  onSelectClient,
}) => {
  // October 2026 starts on Thursday (index 3 if Monday is 0)
  // Day headers: M, T, W, T, F, S, S
  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const startOffset = 3; // Oct 1, 2026 is Thursday
  const totalDays = 31;

  // Helper to get items for a day
  const getDayItems = (items: CalendarItem[] | undefined, dayNum: number) => {
    if (!items) return [];
    const dateStr = `2026-10-${dayNum < 10 ? '0' : ''}${dayNum}`;
    return items.filter((i) => i.scheduled_date === dateStr);
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>October 2026 Master Schedules</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Agency Clients Calendar Directory
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Visual month-at-a-glance view for all agency clients. Click any calendar to manage posts, reels, and day-wise details.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-xs bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
          <span className="font-semibold text-slate-600">Legend:</span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
            <span className="text-slate-600">Reel</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="text-slate-600">Post / Share</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600">Carousel</span>
          </span>
        </div>
      </div>

      {/* Grid of Client Cards with Actual Calendars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clients.map((client) => {
          const cal = client.calendars && client.calendars.length > 0 ? client.calendars[0] : null;
          const items = cal?.items || [];
          const reelsCount = items.filter((i) => i.format === 'REEL').length;
          const postsCount = items.filter((i) => i.format === 'IMAGE' || i.format === 'CAROUSEL').length;

          return (
            <div
              key={client.id}
              onClick={() => onSelectClient(client)}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden group flex flex-col justify-between"
            >
              {/* Card Header: Client Name & Industry */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition flex items-center space-x-2">
                      <span>{client.name}</span>
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">{client.industry || 'Social Media Client'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
                  <span>Open Calendar</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* The Actual Visual Mini Calendar of October */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>October 2026 Content Grid</span>
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {items.length} Posts Scheduled
                  </span>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400">
                  {dayNames.map((d, i) => (
                    <div key={i} className="py-1">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Calendar Days Grid */}
                <div className="grid grid-cols-7 gap-1.5 text-center">
                  {/* Empty cells before start of October (Oct 1 is Thursday = index 3) */}
                  {Array.from({ length: startOffset }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-8 rounded-lg bg-slate-50/50" />
                  ))}

                  {/* 31 Days of October */}
                  {Array.from({ length: totalDays }).map((_, i) => {
                    const dayNum = i + 1;
                    const dayItems = getDayItems(items, dayNum);
                    const hasItems = dayItems.length > 0;
                    const primaryItem = dayItems[0];

                    return (
                      <div
                        key={`day-${dayNum}`}
                        className={`h-8 rounded-lg flex flex-col items-center justify-center relative border transition-all text-xs ${
                          hasItems
                            ? 'bg-blue-50/60 border-blue-200 font-bold text-blue-900 shadow-xs'
                            : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                        }`}
                        title={
                          hasItems
                            ? `Oct ${dayNum}: ${primaryItem.format} - ${primaryItem.content_pillar}`
                            : `Oct ${dayNum}: No post scheduled`
                        }
                      >
                        <span className="text-[11px] leading-none">{dayNum}</span>

                        {/* Dot indicator for scheduled post */}
                        {hasItems && (
                          <div className="flex items-center space-x-0.5 mt-0.5">
                            {dayItems.map((item, idx) => (
                              <span
                                key={idx}
                                className={`w-1.5 h-1.5 rounded-full ${
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
                    );
                  })}
                </div>
              </div>

              {/* Card Footer: Summary of Quotas */}
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1 font-medium text-slate-700">
                    <Video className="w-3.5 h-3.5 text-purple-600" />
                    <span>{reelsCount} Reels</span>
                  </span>
                  <span className="flex items-center space-x-1 font-medium text-slate-700">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>{postsCount} Creatives</span>
                  </span>
                </div>
                <span className="font-semibold text-blue-600 group-hover:underline text-[11px]">
                  Click to Manage Day Schedule →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
