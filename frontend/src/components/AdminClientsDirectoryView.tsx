import React from 'react';
import { Users, Plus, ArrowRight, Building2, Calendar, Target } from 'lucide-react';
import { Client } from '../types';

interface AdminClientsDirectoryViewProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
  onOpenAddClient: () => void;
}

export const AdminClientsDirectoryView: React.FC<AdminClientsDirectoryViewProps> = ({
  clients,
  onSelectClient,
  onOpenAddClient,
}) => {
  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Retainer Management</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Agency Clients Directory</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Manage contract deliverables, industries, and monthly posting quotas for each brand.
          </p>
        </div>

        <button
          onClick={onOpenAddClient}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition shadow-md shadow-blue-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard New Client</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clients.map((c) => {
          const items = c.calendars?.[0]?.items || [];
          const reelsCount = items.filter((i) => i.format === 'REEL').length;
          const postsCount = items.filter((i) => i.format === 'IMAGE' || i.format === 'CAROUSEL').length;

          return (
            <div
              key={c.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">{c.name}</h3>
                      <span className="text-xs text-slate-400 font-medium">{c.industry || 'Agency Client'}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                    {c.code}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 italic">
                  "{c.special_notes || 'Monthly social media management retainer.'}"
                </p>

                {/* Quotas grid */}
                <div className="grid grid-cols-3 gap-2 mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Creatives</span>
                    <span className="font-extrabold text-blue-700 text-sm">{c.target_creatives}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Reels</span>
                    <span className="font-extrabold text-purple-700 text-sm">{c.target_reels}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Scheduled</span>
                    <span className="font-extrabold text-emerald-700 text-sm">{items.length}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">October 2026 Calendar Active</span>
                <button
                  onClick={() => onSelectClient(c)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Open Calendar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
