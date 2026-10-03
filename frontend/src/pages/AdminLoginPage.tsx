import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';

interface AdminLoginPageProps {
  onLogin: (name: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const u = username.trim().toLowerCase();
    const p = password.trim();

    if (
      (u === 'admin' || u === 'admin@connectcrm.io' || u === 'admin@zapcode.in') &&
      (p === 'admin' || p === 'admin123' || p === 'admin@zapcode')
    ) {
      onLogin('Tushar (Agency Director)');
      navigate('/admin');
    } else {
      setError('Invalid admin credentials. Use username: "admin" and password: "admin123"');
    }
  };

  const handleQuickDemo = () => {
    onLogin('Tushar (Agency Director)');
    navigate('/admin');
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
        <span className="text-blue-400 font-bold bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-800">
          Admin URL: /admin/login
        </span>
      </div>

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="text-center">
          <div className="inline-flex p-3 bg-blue-600/20 border border-blue-500/30 rounded-2xl mb-3">
            <Shield className="w-7 h-7 text-blue-400" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Agency Admin Login</h1>
          <p className="text-xs text-slate-400 mt-1">
            Access master calendars, client quotas, team workload & approval controls
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">Admin Username / Email</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="admin"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1.5">Admin Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="admin123"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Default demo: admin / admin123</p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2 cursor-pointer text-sm"
          >
            <span>Login to Admin Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer border border-slate-700"
          >
            ⚡ 1-Click Fast Pass (Admin Demo)
          </button>
        </div>
      </div>
    </div>
  );
};
