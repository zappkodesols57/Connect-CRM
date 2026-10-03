import React from 'react';
import { CalendarCheck, Shield, UserCheck, LogOut } from 'lucide-react';
import { Client } from '../types';

interface NavbarProps {
  currentPanel: 'admin' | 'client';
  onSwitchPanel: (panel: 'admin' | 'client') => void;
  loggedInClient: Client | null;
  onClientLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPanel,
  onSwitchPanel,
  loggedInClient,
  onClientLogout,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-lg">
      {/* Brand */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
          <CalendarCheck className="w-5 h-5" />
        </div>
        <div>
          <span className="font-extrabold text-base tracking-tight text-white block">Connect CRM</span>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
            Social Media Calendar Suite
          </span>
        </div>
      </div>

      {/* Two Different Panels Switcher */}
      <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
        <button
          onClick={() => onSwitchPanel('admin')}
          className={`flex items-center space-x-2 px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            currentPanel === 'admin'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Admin Panel</span>
        </button>
        <button
          onClick={() => onSwitchPanel('client')}
          className={`flex items-center space-x-2 px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            currentPanel === 'client'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Client Panel</span>
        </button>
      </div>

      {/* Right User / Context Info */}
      <div className="flex items-center space-x-3 text-xs">
        {currentPanel === 'admin' ? (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="font-semibold text-white">Agency Super Admin</span>
          </div>
        ) : loggedInClient ? (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-800/70 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-semibold">{loggedInClient.name}</span>
            </div>
            <button
              onClick={onClientLogout}
              className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition border border-slate-700 cursor-pointer"
              title="Sign out of client panel"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch Client</span>
            </button>
          </div>
        ) : (
          <span className="text-slate-400 text-xs italic">Client Login Required</span>
        )}
      </div>
    </header>
  );
};
