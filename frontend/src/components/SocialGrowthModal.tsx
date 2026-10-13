import React, { useState } from 'react';
import { X, TrendingUp, Plus, User, ArrowUpRight, CheckCircle2, Shield } from 'lucide-react';
import { SocialMediaTracker, Client, Employee } from '../types';
import { INITIAL_EMPLOYEES } from '../data/mockData';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface SocialGrowthModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackers: SocialMediaTracker[];
  clients: Client[];
  onUpdateTracker: (updated: SocialMediaTracker) => void;
  onAddTracker: (newTracker: Omit<SocialMediaTracker, 'id' | 'last_updated'>) => void;
  canEdit?: boolean;
}

export const SocialGrowthModal: React.FC<SocialGrowthModalProps> = ({
  isOpen,
  onClose,
  trackers,
  clients,
  onUpdateTracker,
  onAddTracker,
  canEdit = true,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedClient, setSelectedClient] = useState<number>(clients[0]?.id || 1);
  const [handle, setHandle] = useState('@');
  const [startingFollowers, setStartingFollowers] = useState<number>(10000);
  const [currentFollowers, setCurrentFollowers] = useState<number>(10000);
  const [targetFollowers, setTargetFollowers] = useState<number>(15000);
  const [assignedEmployeeId, setAssignedEmployeeId] = useState<number>(INITIAL_EMPLOYEES[0]?.id || 1634);

  // Quick edit state for existing cards
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCount, setEditCount] = useState<number>(0);

  if (!isOpen) return null;

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    const cObj = clients.find((c) => c.id === selectedClient);
    const empObj = INITIAL_EMPLOYEES.find((e) => e.id === assignedEmployeeId) || INITIAL_EMPLOYEES[0];

    onAddTracker({
      client_id: selectedClient,
      client_name: cObj?.name || 'Client',
      platform: 'INSTAGRAM',
      handle: handle.trim(),
      month: 'October',
      year: 2026,
      starting_followers: Number(startingFollowers),
      current_followers: Number(currentFollowers),
      target_followers: Number(targetFollowers),
      assigned_to: empObj,
    });

    setIsAdding(false);
  };

  const handleSaveCount = (tracker: SocialMediaTracker) => {
    onUpdateTracker({
      ...tracker,
      current_followers: editCount,
      last_updated: new Date().toISOString().split('T')[0],
    });
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-pink-600 via-rose-600 to-purple-700 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">Client Social Media Growth Tracker</h3>
              <p className="text-xs text-rose-100">Audit follower velocity, assigned manager & monthly reach</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            Tracking {trackers.length} Active Client Accounts
          </span>
          {canEdit && (
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAdding ? 'Close Form' : 'Track New Account'}</span>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Add Tracker Form */}
          {isAdding && (
            <form onSubmit={handleCreateNew} className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-3 text-xs mb-4">
              <h4 className="font-bold text-purple-900 text-sm">Add Client Social Account to Track</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Client</label>
                  <select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl p-2 bg-white"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Instagram Handle</label>
                  <input
                    type="text"
                    required
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="@clienthospital"
                    className="w-full border border-slate-300 rounded-xl p-2 bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Starting Followers (Month Start)</label>
                  <input
                    type="number"
                    value={startingFollowers}
                    onChange={(e) => setStartingFollowers(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl p-2 bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Current Followers Today</label>
                  <input
                    type="number"
                    value={currentFollowers}
                    onChange={(e) => setCurrentFollowers(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl p-2 bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Month Target</label>
                  <input
                    type="number"
                    value={targetFollowers}
                    onChange={(e) => setTargetFollowers(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl p-2 bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Assigned Social Manager</label>
                  <select
                    value={assignedEmployeeId}
                    onChange={(e) => setAssignedEmployeeId(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl p-2 bg-white"
                  >
                    {INITIAL_EMPLOYEES.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.first_name} {emp.last_name} ({emp.designation})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition"
                >
                  Save & Start Tracking
                </button>
              </div>
            </form>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trackers.map((t) => {
              const netGain = t.current_followers - t.starting_followers;
              const percentGain =
                t.starting_followers > 0 ? ((netGain / t.starting_followers) * 100).toFixed(1) : '0';

              return (
                <div
                  key={t.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                        <InstagramIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm leading-tight">{t.client_name}</h4>
                        <span className="text-xs text-purple-600 font-semibold">{t.handle}</span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold">
                      {t.month} {t.year}
                    </span>
                  </div>

                  {/* Growth Metrics */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Start</span>
                      <span className="text-xs font-bold text-slate-700">{t.starting_followers.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Current</span>
                      {editingId === t.id ? (
                        <div className="flex items-center space-x-1 mt-0.5">
                          <input
                            type="number"
                            value={editCount}
                            onChange={(e) => setEditCount(Number(e.target.value))}
                            className="w-16 text-center text-xs border rounded p-0.5"
                          />
                          <button
                            onClick={() => handleSaveCount(t)}
                            className="p-0.5 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span
                          onClick={() => {
                            if (canEdit) {
                              setEditingId(t.id);
                              setEditCount(t.current_followers);
                            }
                          }}
                          className={`text-xs font-black text-slate-900 ${canEdit ? 'cursor-pointer hover:underline' : ''}`}
                          title="Click to update"
                        >
                          {t.current_followers.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Net Gain</span>
                      <span className="text-xs font-black text-emerald-600 flex items-center justify-center">
                        <ArrowUpRight className="w-3 h-3" />
                        <span>+{netGain.toLocaleString()}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                    <div className="flex items-center space-x-1.5 text-slate-500">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Managed by: <strong className="text-slate-800">{t.assigned_to.first_name} {t.assigned_to.last_name}</strong>
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                      +{percentGain}% MoM
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
