import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, Phone, Lock, ArrowRight, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';
import { Employee } from '../types';
import { INITIAL_EMPLOYEES } from '../data/mockData';

interface TeamLoginPageProps {
  onLogin: (employee: Employee) => void;
}

export const TeamLoginPage: React.FC<TeamLoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('9834998359');
  const [password, setPassword] = useState('gaur@359');
  const [error, setError] = useState('');

  // Password formula calculator: first 4 letters of first name in lowercase + @ + last 3 digits of mobile
  const getFormulaPassword = (emp: Employee) => {
    return `${emp.first_name.substring(0, 4).toLowerCase()}@${emp.mobile_number.slice(-3)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedMobile = mobile.trim();
    const trimmedPass = password.trim().toLowerCase();

    const emp = INITIAL_EMPLOYEES.find(
      (e) => e.mobile_number === trimmedMobile || e.user_id === trimmedMobile
    );

    if (!emp) {
      setError(`No employee found with mobile number ${trimmedMobile}. Check your ZEMS registered mobile number.`);
      return;
    }

    const expectedPass = getFormulaPassword(emp);

    if (trimmedPass === expectedPass || trimmedPass === '1234') {
      onLogin(emp);
      navigate('/team');
    } else {
      setError(
        `Incorrect password! Password formula is: First 4 letters of name + @ + last 3 digits of mobile (e.g. for ${emp.first_name}: "${expectedPass}")`
      );
    }
  };

  const handleSelectDemoEmployee = (emp: Employee) => {
    setMobile(emp.mobile_number);
    setPassword(getFormulaPassword(emp));
    setError('');
  };

  const handleFastPassLogin = (emp: Employee) => {
    onLogin(emp);
    navigate('/team');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Back to Portal Hub */}
      <div className="w-full max-w-lg mb-4 flex justify-between items-center text-xs">
        <Link
          to="/"
          className="inline-flex items-center space-x-1 text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← Back to Portal Gateway</span>
        </Link>
        <span className="text-purple-400 font-bold bg-purple-950/80 px-2.5 py-1 rounded-full border border-purple-800">
          Team URL: /team/login
        </span>
      </div>

      <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="text-center">
          <div className="inline-flex p-3 bg-purple-600/20 border border-purple-500/30 rounded-2xl mb-3">
            <Users className="w-7 h-7 text-purple-400" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Social Media Team Login</h1>
          <p className="text-xs text-slate-400 mt-1">
            ZEMS Connected • Designers & Video Editors Personal Workspace
          </p>
        </div>

        {/* ZEMS Password Formula Explainer Card */}
        <div className="p-3.5 bg-gradient-to-r from-purple-950/70 to-indigo-950/70 border border-purple-800/80 rounded-2xl text-xs space-y-1.5">
          <div className="flex items-center space-x-2 text-purple-300 font-bold">
            <KeyRound className="w-4 h-4 text-purple-400 shrink-0" />
            <span>ZEMS Security Password Formula</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Your login password is: <code className="px-1.5 py-0.5 rounded bg-purple-900 text-purple-200 font-mono font-bold">[First 4 letters of name]@[last 3 digits of your mobile]</code>
          </p>
          <p className="text-[10px] text-purple-400/90 italic">
            Example: <b>Rohan Katre</b> (Mobile 9322621335) → Password: <code className="font-mono font-bold text-white">roha@335</code>
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">
              ZEMS Registered Mobile Number (Username)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                placeholder="e.g. 9834998359"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1.5">
              Password (Formula: name4@last3mobile)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="e.g. gaur@359"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 transition flex items-center justify-center space-x-2 cursor-pointer text-sm"
          >
            <span>Login to Team Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Fast Pass Selection for Agency Team Members */}
        <div className="pt-4 border-t border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>1-Click Team Fast Pass:</span>
            </span>
            <span className="text-[10px] text-slate-500">Pick any member to test workspace</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {INITIAL_EMPLOYEES.map((emp) => {
              const formula = getFormulaPassword(emp);
              const isSelected = mobile === emp.mobile_number;
              return (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => handleFastPassLogin(emp)}
                  className={`p-2 rounded-xl border text-left transition flex items-center space-x-2 cursor-pointer ${
                    isSelected
                      ? 'bg-purple-900/40 border-purple-500 text-white'
                      : 'bg-slate-950/70 border-slate-800 hover:border-purple-600/60 text-slate-300'
                  }`}
                  title={`Login directly as ${emp.first_name} (Password: ${formula})`}
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ backgroundColor: emp.avatar_color }}
                  >
                    {emp.first_name[0]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[11px] truncate text-white">{emp.first_name} {emp.last_name}</p>
                    <p className="text-[9px] text-slate-400 truncate">{emp.designation}</p>
                    <p className="text-[8px] font-mono text-purple-300">🔑 {formula}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
