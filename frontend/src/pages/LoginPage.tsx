import React, { useState } from 'react';
import {
  CalendarCheck,
  Shield,
  UserCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Building2,
  CheckCircle2,
  Video,
  Image as ImageIcon,
  FileSpreadsheet,
} from 'lucide-react';
import { Client, Employee } from '../types';
import { INITIAL_EMPLOYEES } from '../data/mockData';

interface LoginPageProps {
  clients: Client[];
  onLogin: (auth: {
    role: 'admin' | 'client' | 'team';
    name: string;
    clientId?: number;
    employeeId?: number;
  }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ clients, onLogin }) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'client' | 'team'>('admin');
  
  // Admin form state
  const [adminEmail, setAdminEmail] = useState('admin@connectcrm.io');
  const [adminPassword, setAdminPassword] = useState('admin123');

  // Client form state
  const [selectedClientId, setSelectedClientId] = useState<number>(
    clients.length > 0 ? clients[0].id : 1
  );
  const [clientPin, setClientPin] = useState('2026');

  // Team Member form state
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number>(
    INITIAL_EMPLOYEES[1]?.id || 1600
  );
  const [teamPin, setTeamPin] = useState('1234');

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      role: 'admin',
      name: 'Agency Admin (Tushar)',
    });
  };

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosen = clients.find((c) => c.id === selectedClientId) || clients[0];
    onLogin({
      role: 'client',
      name: chosen ? chosen.name : 'Client Portal',
      clientId: chosen ? chosen.id : 1,
    });
  };

  const handleTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = INITIAL_EMPLOYEES.find((em) => em.id === selectedEmployeeId) || INITIAL_EMPLOYEES[1];
    onLogin({
      role: 'team',
      name: `${emp.first_name} ${emp.last_name}`,
      employeeId: emp.id,
    });
  };

  const handleQuickDemoLogin = (role: 'admin' | 'client' | 'team', param?: string | number) => {
    if (role === 'admin') {
      onLogin({
        role: 'admin',
        name: 'Agency Admin (Tushar)',
      });
    } else if (role === 'client') {
      const client = clients.find((c) => c.slug === param) || clients[0];
      onLogin({
        role: 'client',
        name: client ? client.name : 'Client',
        clientId: client ? client.id : 1,
      });
    } else {
      const emp = INITIAL_EMPLOYEES.find((em) => em.id === Number(param)) || INITIAL_EMPLOYEES[1];
      onLogin({
        role: 'team',
        name: `${emp.first_name} ${emp.last_name}`,
        employeeId: emp.id,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Brand Header */}
      <div className="text-center mb-8 max-w-xl">
        <div className="inline-flex items-center justify-center p-3 bg-blue-600/20 border border-blue-500/30 rounded-2xl mb-4 backdrop-blur-md shadow-xl shadow-blue-950/50">
          <CalendarCheck className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Connect CRM
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2">
          Enterprise Social Media Management & Dedicated Client Review Hub
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Live Feature Value Props */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl shadow-2xl text-slate-300">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase 1 Core Architecture</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Automate Client Approval Workflows
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Replace messy WhatsApp feedback and Google Drive access permissions with a centralized, branded client portal.
            </p>

            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-blue-600/20 text-blue-400 rounded-lg shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200">Role-Isolated Portals</h4>
                  <p className="text-slate-400 text-[11px]">Strict multi-tenant security ensures clients only see their own calendar and media.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-purple-600/20 text-purple-400 rounded-lg shrink-0 mt-0.5">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200">In-CRM Reel & Video Preview</h4>
                  <p className="text-slate-400 text-[11px]">Instant streaming for 9:16 Instagram Reels with audio controls and frame scrubbing.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-emerald-600/20 text-emerald-400 rounded-lg shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200">1-Click Approval & Feedback</h4>
                  <p className="text-slate-400 text-[11px]">Digital sign-offs lock calendars and create actionable revision tickets for designers.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-amber-600/20 text-amber-400 rounded-lg shrink-0 mt-0.5">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200">Real Excel Export</h4>
                  <p className="text-slate-400 text-[11px]">Export formatted schedules matching legacy agency spreadsheets with one click.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-500">
            Powered by Django REST Framework & React TypeScript
          </div>
        </div>

        {/* Right Column: Interactive Login Box */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl flex flex-col justify-between">
          <div>
            {/* Tabs for Portal Selection */}
            <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Agency Admin</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('client')}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'client'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Client Portal</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('team')}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'team'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>Team Member</span>
              </button>
            </div>

            {/* Admin Form */}
            {activeTab === 'admin' && (
              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Agency Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                      placeholder="admin@connectcrm.io"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Sign In to Agency Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Client Form */}
            {activeTab === 'client' && (
              <form onSubmit={handleClientSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Select Your Client Account
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <select
                      value={selectedClientId}
                      onChange={(e) => setSelectedClientId(parseInt(e.target.value))}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                    >
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Client Portal Access PIN / Key
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      value={clientPin}
                      onChange={(e) => setClientPin(e.target.value)}
                      required
                      placeholder="Access PIN"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Access Client Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Team Member Form */}
            {activeTab === 'team' && (
              <form onSubmit={handleTeamSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Select Your Member Profile
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <select
                      value={selectedEmployeeId}
                      onChange={(e) => setSelectedEmployeeId(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                    >
                      {INITIAL_EMPLOYEES.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.first_name} {emp.last_name} ({emp.designation})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Member Access PIN
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      value={teamPin}
                      onChange={(e) => setTeamPin(e.target.value)}
                      required
                      placeholder="Access PIN (default: 1234)"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Access Team Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Quick Demo Fast-Pass Section (One-Click for Demo Presentations) */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>1-Click Live Demo Fast-Pass</span>
              </span>
              <span className="text-[10px] text-slate-500">Instant Switch for CEO Presentation</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="p-2.5 bg-slate-950/70 hover:bg-blue-900/30 border border-slate-800 hover:border-blue-500/50 rounded-xl text-left transition group cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-200 group-hover:text-blue-400 flex items-center justify-between">
                  <span>Agency Admin</span>
                  <Shield className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Full Agency Master Access</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('client', 'nelson')}
                className="p-2.5 bg-slate-950/70 hover:bg-emerald-900/30 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left transition group cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 flex items-center justify-between">
                  <span>Nelson Hospital</span>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Healthcare & Maternity</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('client', 'kohinoor')}
                className="p-2.5 bg-slate-950/70 hover:bg-amber-900/30 border border-slate-800 hover:border-amber-500/50 rounded-xl text-left transition group cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-200 group-hover:text-amber-400 flex items-center justify-between">
                  <span>Kohinoor TEZ</span>
                  <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Education / Publishing</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('client', 'vibetara')}
                className="p-2.5 bg-slate-950/70 hover:bg-pink-900/30 border border-slate-800 hover:border-pink-500/50 rounded-xl text-left transition group cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-200 group-hover:text-pink-400 flex items-center justify-between">
                  <span>Vibetara</span>
                  <UserCheck className="w-3.5 h-3.5 text-pink-500" />
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Lifestyle & Fashion</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('client', 'neuro')}
                className="p-2.5 bg-slate-950/70 hover:bg-purple-900/30 border border-slate-800 hover:border-purple-500/50 rounded-xl text-left transition group cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-200 group-hover:text-purple-400 flex items-center justify-between">
                  <span>Brain & Spine</span>
                  <UserCheck className="w-3.5 h-3.5 text-purple-500" />
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Healthcare & Neurology</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('client', 'commerce')}
                className="p-2.5 bg-slate-950/70 hover:bg-emerald-900/30 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left transition group cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 flex items-center justify-between">
                  <span>Prerna Commerce</span>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Commerce / Higher Ed</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('client', 'zappkode')}
                className="p-2.5 bg-slate-950/70 hover:bg-indigo-900/30 border border-slate-800 hover:border-indigo-500/50 rounded-xl text-left transition group cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-400 flex items-center justify-between">
                  <span>Zappkode</span>
                  <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Enterprise Cloud Tech</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('team', 1600)}
                className="p-2.5 bg-slate-950/70 hover:bg-purple-900/30 border border-slate-800 hover:border-purple-500/50 rounded-xl text-left transition group cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-200 group-hover:text-purple-400 flex items-center justify-between">
                  <span>Gaurav B.</span>
                  <Video className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Jr. Video Editor</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('team', 1597)}
                className="p-2.5 bg-slate-950/70 hover:bg-pink-900/30 border border-slate-800 hover:border-pink-500/50 rounded-xl text-left transition group cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-200 group-hover:text-pink-400 flex items-center justify-between">
                  <span>Achal R.</span>
                  <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Graphic Designer</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('team', 1634)}
                className="p-2.5 bg-slate-950/70 hover:bg-blue-900/30 border border-slate-800 hover:border-blue-500/50 rounded-xl text-left transition group cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-200 group-hover:text-blue-400 flex items-center justify-between">
                  <span>Shreya T.</span>
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Social Media Manager</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
