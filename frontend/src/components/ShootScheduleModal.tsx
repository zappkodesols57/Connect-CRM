import React, { useState } from 'react';
import { X, Video, Calendar, Clock, MapPin, Users, Plus, Bell, CheckCircle2 } from 'lucide-react';
import { ShootSchedule, Client, Employee } from '../types';
import { INITIAL_EMPLOYEES } from '../data/mockData';

interface ShootScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  shoots: ShootSchedule[];
  clients: Client[];
  onAddShoot: (shoot: Omit<ShootSchedule, 'id' | 'created_at'>) => void;
  canSchedule?: boolean;
}

export const ShootScheduleModal: React.FC<ShootScheduleModalProps> = ({
  isOpen,
  onClose,
  shoots,
  clients,
  onAddShoot,
  canSchedule = true,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number>(clients[0]?.id || 1);
  const [shootDate, setShootDate] = useState('2026-10-15');
  const [shootTime, setShootTime] = useState('02:00 PM - 05:00 PM');
  const [location, setLocation] = useState('');
  const [brief, setBrief] = useState('');
  const [reminderNote, setReminderNote] = useState('');
  const [selectedCrewIds, setSelectedCrewIds] = useState<number[]>([INITIAL_EMPLOYEES[0]?.id, INITIAL_EMPLOYEES[1]?.id]);

  if (!isOpen) return null;

  const handleToggleCrew = (empId: number) => {
    if (selectedCrewIds.includes(empId)) {
      setSelectedCrewIds(selectedCrewIds.filter((id) => id !== empId));
    } else {
      setSelectedCrewIds([...selectedCrewIds, empId]);
    }
  };

  const handleCreateShoot = (e: React.FormEvent) => {
    e.preventDefault();
    const cObj = clients.find((c) => c.id === selectedClientId);
    const crewMembers = INITIAL_EMPLOYEES.filter((emp) => selectedCrewIds.includes(emp.id));

    onAddShoot({
      client_id: selectedClientId,
      client_name: cObj?.name || 'Client',
      shoot_date: shootDate,
      shoot_time: shootTime,
      location: location || `${cObj?.name} Campus`,
      brief: brief || 'Doctor byte coverage and facility reels',
      assigned_crew: crewMembers,
      status: 'UPCOMING',
      reminder_note: reminderNote,
    });

    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 rounded-2xl">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">On-Site Client Shoots & Production Schedule</h3>
              <p className="text-xs text-amber-100">Coordinate videographers, managers, and hospital shoots</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs">
            <Bell className="w-4 h-4 text-amber-600" />
            <span className="font-bold text-slate-800">
              {shoots.filter((s) => s.status === 'UPCOMING').length} Upcoming Shoot Missions
            </span>
          </div>
          {canSchedule && (
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAdding ? 'Close Schedule Form' : 'Schedule New Shoot'}</span>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Add Form */}
          {isAdding && (
            <form onSubmit={handleCreateShoot} className="p-5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3 text-xs mb-4">
              <h4 className="font-bold text-amber-900 text-sm">Schedule Production Shoot Day</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Client Destination</label>
                  <select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(Number(e.target.value))}
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
                  <label className="font-semibold text-slate-700 block mb-1">Shoot Date</label>
                  <input
                    type="date"
                    required
                    value={shootDate}
                    onChange={(e) => setShootDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2 bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Shoot Time Window</label>
                  <input
                    type="text"
                    value={shootTime}
                    onChange={(e) => setShootTime(e.target.value)}
                    placeholder="e.g. 02:00 PM - 05:30 PM"
                    className="w-full border border-slate-300 rounded-xl p-2 bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Exact Location / Department</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. OPD Wing, 2nd Floor"
                    className="w-full border border-slate-300 rounded-xl p-2 bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Shoot Deliverable Brief & Topics</label>
                  <textarea
                    rows={2}
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    placeholder="e.g. 3 Doctor reel bytes + 1 ICU infrastructure video"
                    className="w-full border border-slate-300 rounded-xl p-2 bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Equipment & Reminder Note for Team</label>
                  <input
                    type="text"
                    value={reminderNote}
                    onChange={(e) => setReminderNote(e.target.value)}
                    placeholder="e.g. Bring dual collar mic, extra camera battery, Gimbal"
                    className="w-full border border-slate-300 rounded-xl p-2 bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1.5">Assign Production Crew Members</label>
                  <div className="flex flex-wrap gap-2">
                    {INITIAL_EMPLOYEES.map((emp) => {
                      const isSelected = selectedCrewIds.includes(emp.id);
                      return (
                        <button
                          type="button"
                          key={emp.id}
                          onClick={() => handleToggleCrew(emp.id)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition ${
                            isSelected
                              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span>{emp.first_name} ({emp.designation.split(' ')[0]})</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition"
                >
                  Save Shoot Schedule
                </button>
              </div>
            </form>
          )}

          {/* Shoots Stream */}
          <div className="space-y-3">
            {shoots.map((s) => (
              <div
                key={s.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-amber-400 transition space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-black text-[10px] uppercase tracking-wider">
                        {s.client_name}
                      </span>
                      <span className="text-xs font-bold text-slate-400">•</span>
                      <span className="text-xs font-bold text-slate-900">{s.shoot_date}</span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{s.shoot_time}</span>
                    </h4>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                    {s.status}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{s.location}</span>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  <strong>Brief:</strong> {s.brief}
                </p>

                {s.reminder_note && (
                  <div className="flex items-center space-x-2 text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200/60 font-medium">
                    <Bell className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span><strong>Equipment & Reminder:</strong> {s.reminder_note}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-500 font-medium">Assigned Crew:</span>
                    <div className="flex items-center space-x-1">
                      {s.assigned_crew.map((c) => (
                        <span key={c.id} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px]">
                          {c.first_name} {c.last_name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
