import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Lock, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Client } from '../types';

interface ClientLoginPageProps {
  clients: Client[];
  onLogin: (client: Client) => void;
}

export const ClientLoginPage: React.FC<ClientLoginPageProps> = ({ clients, onLogin }) => {
  const navigate = useNavigate();
  const [selectedClientId, setSelectedClientId] = useState<number>(clients[0]?.id || 1);
  const [pin, setPin] = useState('2026');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosen = clients.find((c) => c.id === selectedClientId) || clients[0];
    if (chosen) {
      onLogin(chosen);
      navigate('/client');
    }
  };

  const handleFastPass = (client: Client) => {
    onLogin(client);
    navigate('/client');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Back to Portal Hub */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center text-xs">
        <Link
          to="/"
          className="inline-flex items-center space-x-1 text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← Back to Portal Gateway</span>
        </Link>
        <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
          Client URL: /client/login
        </span>
      </div>

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="text-center">
          <div className="inline-flex p-3 bg-emerald-600/20 border border-emerald-500/30 rounded-2xl mb-3">
            <Building2 className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Client Review Portal</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review monthly content schedules, preview videos, approve & request revisions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">Select Client Account</label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1.5">Access PIN</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
                placeholder="2026"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Default client review PIN: 2026</p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center space-x-2 cursor-pointer text-sm"
          >
            <span>Open Client Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 space-y-2">
          <p className="text-[11px] font-bold text-slate-400">1-Click Fast Pass for Clients:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {clients.slice(0, 4).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleFastPass(c)}
                className="p-2 bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-emerald-600 rounded-xl text-left transition flex items-center space-x-2 cursor-pointer"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: c.primary_color }}
                />
                <span className="font-semibold text-slate-200 truncate text-[11px]">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
