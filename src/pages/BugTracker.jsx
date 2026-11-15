import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Bug,
  Plus,
  Clock,
  Check,
  RotateCcw,
  Trash2,
  Download,
  Search,
  Sparkles,
  Zap
} from 'lucide-react';

function getSuggestedSolution(title = '', description = '', stackTrace = '') {
  const text = `${title} ${description} ${stackTrace}`.toLowerCase();
  if (text.includes('jwt') || text.includes('401') || text.includes('token') || text.includes('unauthorized')) {
    return 'Check Authorization: Bearer <token> header, verify JWT_SECRET / expiry on FastAPI, and redirect to /login on 401.';
  }
  if (text.includes('cors') || text.includes('access-control-allow-origin') || text.includes('403')) {
    return 'Add your frontend origin (e.g. GitHub Pages URL & localhost) to FastAPI CORSMiddleware allow_origins.';
  }
  if (text.includes('typeerror') || text.includes('undefined') || text.includes('null') || text.includes('cannot read')) {
    return 'Use optional chaining (?.) like user?.role and verify state/props initialization before rendering.';
  }
  if (text.includes('alembic') || text.includes('psycopg') || text.includes('postgres') || text.includes('duplicateobject')) {
    return 'Run "alembic upgrade head" with checkfirst=True or guard enum creation in your migration script.';
  }
  if (text.includes('overflow') || text.includes('mobile') || text.includes('scroll')) {
    return 'Apply min-w-0, break-words, and overflow-x-hidden on card containers for 390px mobile viewports.';
  }
  if (text.includes('network') || text.includes('failed to fetch') || text.includes('404')) {
    return 'Verify the /api/v1/ endpoint URL, use HashRouter for GitHub Pages, and ensure the backend server is running.';
  }
  return 'Inspect the stack trace in browser DevTools and wrap async API calls in try/catch with fallback state.';
}

const INITIAL_BUGS = [
  {
    id: 101,
    title: 'Login button not working on mobile viewports',
    description: 'When tapping Sign In on screen widths below 640px, the submit handler does not trigger.',
    priority: 'HIGH',
    status: 'OPEN',
    reportedBy: 'Shihab Shoron',
    assignedTo: 'Shihab Shoron',
    createdAt: '2026-10-10',
    stackTrace: 'TypeError: Cannot read properties of undefined (reading "role") at Login.handleSubmit',
    autoDetected: false,
  },
  {
    id: 102,
    title: 'FastAPI CORS header missing on /api/v1/tasks endpoint',
    description: 'Preflight OPTIONS request returns 403 Forbidden when accessed from local development server.',
    priority: 'HIGH',
    status: 'RESOLVED',
    reportedBy: 'Soyeb Akram',
    assignedTo: 'Shihab Shoron',
    createdAt: '2026-10-08',
    stackTrace: 'Access-Control-Allow-Origin header missing in response to preflight request',
    autoDetected: false,
  },
  {
    id: 103,
    title: 'Kanban cards overflow on long task descriptions',
    description: 'Descriptions exceeding 120 characters cause horizontal scrolling in the TO DO column.',
    priority: 'MEDIUM',
    status: 'OPEN',
    reportedBy: 'Soyeb Akram',
    assignedTo: 'Soyeb Akram',
    createdAt: '2026-10-11',
    stackTrace: '',
    autoDetected: false,
  },
  {
    id: 104,
    title: 'Alembic migration fails on duplicate role constraint',
    description: 'PostgreSQL rejects user enum redefinition when running upgrade head on clean DB.',
    priority: 'LOW',
    status: 'RESOLVED',
    reportedBy: 'Shihab Shoron',
    assignedTo: 'Shihab Shoron',
    createdAt: '2026-10-06',
    stackTrace: 'psycopg2.errors.DuplicateObject: type "user_role_enum" already exists',
    autoDetected: false,
  },
];

