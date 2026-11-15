import React from 'react';
import {
  TrendingUp,
  FolderGit2,
  Bug,
  Users,
  CheckCircle2,
  Clock,
  Download,
  Calendar,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, isProjectManager } = useAuth();

  const sprintBurndownData = [
    { week: 'W1', planned: 10, actual: 12 },
    { week: 'W2', planned: 20, actual: 22 },
    { week: 'W3', planned: 30, actual: 28 },
    { week: 'W4', planned: 40, actual: 38 },
    { week: 'W5', planned: 50, actual: 52 },
    { week: 'W6', planned: 60, actual: 58 },
    { week: 'W7', planned: 70, actual: 68 },
    { week: 'W8', planned: 80, actual: null },
    { week: 'W9', planned: 90, actual: null },
    { week: 'W10', planned: 100, actual: null }
  ];

  const exportSprintReport = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden box-border space-y-4 sm:space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-slate-900 to-orange-950/30 border border-slate-800 p-4 sm:p-5 rounded-2xl w-full">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/30">
              Sprint 7 Active
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> 2026 Academic Term
            </span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
            Welcome back, {user?.name || (isProjectManager ? 'Soyeb Akram' : 'Shihab Shoron')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            DevCollab workspace overview, milestone progress, and sprint health metrics for UITS CSE Dept.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={exportSprintReport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition cursor-pointer"
            title="Print or save as PDF"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Sprint Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid: 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 w-full">
        {/* Active Projects */}
        <div className="bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Active Projects</span>
            <FolderGit2 className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-bold text-white flex items-baseline gap-2">
              3
              <span className="text-[10px] sm:text-xs font-medium text-emerald-400">All on track</span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">
              Core, Backend, Prototype
            </p>
          </div>
        </div>

        {/* Sprint Velocity */}
        <div className="bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Sprint Velocity</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-bold text-white">68%</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>
        </div>

        {/* Bug Resolution */}
        <div className="bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Bug Resolution</span>
            <Bug className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-bold text-rose-400 flex items-baseline gap-1.5">
              2 <span className="text-[10px] sm:text-xs text-slate-400 font-normal">open / 2 resolved</span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-1">
              50% resolution rate
            </p>
          </div>
        </div>

        {/* Active Team */}
        <div className="bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Active Team</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-bold text-white flex items-baseline gap-1.5">
              4 <span className="text-[10px] sm:text-xs text-emerald-400 font-medium">Collaborators</span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">
              1 PM, 3 Developers
            </p>
          </div>
        </div>
      </div>

      {/* 10-Week Sprint Burndown Chart */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 w-full max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              10-Week Sprint Burndown & Velocity
            </h3>
            <p className="text-xs text-slate-400">
              Planned progress vs. current actual completion across project sprints
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
              <span className="text-slate-400">Planned (%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span className="text-slate-200 font-medium">Actual (%)</span>
            </div>
          </div>
        </div>

        <div className="pt-5 pb-2 w-full">
          <div className="h-44 sm:h-52 flex items-end justify-between gap-1 sm:gap-2 px-1 w-full box-border">
            {sprintBurndownData.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group min-w-0">
                <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-36 sm:h-44">
                  <div
                    className="w-1.5 sm:w-3 bg-slate-700/80 rounded-t"
                    style={{ height: `${item.planned}%` }}
                    title={`Planned Week ${idx + 1}: ${item.planned}%`}
                  ></div>
                  {item.actual !== null ? (
                    <div
                      className="w-2 sm:w-4 bg-orange-500 hover:bg-orange-400 rounded-t transition"
                      style={{ height: `${item.actual}%` }}
                      title={`Actual Week ${idx + 1}: ${item.actual}%`}
                    ></div>
                  ) : (
                    <div className="w-2 sm:w-4 border-b-2 border-slate-700"></div>
                  )}
                </div>
                <span className="text-[10px] sm:text-xs text-slate-500 font-mono mt-2 truncate">
                  {item.week}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones & Academic Supervision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-500" />
            Current Sprint Milestones
          </h3>
          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Frontend Mobile Responsiveness</div>
                <div className="text-xs text-slate-400">Zero horizontal scroll on phone viewports</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                COMPLETED
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Project Manager Audit Activity</div>
                <div className="text-xs text-slate-400">Restricted RBAC log and Excel export</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                ACTIVE
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">FastAPI Endpoints & DB Alembic</div>
                <div className="text-xs text-slate-400">PostgreSQL migrations and CORS config</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                IN REVIEW
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            Academic Supervision & Team
          </h3>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Supervisor:</span>
              <span className="text-white font-medium">Dr. Umme Khatuna Jannat</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Institution:</span>
              <span className="text-white font-medium">University of Information Technology & Sciences (UITS)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Core Team:</span>
              <span className="text-slate-200">Soyeb Akram & Shihab Abdullah Shoron</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-800">
              <span className="text-slate-400">Current Role:</span>
              <span className={`font-semibold ${isProjectManager ? 'text-orange-400' : 'text-blue-400'}`}>
                {isProjectManager ? 'Project Manager (Full Permissions)' : 'Developer (Standard Access)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}