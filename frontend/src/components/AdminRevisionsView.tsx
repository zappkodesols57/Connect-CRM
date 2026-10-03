import React from 'react';
import { MessageSquare, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';
import { Client } from '../types';

interface AdminRevisionsViewProps {
  clients: Client[];
  onOpenClientCalendar: (client: Client) => void;
}

export const AdminRevisionsView: React.FC<AdminRevisionsViewProps> = ({
  clients,
  onOpenClientCalendar,
}) => {
  // Aggregate all items with suggestions or status CHANGES_REQ
  const revisionItems = clients.flatMap((client) => {
    const items = client.calendars?.[0]?.items || [];
    return items
      .filter((item) => item.suggestion || item.status === 'CHANGES_REQ')
      .map((item) => ({ ...item, client }));
  });

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Client Feedback Central</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Client Revision & Change Requests
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Action items and revision notes submitted by clients directly from their portal.
          </p>
        </div>

        <div className="text-right">
          <span className="text-2xl font-extrabold text-rose-600">{revisionItems.length}</span>
          <span className="text-xs text-slate-400 block font-semibold">Active Revisions</span>
        </div>
      </div>

      {revisionItems.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">No Pending Client Revisions</h3>
          <p className="text-slate-400 text-xs">All clients have either approved or have no open feedback tickets.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {revisionItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs text-slate-900 flex items-center space-x-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>{item.client.name}</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500 font-mono">
                    {item.scheduled_date} ({item.day_of_week})
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                    {item.format}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-800">{item.content_pillar}</h4>

                <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-900 font-medium">
                  <span className="font-bold">Client Suggestion: </span>
                  <span>"{item.suggestion || 'Revisions requested by client.'}"</span>
                </div>
              </div>

              <button
                onClick={() => onOpenClientCalendar(item.client)}
                className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shrink-0"
              >
                <span>Open in Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
