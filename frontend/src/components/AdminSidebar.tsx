import React, { useState } from 'react';
import {
  CalendarCheck,
  Calendar,
  Users,
  MessageSquare,
  BarChart3,
  PlusCircle,
  FileSpreadsheet,
  LogOut,
  Sparkles,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Client } from '../types';

interface AdminSidebarProps {
  activeTab: 'dashboard' | 'calendars' | 'clients' | 'revisions' | 'team';
  onSelectTab: (tab: 'dashboard' | 'calendars' | 'clients' | 'revisions' | 'team') => void;
  clients: Client[];
  teamCount?: number;
  selectedClient: Client | null;
  onSelectClient: (client: Client | null) => void;
  onOpenAddClient: () => void;
  onOpenPlanPost: () => void;
  onExportExcel: () => void;
  onSignOut: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  clients,
  selectedClient,
  onSelectClient,
  onOpenAddClient,
  onOpenPlanPost,
  onExportExcel,
  onSignOut,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Count total pending revisions across all clients
  const totalRevisions = clients.reduce((acc, c) => {
    const items = c.calendars?.[0]?.items || [];
    return acc + items.filter((i) => i.suggestion || i.status === 'CHANGES_REQ').length;
  }, 0);

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
          <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            <CalendarCheck className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden transition-all duration-300 whitespace-nowrap">
              <h1 className="font-extrabold text-sm text-white tracking-tight">Connect CRM</h1>
              <span className="text-[10px] text-blue-400 font-semibold px-1.5 py-0.2 rounded bg-blue-950/80 border border-blue-800">
                Agency Admin
              </span>
            </div>
          )}
        </div>

        {/* Quick Action Buttons */}
        <div className={`p-4 space-y-2 border-b border-slate-900 ${isCollapsed ? 'items-center flex flex-col' : ''}`}>
          <button
            onClick={onOpenPlanPost}
            className={`w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center shadow-md shadow-blue-600/20 transition cursor-pointer ${isCollapsed ? 'p-2' : 'space-x-2'}`}
            title="Plan New Post"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="whitespace-nowrap">Plan Post</span>}
          </button>

          <button
            onClick={onExportExcel}
            className={`w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center transition cursor-pointer ${isCollapsed ? 'p-2' : 'space-x-2'}`}
            title="Download Excel schedule (.csv)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
            {!isCollapsed && <span className="whitespace-nowrap">Export Master</span>}
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="p-3 space-y-1">
          {!isCollapsed && (
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
              Workspace
            </div>
          )}

          <button
            onClick={() => {
              onSelectTab('dashboard');
              onSelectClient(null);
            }}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
            title="Analytics Dashboard"
          >
            <div className={`flex items-center ${isCollapsed ? '' : 'space-x-2.5'}`}>
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">Dashboard</span>}
            </div>
          </button>

          <button
            onClick={() => {
              onSelectTab('calendars');
              onSelectClient(null);
            }}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'calendars' && !selectedClient
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
            title="Master Calendars"
          >
            <div className={`flex items-center ${isCollapsed ? '' : 'space-x-2.5'}`}>
              <Calendar className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">Master Calendars</span>}
            </div>
            {!isCollapsed && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono">
                {clients.length}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('clients')}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'clients'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
            title="Clients Directory"
          >
            <div className={`flex items-center ${isCollapsed ? '' : 'space-x-2.5'}`}>
              <Users className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">Clients Directory</span>}
            </div>
          </button>

          <button
            onClick={() => onSelectTab('revisions')}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer relative ${
              activeTab === 'revisions'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
            title="Client Revisions"
          >
            <div className={`flex items-center ${isCollapsed ? '' : 'space-x-2.5'}`}>
              <MessageSquare className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">Client Revisions</span>}
            </div>
            {totalRevisions > 0 && !isCollapsed && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold">
                {totalRevisions} new
              </span>
            )}
            {totalRevisions > 0 && isCollapsed && (
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500"></span>
            )}
          </button>

          <button
            onClick={() => {
              onSelectTab('team');
              onSelectClient(null);
            }}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'team'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
            title="Team & Attendance"
          >
            <div className={`flex items-center ${isCollapsed ? '' : 'space-x-2.5'}`}>
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">Team & Attendance</span>}
            </div>
          </button>
        </div>

        {/* Client Fast-Switch Section */}
        {!isCollapsed && (
          <div className="p-3 space-y-1">
            <div className="flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Direct Client Schedules</span>
              <button
                onClick={onOpenAddClient}
                className="text-blue-400 hover:text-blue-300 font-bold"
                title="Add Client"
              >
                + Add
              </button>
            </div>

            <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
              {clients.map((c) => {
                const isSelected = selectedClient?.id === c.id;
                const itemCount = c.calendars?.[0]?.items?.length || 0;

                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectTab('calendars');
                      onSelectClient(c);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold shadow'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <span className="truncate max-w-[140px] text-left">{c.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        isSelected ? 'bg-blue-700 text-white' : 'bg-slate-900 text-slate-500'
                      }`}
                    >
                      {itemCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom: Admin Profile & Sign Out */}
      <div className={`p-4 border-t border-slate-900 bg-slate-950/60 flex flex-col ${isCollapsed ? 'items-center' : 'space-y-3'}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center mb-3' : 'space-x-3'}`}>
          <div className="w-8 h-8 shrink-0 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs ring-2 ring-blue-500/30">
            T
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <span className="block text-xs font-bold text-white truncate">Tushar</span>
              <span className="text-[10px] text-slate-400 block truncate">Agency Creative Director</span>
            </div>
          )}
        </div>

        <button
          onClick={onSignOut}
          className={`w-full py-2 bg-slate-900 hover:bg-rose-950/40 hover:border-rose-800 border border-slate-800 text-slate-400 hover:text-rose-400 rounded-xl text-xs font-semibold flex items-center justify-center transition cursor-pointer ${isCollapsed ? 'px-2' : 'px-3 space-x-2'}`}
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap">Sign Out / Switch</span>}
        </button>
      </div>
    </aside>
  );
};
