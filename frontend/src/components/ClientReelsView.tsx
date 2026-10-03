import React from 'react';
import { Video, PlayCircle, CheckCircle2, MessageSquare } from 'lucide-react';
import { Client, CalendarItem } from '../types';

interface ClientReelsViewProps {
  client: Client;
  onPreviewReel: (item: CalendarItem) => void;
}

export const ClientReelsView: React.FC<ClientReelsViewProps> = ({ client, onPreviewReel }) => {
  const items = client.calendars?.[0]?.items || [];
  const reelItems = items.filter((i) => i.format === 'REEL');

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-2">
            <Video className="w-3.5 h-3.5" />
            <span>9:16 Vertical Video Library</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Instagram Reels Hub</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Direct in-app video streaming with timeline scrubbing. No Google Drive permissions required.
          </p>
        </div>

        <div className="text-right">
          <span className="text-2xl font-extrabold text-purple-700">{reelItems.length}</span>
          <span className="text-xs text-slate-400 block font-semibold">Total Reels Planned</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reelItems.map((reel) => (
          <div
            key={reel.id}
            onClick={() => onPreviewReel(reel)}
            className="bg-white rounded-2xl border border-slate-200 hover:border-purple-400 hover:shadow-xl transition-all duration-200 overflow-hidden cursor-pointer group flex flex-col justify-between"
          >
            {/* Video Thumbnail / Mock Header */}
            <div className="relative aspect-[9/16] max-h-80 w-full bg-slate-950 flex items-center justify-center overflow-hidden">
              <video
                src={reel.media_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                muted
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-6 h-6 ml-0.5" />
                </div>
              </div>

              <div className="absolute top-3 left-3 bg-purple-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-700">
                Oct {reel.scheduled_date.split('-')[2]}
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] text-purple-300 font-bold block uppercase tracking-wider">
                  {reel.content_pillar}
                </span>
                <p className="text-xs font-bold line-clamp-1 mt-0.5">{reel.visual_brief}</p>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 space-y-2 text-xs">
              {reel.reel_bytes_script && (
                <p className="text-slate-600 italic line-clamp-2">
                  <span className="font-bold not-italic text-purple-700">Script: </span>
                  "{reel.reel_bytes_script}"
                </p>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    reel.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : reel.status === 'CHANGES_REQ'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {reel.status === 'APPROVED' ? '✓ Approved' : reel.status === 'CHANGES_REQ' ? 'Feedback Given' : 'Ready to Review'}
                </span>

                <span className="text-purple-600 font-bold text-[11px] group-hover:underline">
                  Watch & Review →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
