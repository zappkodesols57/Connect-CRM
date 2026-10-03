import React from 'react';
import { MessageSquare, Calendar, Video, CheckCircle2 } from 'lucide-react';
import { Client, CalendarItem } from '../types';

interface ClientFeedbackViewProps {
  client: Client;
  onOpenItem: (item: CalendarItem) => void;
}

export const ClientFeedbackView: React.FC<ClientFeedbackViewProps> = ({ client, onOpenItem }) => {
  const items = client.calendars?.[0]?.items || [];
  const feedbackItems = items.filter((i) => i.suggestion || i.status === 'CHANGES_REQ');

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Revision History</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Your Feedback & Suggestions</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Track change requests submitted to the agency creative team for October 2026.
          </p>
        </div>

        <div className="text-right">
          <span className="text-2xl font-extrabold text-emerald-700">{feedbackItems.length}</span>
          <span className="text-xs text-slate-400 block font-semibold">Active Requests</span>
        </div>
      </div>

      {feedbackItems.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">No Open Revisions</h3>
          <p className="text-slate-400 text-xs">You have not submitted any revision requests yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbackItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenItem(item)}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    Oct {item.scheduled_date.split('-')[2]} ({item.day_of_week})
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                    {item.format}
                  </span>
                  <span className="text-xs font-bold text-slate-800">{item.content_pillar}</span>
                </div>

                <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-900 font-medium">
                  <span className="font-bold">Your Suggestion: </span>
                  <span>"{item.suggestion || 'Revisions requested.'}"</span>
                </div>
              </div>

              <span className="text-xs text-emerald-600 font-bold hover:underline shrink-0">
                View & Edit Feedback →
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