export default function BugTracker() {
  const { user, isProjectManager } = useAuth();
  const [bugs, setBugs] = useState(INITIAL_BUGS);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('HIGH');
  const [newAssignee, setNewAssignee] = useState('Shihab Shoron');
  const [newStackTrace, setNewStackTrace] = useState('');

  // Auto-Detect Runtime Errors & Unhandled Promise Rejections
  useEffect(() => {
    const logAutoBug = (title, stackTrace) => {
      if (!title) return;
      setBugs((prev) => [
        {
          id: Date.now() + Math.floor(Math.random() * 1000),
          title: title.slice(0, 100),
          description: 'Automatically captured by DevCollab runtime error listener.',
          priority: 'HIGH',
          status: 'OPEN',
          reportedBy: 'Auto-Detector',
          assignedTo: 'Shihab Shoron',
          createdAt: new Date().toISOString().split('T')[0],
          stackTrace: stackTrace || title,
          autoDetected: true,
        },
        ...prev,
      ]);
    };

    const handleWindowError = (event) => {
      logAutoBug(
        event.message || 'Unhandled Runtime JavaScript Error',
        event.error?.stack || `${event.filename || 'app'}:${event.lineno || 0}`
      );
    };

    const handleRejection = (event) => {
      const msg = event.reason?.message || String(event.reason || 'Unhandled Promise Rejection');
      logAutoBug(msg, event.reason?.stack || msg);
    };

    window.addEventListener('error', handleWindowError);
    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      window.removeEventListener('error', handleWindowError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  const simulateRuntimeError = () => {
    const samples = [
      {
        title: 'JWT Session Expired (401 Unauthorized) on Kanban Move',
        description: 'Auto-detected 401 response while updating task stage.',
        stackTrace: 'AuthError: JWT token expired at axiosInterceptor.js:54:7',
      },
      {
        title: 'CORS Blocked on /api/v1/bugs',
        description: 'Preflight OPTIONS request blocked by missing CORS header.',
        stackTrace: 'Access-Control-Allow-Origin header missing on /api/v1/bugs',
      },
      {
        title: 'TypeError: Cannot read properties of undefined (reading "stage")',
        description: 'Runtime error caught in KanbanBoard component.',
        stackTrace: 'TypeError: Cannot read properties of undefined (reading "stage") at KanbanPage.jsx:42:15',
      },
    ];
    const pick = samples[Math.floor(Math.random() * samples.length)];
    setBugs((prev) => [
      {
        id: Date.now(),
        title: pick.title,
        description: pick.description,
        priority: 'HIGH',
        status: 'OPEN',
        reportedBy: 'Auto-Detector',
        assignedTo: 'Shihab Shoron',
        createdAt: new Date().toISOString().split('T')[0],
        stackTrace: pick.stackTrace,
        autoDetected: true,
      },
      ...prev,
    ]);
  };

  const toggleStatus = (bugId) => {
    setBugs((prev) =>
      prev.map((bug) =>
        bug.id === bugId
          ? { ...bug, status: bug.status === 'OPEN' ? 'RESOLVED' : 'OPEN' }
          : bug
      )
    );
  };

  const deleteBug = (bugId) => {
    if (!isProjectManager) return;
    setBugs((prev) => prev.filter((b) => b.id !== bugId));
  };

  const handleCreateBug = (e) => {
    e.preventDefault();
    const createdBug = {
      id: Date.now(),
      title: newTitle,
      description: newDesc,
      priority: newPriority,
      status: 'OPEN',
      reportedBy: user?.name || 'Developer',
      assignedTo: newAssignee,
      createdAt: new Date().toISOString().split('T')[0],
      stackTrace: newStackTrace,
      autoDetected: false,
    };
    setBugs([createdBug, ...bugs]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewStackTrace('');
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Title', 'Priority', 'Status', 'AutoDetected', 'Reported By', 'Assigned To', 'Date', 'Suggested Solution'];
    const rows = bugs.map((b) => [
      b.id,
      `"${b.title.replace(/"/g, '""')}"`,
      b.priority,
      b.status,
      b.autoDetected ? 'YES' : 'NO',
      `"${b.reportedBy}"`,
      `"${b.assignedTo}"`,
      b.createdAt,
      `"${getSuggestedSolution(b.title, b.description, b.stackTrace).replace(/"/g, '""')}"`,
    ]);
    const csvString = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `devcollab-bugs-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredBugs = bugs.filter((b) => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || b.priority === priorityFilter;
    const matchesSearch = searchQuery
      ? b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.reportedBy.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const openCount = bugs.filter((b) => b.status === 'OPEN').length;
  const resolvedCount = bugs.filter((b) => b.status === 'RESOLVED').length;

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/20';
    }
  };

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Bug & Issue Tracker</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Auto-Detect ON
            </span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Automatically catches runtime errors and suggests instant fixes
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={simulateRuntimeError}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            <Zap size={13} /> Simulate Error
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            <Download size={13} /> Export CSV
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-rose-600/20 transition cursor-pointer"
          >
            <Plus size={15} /> Report Bug
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-6">
        <div className="bg-slate-900 border border-slate-800 p-3 sm:p-4 rounded-xl">
          <p className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase">Total</p>
          <p className="text-lg sm:text-2xl font-bold text-white mt-0.5">{bugs.length}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 sm:p-4 rounded-xl">
          <p className="text-[10px] sm:text-xs text-rose-400 font-semibold uppercase">Open</p>
          <p className="text-lg sm:text-2xl font-bold text-rose-400 mt-0.5">{openCount}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 sm:p-4 rounded-xl">
          <p className="text-[10px] sm:text-xs text-emerald-400 font-semibold uppercase">Resolved</p>
          <p className="text-lg sm:text-2xl font-bold text-emerald-400 mt-0.5">{resolvedCount}</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-xl mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
            {['ALL', 'OPEN', 'RESOLVED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2 py-0.5 rounded font-medium transition cursor-pointer ${
                  statusFilter === status
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div className="relative w-full sm:w-44">
          <Search size={13} className="absolute left-2.5 top-2 text-slate-400" />
          <input
            type="text"
            placeholder="Search bugs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-3 min-w-0">
        {filteredBugs.map((bug) => {
          const suggestion = getSuggestedSolution(bug.title, bug.description, bug.stackTrace);
          return (
            <div
              key={bug.id}
              className={`p-4 rounded-xl border transition bg-slate-900/70 min-w-0 overflow-hidden ${
                bug.status === 'RESOLVED'
                  ? 'border-slate-800/80 opacity-75'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Row 1: Badges & Timestamp */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      bug.status === 'OPEN'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {bug.status}
                  </span>

                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityStyle(
                      bug.priority
                    )}`}
                  >
                    {bug.priority}
                  </span>

                  {bug.autoDetected && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-amber-500/10 text-amber-300 border-amber-500/30">
                      ⚡ Auto-Detected
                    </span>
                  )}
                </div>

                <span className="flex items-center gap-1 text-[10px] text-slate-500 font-mono shrink-0">
                  <Clock size={11} /> {bug.createdAt}
                </span>
              </div>

              {/* Row 2: Title */}
              <h3
                className={`text-sm sm:text-base font-semibold text-white mb-1.5 leading-snug break-words ${
                  bug.status === 'RESOLVED' ? 'line-through text-slate-400' : ''
                }`}
              >
                {bug.title}
              </h3>

              {/* Row 3: Description */}
              <p className="text-xs text-slate-400 mb-3 leading-relaxed break-words">
                {bug.description}
              </p>

              {/* Row 4: Stack Trace */}
              {bug.stackTrace && (
                <pre className="p-2.5 mb-3 bg-slate-950 border border-slate-800/80 rounded-lg font-mono text-[10px] text-rose-400/90 whitespace-pre-wrap break-all leading-normal">
                  {bug.stackTrace}
                </pre>
              )}

              {/* Row 5: Smart Suggested Solution */}
              <div className="p-2.5 mb-3 rounded-lg bg-sky-500/10 border border-sky-500/25 text-xs text-sky-200 flex items-start gap-2">
                <Sparkles size={14} className="text-sky-400 shrink-0 mt-0.5" />
                <div className="min-w-0 break-words">
                  <strong className="text-sky-300">Suggested Solution: </strong>
                  <span>{suggestion}</span>
                </div>
              </div>

              {/* Row 6: Metadata & Action Controls */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                  <span className="truncate max-w-[140px]">
                    By: <strong className="text-slate-300 font-medium">{bug.reportedBy}</strong>
                  </span>
                  <span className="truncate max-w-[140px]">
                    Assigned: <strong className="text-orange-400 font-medium">{bug.assignedTo}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <button
                    onClick={() => toggleStatus(bug.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      bug.status === 'OPEN'
                        ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {bug.status === 'OPEN' ? (
                      <>
                        <Check size={13} /> Mark Resolved
                      </>
                    ) : (
                      <>
                        <RotateCcw size={13} /> Reopen
                      </>
                    )}
                  </button>

                  {isProjectManager && (
                    <button
                      onClick={() => deleteBug(bug.id)}
                      title="Delete Issue (PM Only)"
                      className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 transition cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredBugs.length === 0 && (
          <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-xl text-slate-500 text-xs">
            No issues match the selected filters.
          </div>
        )}
      </div>

      {/* New Bug Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-white mb-4">Report an Issue</h2>
            <form onSubmit={handleCreateBug} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Login button not working"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Steps</label>
                <textarea
                  rows={3}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Provide context or steps to reproduce..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Error Trace / Stack Logs (Optional)</label>
                <input
                  type="text"
                  value={newStackTrace}
                  onChange={(e) => setNewStackTrace(e.target.value)}
                  placeholder="e.g. TypeError or 500 Internal Server Error..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs font-mono focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:border-rose-500 focus:outline-none"
                  >
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Assign Developer</label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:border-rose-500 focus:outline-none"
                  >
                    <option value="Shihab Shoron">Shihab Shoron (Dev)</option>
                    <option value="Soyeb Akram">Soyeb Akram (PM)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-rose-600/20 transition cursor-pointer"
                >
                  Submit Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}