import React from 'react';
import {
  Users,
  Clock,
  Video,
  Image as ImageIcon,
  Mail,
  Phone,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Shield,
  Check,
} from 'lucide-react';
import { Employee, Client } from '../types';

interface AdminTeamViewProps {
  employees: Employee[];
  clients: Client[];
  onFilterEmployeeTasks: (employeeId: number) => void;
  onToggleManagerAccess?: (employeeId: number) => void;
}

export const AdminTeamView: React.FC<AdminTeamViewProps> = ({
  employees,
  clients,
  onFilterEmployeeTasks,
  onToggleManagerAccess,
}) => {
  // Calculate workload per employee across all clients
  const getEmployeeStats = (empId: number) => {
    let totalItems = 0;
    let reels = 0;
    let images = 0;
    const clientNames = new Set<string>();

    clients.forEach((c) => {
      const items = c.calendars?.[0]?.items || [];
      items.forEach((item) => {
        if (item.assigned_to?.id === empId) {
          totalItems++;
          if (item.format === 'REEL') reels++;
          else images++;
          clientNames.add(c.name);
        }
      });
    });

    return {
      total: totalItems,
      reels,
      images,
      clients: Array.from(clientNames),
    };
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>ZEMS Live Sync Connected</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Social Media Team & Attendance
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Synced live with ZEMS Employee Clock-In API (zems.zappcode.in). Assign calendar tasks & track designer/editor workloads.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Staff Count</span>
            <span className="text-sm font-extrabold text-slate-800">{employees.length} Members</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Manager Access</span>
            <span className="text-sm font-extrabold text-indigo-600">
              {employees.filter((e) => e.is_manager || e.can_assign_tasks).length} with Assignment Rights
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Team Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((emp) => {
          const stats = getEmployeeStats(emp.id);

          return (
            <div
              key={emp.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-200 p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Employee Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 rounded-2xl ${
                        emp.avatar_color || 'bg-blue-600'
                      } text-white font-extrabold text-base flex items-center justify-center shadow`}
                    >
                      {emp.first_name[0]}
                      {emp.last_name[0]}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">
                        {emp.first_name} {emp.last_name}
                      </h3>
                      <span className="text-xs font-semibold text-blue-600 block">
                        {emp.designation}
                      </span>
                    </div>
                  </div>

                  {/* Attendance Badge */}
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Clocked In</span>
                  </span>
                </div>

                {/* Contact Info */}
                <div className="mt-3.5 space-y-1 text-xs text-slate-500">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{emp.email_id}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>+91 {emp.mobile_number}</span>
                  </div>
                </div>

                {/* Workload Metric */}
                <div className="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">October Deliverables</span>
                    <span className="font-extrabold text-slate-900">
                      {stats.total} Assigned
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-600">
                    {stats.reels > 0 && (
                      <span className="flex items-center space-x-1 font-semibold text-purple-700">
                        <Video className="w-3.5 h-3.5" />
                        <span>{stats.reels} Reels</span>
                      </span>
                    )}
                    {stats.images > 0 && (
                      <span className="flex items-center space-x-1 font-semibold text-blue-700">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>{stats.images} Posts</span>
                      </span>
                    )}
                    {stats.total === 0 && (
                      <span className="text-slate-400 italic">Available for new assignments</span>
                    )}
                  </div>

                  {stats.clients.length > 0 && (
                    <div className="text-[10px] text-slate-400 truncate">
                      Active on: {stats.clients.join(', ')}
                    </div>
                  )}
                </div>

                {/* Manager Access & Task Assignment Permission Control */}
                <div
                  className={`mt-4 p-3.5 rounded-xl border transition-all ${
                    emp.is_manager || emp.can_assign_tasks
                      ? 'bg-gradient-to-r from-indigo-50/70 to-purple-50/70 border-indigo-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                          emp.is_manager || emp.can_assign_tasks
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {emp.is_manager || emp.can_assign_tasks ? (
                          <ShieldCheck className="w-4 h-4" />
                        ) : (
                          <Shield className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <span
                          className={`text-xs font-bold block leading-tight ${
                            emp.is_manager || emp.can_assign_tasks ? 'text-indigo-900' : 'text-slate-700'
                          }`}
                        >
                          {emp.is_manager || emp.can_assign_tasks
                            ? 'Manager (Assigns Tasks)'
                            : 'Team Member (Execution)'}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {emp.is_manager || emp.can_assign_tasks
                            ? 'Can delegate & assign tasks'
                            : 'Executes assigned work'}
                        </span>
                      </div>
                    </div>

                    {/* Toggle Switch Button */}
                    <button
                      type="button"
                      onClick={() => onToggleManagerAccess?.(emp.id)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        emp.is_manager || emp.can_assign_tasks ? 'bg-indigo-600' : 'bg-slate-300'
                      }`}
                      title={
                        emp.is_manager || emp.can_assign_tasks
                          ? 'Click to revoke Manager task assignment rights'
                          : 'Click to grant Manager task assignment rights'
                      }
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          emp.is_manager || emp.can_assign_tasks ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">EMS ID: #{emp.id}</span>
                <button
                  onClick={() => onFilterEmployeeTasks(emp.id)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                >
                  <span>View Tasks</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
