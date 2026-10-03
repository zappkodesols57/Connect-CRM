import React, { useState } from 'react';
import { UserCheck, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Client } from '../types';

interface ClientLoginProps {
  clients: Client[];
  onLogin: (client: Client) => void;
}

export const ClientLogin: React.FC<ClientLoginProps> = ({ clients, onLogin }) => {
  const [clientIdInput, setClientIdInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = clientIdInput.trim().toLowerCase();
    const found = clients.find(
      (c) =>
        c.slug.toLowerCase() === query ||
        c.code.toLowerCase() === query ||
        c.id.toString() === query ||
        c.name.toLowerCase().includes(query)
    );

    if (found) {
      setError('');
      onLogin(found);
    } else {
      setError('Client ID not found. Please try "nelson", "kohinoor", or select a demo client below.');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-xl mx-auto w-full my-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
            <UserCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Client Review Portal</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Log in with your Client ID to review upcoming reels, approve schedules, and request creative changes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Enter Your Client ID</label>
            <input
              type="text"
              required
              value={clientIdInput}
              onChange={(e) => {
                setClientIdInput(e.target.value);
                setError('');
              }}
              placeholder="e.g. nelson, kohinoor, vibetara..."
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            {error && <p className="text-rose-600 text-xs font-semibold mt-1.5">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-600/20 transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Access Content Calendar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Fast Pass for Live Demo */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Demo Client Fast-Pass</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {clients.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onLogin(c)}
                className="p-2.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 rounded-xl text-left transition group cursor-pointer"
              >
                <div className="font-bold text-slate-800 group-hover:text-emerald-700 truncate">{c.name}</div>
                <div className="text-[10px] text-slate-400 font-mono">ID: {c.slug}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
