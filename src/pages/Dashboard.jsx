import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FolderGit2, 
  FolderKanban, 
  Bug, 
  Clock, 
  Users, 
  Calendar, 
  ArrowUpRight, 
  Printer, 
  TrendingUp, 
  Activity, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  X,
  Target
} from 'lucide-react';

export default function Dashboard() {
  const { user, isProjectManager } = useAuth();
  const [showReportModal, setShowReportModal] = useState(false);
  const [showStandupModal, setShowStandupModal] = useState(false);
  const [copiedStandup, setCopiedStandup] = useState(false);

  const projectStats = {
    totalProjects: 3,
    activeTasks: 4,
    completedTasks: 1,
    openBugs: 2,
    resolvedBugs: 2,
    sprintProgress: 68,
  };

  const sprintWeeks = [
    { week: 'W1', name: 'Req & Design', planned: 10, actual: 10 },
    { week: 'W2', name: 'UI & Wireframes', planned: 20, actual: 20 },
    { week: 'W3', name: 'Frontend Setup', planned: 35, actual: 35 },
    { week: 'W4', name: 'Auth & Shell', planned: 50, actual: 50 },
    { week: 'W5', name: 'Projects & Tasks', planned: 65, actual: 68 },
    { week: 'W6', name: 'Kanban Engine', planned: 75, actual: null },
    { week: 'W7', name: 'Bug Lifecycle', planned: 85, actual: null },
    { week: 'W8', name: 'FastAPI Backend', planned: 90, actual: null },
    { week: 'W9', name: 'Integration', planned: 95, actual: null },
    { week: 'W10', name: 'Final Defense', planned: 100, actual: null },
  ];

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

  const auditActivityLog = [
    {
      action: 'PM Task Progression',
      actor: 'Soyeb Akram (PM)',
      detail: 'Moved "Setup JWT Authentication API" to DONE',
      timestamp: '2 hours ago',
      type: 'TASK'
    },
    {
      action: 'Defect Logged',
      actor: 'Shihab Shoron (Dev)',
      detail: 'Reported Bug #101: "Login button not working" with HIGH priority',
      timestamp: '4 hours ago',
      type: 'BUG'
    },
    {
      action: 'Milestone Advanced',
      actor: 'System Automation',
      detail: 'DevCollab System Core reached 65% completion velocity',
      timestamp: 'Yesterday',
      type: 'SYSTEM'
    },
    {
      action: 'Defect Resolved',
      actor: 'Shihab Shoron (Dev)',
      detail: 'Marked Bug #102: "FastAPI CORS header missing" as RESOLVED',
      timestamp: 'Oct 08, 2026',
      type: 'BUG'
    }
  ];

  const generatedStandupText = `🎯 DevCollab Daily Standup (${new Date().toLocaleDateString()})
Name: ${user?.name} [${isProjectManager ? 'Project Manager' : 'Developer'}]

 Yesterday Completed:
• Setup JWT Authentication API & role authorization
• Verified PM-only Kanban movement guards

⚡ Today's Plan:
• Continue PostgreSQL Schema modeling with Alembic
• Integrate real-time notification listener

🛑 Blockers / Defect Alerts:
• Bug #101: "Login button mobile viewport" needs review
• Sprint Velocity: 68% (Ahead of Week 5 target)`;

  const handleCopyStandup = () => {
    navigator.clipboard.writeText(generatedStandupText);
    setCopiedStandup(true);
    setTimeout(() => setCopiedStandup(false), 2000);
  };

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
          <button
            onClick={() => setShowStandupModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-500/30 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Sparkles size={15} /> Daily Standup
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <FileText size={15} /> Export Report
          </button>

          <Link
            to="/kanban"
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-orange-600/20 transition cursor-pointer"
          >
            <FolderKanban size={15} /> Kanban
          </Link>
        </div>
      </div>

      {/* Top 4 Health Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Visual Burndown / Velocity Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-orange-500" />
              <h2 className="text-base font-bold text-white tracking-tight">10-Week Sprint Burndown & Velocity</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Planned progress vs. current actual completion across project sprints</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-3 rounded bg-slate-700 inline-block" /> Planned (%)
            </span>
            <span className="flex items-center gap-1.5 text-orange-400 font-semibold">
              <span className="w-3 h-3 rounded bg-orange-500 inline-block" /> Actual (%)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-10 gap-2 items-end h-40 pt-4 px-2 border-b border-slate-800">
          {sprintWeeks.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center h-full justify-end group">
              <div className="w-full flex items-end justify-center gap-1 h-28">
                <div 
                  className="w-2.5 bg-slate-700/80 rounded-t transition-all group-hover:bg-slate-600"
                  style={{ height: `${item.planned}%` }}
                  title={`Planned: ${item.planned}%`}
                />
                {item.actual !== null ? (
                  <div 
                    className="w-2.5 bg-orange-500 rounded-t transition-all group-hover:bg-orange-400 shadow-md shadow-orange-500/20"
                    style={{ height: `${item.actual}%` }}
                    title={`Actual: ${item.actual}%`}
                  />
                ) : (
                  <div className="w-2.5 h-1 bg-slate-800 rounded" />
                )}
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-2">{item.week}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-[11px] text-slate-500 pt-2 px-1">
          <span>Sprint Kickoff (Week 1)</span>
          <span className="text-orange-400/90 font-medium">Currently in Week 5 (68% velocity)</span>
          <span>Final Defense (Week 10)</span>
        </div>
      </div>

      {/* Two Column: Deadlines & (Audit Log for PM OR Developer Work Focus for Dev) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

        {/* Right Column: PM sees Audit Stream, Developer sees Personal Work Focus */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          {isProjectManager ? (
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-orange-400" />
                  <h2 className="text-base font-bold text-white tracking-tight">Audit Stream (PM Only)</h2>
                </div>
                <Link to="/audit" className="text-[11px] text-orange-400 hover:text-orange-300 font-semibold">
                  Full Log →
                </Link>
              </div>
              <p className="text-xs text-slate-400 mb-5">Chronological record of team operations</p>

              <div className="space-y-4">
                {auditActivityLog.map((log, i) => (
                  <div key={i} className="flex gap-3 text-xs">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      log.type === 'TASK' ? 'bg-orange-500' : log.type === 'BUG' ? 'bg-rose-500' : 'bg-emerald-500'
                    }`} />
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-white">{log.action}</span>
                        <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                      </div>
                      <p className="text-slate-400 leading-relaxed mt-0.5">{log.detail}</p>
                      <span className="text-[10px] text-slate-500 block mt-1">Actor: {log.actor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Target size={16} className="text-blue-400" />
                <h2 className="text-base font-bold text-white tracking-tight">Developer Sprint Focus</h2>
              </div>
              <p className="text-xs text-slate-400 mb-5">Your assigned tasks and defects</p>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white">Active Assigned Tasks</span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold text-[10px]">3 Tasks</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">Design PostgreSQL Schema with Alembic</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white">Reported Defects</span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-[10px]">1 Open</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">Login button on mobile viewports</p>
                </div>
              </div>

              <div className="mt-5">
                <Link
                  to="/kanban"
                  className="block text-center w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
                >
                  Go to My Tasks
                </Link>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-slate-800/80 mt-6">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">System Pipeline</span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                CI/CD Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Standup Modal */}
      {showStandupModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 max-w-lg w-full rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-orange-400" />
                <h3 className="text-base font-bold text-white">Daily Scrum Standup Summary</h3>
              </div>
              <button
                onClick={() => setShowStandupModal(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Automated Agile standup report generated from your current task statuses and blocking issues:
            </p>

            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed mb-4">
              {generatedStandupText}
            </pre>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">Ready to share in Slack, Teams, or Discord</span>
              <button
                onClick={handleCopyStandup}
                className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-orange-600/20 transition cursor-pointer"
              >
                {copiedStandup ? (
                  <>
                    <Check size={14} className="text-emerald-300" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy Standup
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Sprint Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white text-slate-900 max-w-2xl w-full rounded-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-6">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">
                  Academic Progress Report
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">DevCollab Sprint Audit</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generated for Dr. Umme Khatuna Jannat • UITS Department of CSE
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                <Printer size={14} /> Print / Save as PDF
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 rounded-xl text-xs">
              <div>
                <span className="text-slate-500 block">Project Managers & Developers:</span>
                <strong>Soyeb Akram (04324205101089)</strong><br />
                <strong>Shihab Abdullah Shoron (04324205101083)</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Live Deployment:</span>
                <span className="font-mono text-blue-600">https://soyebakram.github.io/Devcollab-frontend/</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6 text-center text-xs">
              <div className="p-3 bg-slate-100 rounded-lg">
                <span className="text-slate-500 block">Sprint Velocity</span>
                <strong className="text-lg text-slate-900">68%</strong>
              </div>
              <div className="p-3 bg-slate-100 rounded-lg">
                <span className="text-slate-500 block">Active Tasks</span>
                <strong className="text-lg text-slate-900">4</strong>
              </div>
              <div className="p-3 bg-slate-100 rounded-lg">
                <span className="text-slate-500 block">Defect Resolution</span>
                <strong className="text-lg text-slate-900">50% (2/4)</strong>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}