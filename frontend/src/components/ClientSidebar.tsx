import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  Video,
  MessageSquare,
  CheckCircle,
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Client } from '../types';

interface ClientSidebarProps {
  client: Client;
  activeTab: 'calendar' | 'reels' | 'feedback';
  onSelectTab: (tab: 'calendar' | 'reels' | 'feedback') => void;
  onSignOut: () => void;
}

export const ClientSidebar: React.FC<ClientSidebarProps> = ({
  client,
  activeTab,
  onSelectTab,
  onSignOut,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const items = client.calendars?.[0]?.items || [];
  const reelsCount = items.filter((i) => i.format === 'REEL').length;
  const approvedCount = items.filter((i) => i.status === 'APPROVED').length;
  const feedbackCount = items.filter((i) => i.suggestion || i.status === 'CHANGES_REQ').length;

  return (
    <aside 
      className={`${isCollapsed ? 'w-20' : 'w-64'} bg-slate-950 border-r border-slate-800 text-slate-300 flex flex-col justify-between shrink-0 min-h-screen select-none transition-all duration-300 relative`}
    >
      {/* Collapse Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-full p-1 cursor-pointer z-50 transition-colors shadow-lg"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Brand Header */}
      <div>
        <div className={`p-5 border-b border-slate-800/80 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="truncate overflow-hidden transition-all duration-300 whitespace-nowrap">
              <h1 className="font-extrabold text-sm text-white tracking-tight truncate">{client.name}</h1>
              <span className="text-[10px] text-emerald-400 font-semibold px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-800">
                Verified Client Portal
              </span>
            </div>
          )}
        </div>

        {/* Contract Status Banner */}
        {!isCollapsed && (
          <div className="p-4 border-b border-slate-900">
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-400">Current Retainer</span>
                <span className="text-emerald-400 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Active</span>
                </span>
              </div>
              <div className="text-xs font-bold text-white">October 2026 Deliverables</div>
              <div className="text-[10px] text-slate-400">
                {approvedCount} of {items.length} Posts Approved
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-emerald-500 h-1.5 rounded-full" 
                  style={{ width: `${(approvedCount / (items.length || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <div className="p-3 space-y-1">
          {!isCollapsed && (
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
              Client Navigation
            </div>
          )}

          <button
            onClick={() => onSelectTab('calendar')}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
            title="Content Calendar"
          >
            <div className={`flex items-center ${isCollapsed ? '' : 'space-x-2.5'}`}>
              <Calendar className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">Content Calendar</span>}
            </div>
          </button>

          <button
            onClick={() => onSelectTab('reels')}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'reels'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
            title="Reels & Video Media"
          >
            <div className={`flex items-center ${isCollapsed ? '' : 'space-x-2.5'}`}>
              <Video className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">Reels & Video Media</span>}
            </div>
          </button>

          <button
            onClick={() => onSelectTab('feedback')}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer relative ${
              activeTab === 'feedback'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
            title="My Revisions & Notes"
          >
            <div className={`flex items-center ${isCollapsed ? '' : 'space-x-2.5'}`}>
              <MessageSquare className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">My Revisions & Notes</span>}
            </div>
            {feedbackCount > 0 && !isCollapsed && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold">
                {feedbackCount}
              </span>
            )}
            {feedbackCount > 0 && isCollapsed && (
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500"></span>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Profile & Sign Out */}
      <div className={`p-4 border-t border-slate-900 bg-slate-950/60 flex flex-col ${isCollapsed ? 'items-center' : 'space-y-3'}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center mb-3' : 'space-x-3'}`}>
          <div className="w-8 h-8 shrink-0 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs ring-2 ring-emerald-500/30">
            {client.code.substring(0, 2)}
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <span className="block text-xs font-bold text-white truncate">{client.name}</span>
              <span className="text-[10px] text-slate-400 block truncate">Brand Marketing Head</span>
            </div>
          )}
        </div>

        <button
          onClick={onSignOut}
          className={`w-full py-2 bg-slate-900 hover:bg-rose-950/40 hover:border-rose-800 border border-slate-800 text-slate-400 hover:text-rose-400 rounded-xl text-xs font-semibold flex items-center justify-center transition cursor-pointer ${isCollapsed ? 'px-2' : 'px-3 space-x-2'}`}
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap">Switch / Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
