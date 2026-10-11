import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FolderGit2, 
  FolderKanban, 
  Bug, 
  Clock, 
  Users,
  Calendar,
  ArrowUpRight
} from 'lucide-react';

export default function Dashboard() {
  const { user, isProjectManager } = useAuth();

  const projectStats = {
    totalProjects: 3,
    activeTasks: 4,
    completedTasks: 1,
    openBugs: 2,
    resolvedBugs: 2,
    sprintProgress: 68,
  };

  const upcomingDeadlines = [
    {
      title: 'Design PostgreSQL Schema with Alembic',
      type: 'Task',
      project: 'FastAPI Backend',
      due: '2026-10-18',
      daysLeft: '6 days',
      urgency: 'URGENT',
    },
    {
      title: 'Build Kanban Drag & Drop View',
      type: 'Task',
      project: 'DevCollab Core',
      due: '2026-10-20',
      daysLeft: '8 days',
      urgency: 'NORMAL',
    },
    {
      title: 'FastAPI Backend & DB Migrations',
      type: 'Project',
      project: 'FastAPI Backend',
      due: '2026-10-30',
      daysLeft: '18 days',
      urgency: 'NORMAL',
    },
  ];

  const recentActivity = [
    {
      text: 'Soyeb Akram updated status of Setup JWT Authentication API to Done',
      time: '2 hours ago',
      category: 'Task',
    },
    {
      text: 'Shihab Shoron reported bug Login button not working',
      time: '4 hours ago',
      category: 'Bug',
    },
    {
      text: 'DevCollab System Core project reached 65% completion',
      time: '1 day ago',
      category: 'Project',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800/80 border border-slate-800 rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
              isProjectManager 
                ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' 
                : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            }`}>
              {isProjectManager ? 'Project Manager Mode' : 'Developer Workspace'}
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Hello, {user?.name}
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl leading-relaxed">
            Welcome to DevCollab. Here is the operational health, active tasks, and upcoming milestones for your team.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/kanban"
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-orange-600/20 transition cursor-pointer"
          >
            <FolderKanban size={16} /> Open Kanban
          </Link>
          <Link
            to="/bugs"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Bug size={16} /> View Bugs
          </Link>
        </div>
      </div>

      {/* Top 4 Health Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Projects */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Projects</span>
            <FolderGit2 size={18} className="text-orange-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{projectStats.totalProjects}</span>
            <span className="text-xs text-emerald-400 font-semibold">All on track</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">DevCollab Core, Backend, Prototype</p>
        </div>

        {/* Task Progress */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Sprint Velocity</span>
            <FolderKanban size={18} className="text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{projectStats.sprintProgress}%</span>
            <span className="text-xs text-slate-400">Target: 80%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${projectStats.sprintProgress}%` }} />
          </div>
        </div>

        {/* Bug Health */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Bug Resolution</span>
            <Bug size={18} className="text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-400">{projectStats.openBugs}</span>
            <span className="text-xs text-slate-400">open / {projectStats.resolvedBugs} resolved</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">50% resolution rate</p>
        </div>

        {/* Team Members */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Team</span>
            <Users size={18} className="text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">4</span>
            <span className="text-xs text-emerald-400 font-semibold">Collaborators</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">1 PM, 3 Developers</p>
        </div>
      </div>

      {/* Two Column Section: Upcoming Deadlines & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Deadlines */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Approaching Deadlines</h2>
              <p className="text-xs text-slate-400 mt-0.5">Tasks and milestones due in the current sprint</p>
            </div>
            <Link to="/kanban" className="text-xs text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1">
              View all <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingDeadlines.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition gap-3"
              >
                <div className="flex items-start gap-3">
                  <span className={`p-2 rounded-lg text-xs font-bold mt-0.5 ${
                    item.urgency === 'URGENT' 
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    <Clock size={16} />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.project} • <span className="text-slate-300">{item.type}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="flex items-center gap-1.5 text-xs text-slate-300">
                    <Calendar size={13} className="text-orange-400" />
                    {item.due}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    item.urgency === 'URGENT'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {item.daysLeft}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Workflow Activity Feed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight mb-1">Recent Team Activity</h2>
            <p className="text-xs text-slate-400 mb-5">Latest updates across projects & bugs</p>

            <div className="space-y-4">
              {recentActivity.map((act, i) => (
                <div key={i} className="flex gap-3 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-slate-300 leading-relaxed">{act.text}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 mt-6">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">System Status</span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}