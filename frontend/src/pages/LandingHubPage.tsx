import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Building2, CalendarCheck, ArrowRight, Sparkles, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { Client, Employee } from '../types';

interface LandingHubPageProps {
  clients: Client[];
  employees: Employee[];
}

export const LandingHubPage: React.FC<LandingHubPageProps> = ({ clients, employees }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white flex flex-col justify-between p-6 sm:p-12">
      {/* Top Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-600/30 border border-blue-500/40 rounded-2xl shadow-lg shadow-blue-600/20">
            <CalendarCheck className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">Connect CRM</h1>
            <p className="text-[11px] text-slate-400">Zapcode Solutions Agency Operating System</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>October 2026 Engine Live</span>
          </span>
        </div>
      </div>

      {/* Hero & Three Portals Gateway */}
      <div className="max-w-6xl w-full mx-auto my-12 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dedicated Multi-Portal Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Select Your Workspace Portal
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Each role has a dedicated URL and tailored dashboard for content creation, approval, and agency operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Admin Portal */}
          <Link
            to="/admin/login"
            className="group p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/70 transition-all duration-300 shadow-2xl hover:shadow-blue-600/20 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition duration-300">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  Director & Managers
                </span>
                <h3 className="text-2xl font-black text-white mt-1 group-hover:text-blue-300 transition">
                  Agency Admin Portal
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full-function control: All 11 client calendars, multi-slot scheduling, same-day Reel + Post, 1-click approvals, and ad-hoc task assignments.
              </p>
              <div className="pt-2">
                <code className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-blue-300 font-mono">
                  http://localhost:5174/admin/login
                </code>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:translate-x-1 transition">
              <span>Open Admin Login</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 2: Team Member Portal */}
          <Link
            to="/team/login"
            className="group p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/70 transition-all duration-300 shadow-2xl hover:shadow-purple-600/20 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition duration-300">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                  Designers & Editors (ZEMS)
                </span>
                <h3 className="text-2xl font-black text-white mt-1 group-hover:text-purple-300 transition">
                  Team Member Portal
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Login with ZEMS mobile & formula password (<code className="text-purple-300 font-mono">name4@mobile3</code>). View assigned deliverables, upload creatives/reels, and submit for review.
              </p>
              <div className="pt-2">
                <code className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-purple-300 font-mono">
                  http://localhost:5174/team/login
                </code>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-purple-400 group-hover:translate-x-1 transition">
              <span>Open Team Login</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 3: Client Portal */}
          <Link
            to="/client/login"
            className="group p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/70 transition-all duration-300 shadow-2xl hover:shadow-emerald-600/20 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition duration-300">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  External Client Review
                </span>
                <h3 className="text-2xl font-black text-white mt-1 group-hover:text-emerald-300 transition">
                  Client Review Portal
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clean, isolated portal for hospital directors and brand managers to review monthly schedules, preview 9:16 videos, approve, or request revisions.
              </p>
              <div className="pt-2">
                <code className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-emerald-300 font-mono">
                  http://localhost:5174/client/login
                </code>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition">
              <span>Open Client Login</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        {/* Live System Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-900/50 border border-slate-800/80 rounded-2xl text-center text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Imported Clients</span>
            <span className="text-lg font-black text-white">{clients.length} Real Accounts</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">ZEMS Team Members</span>
            <span className="text-lg font-black text-purple-400">{employees.length} Active Staff</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Scheduled Posts & Reels</span>
            <span className="text-lg font-black text-blue-400">
              {clients.reduce((acc, c) => acc + (c.calendars?.[0]?.items?.length || 0), 0)} Deliverables
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Excel Integration</span>
            <span className="text-lg font-black text-emerald-400">Oct Calender 2026.xlsx</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl w-full mx-auto pt-6 border-t border-slate-800/80 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 Connect CRM • Zapcode Solutions Internal Agency OS</p>
        <p>Built with Django REST Framework, UV & React TypeScript</p>
      </div>
    </div>
  );
};
