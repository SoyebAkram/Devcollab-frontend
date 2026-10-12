import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Bug, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  User, 
  Filter,
  Check,
  RotateCcw,
  Trash2,
  Download,
  Search
} from 'lucide-react';

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
    };
    setBugs([createdBug, ...bugs]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewStackTrace('');
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Title', 'Priority', 'Status', 'Reported By', 'Assigned To', 'Date', 'Description'];
    const rows = bugs.map((b) => [
      b.id,
      `"${b.title.replace(/"/g, '""')}"`,
      b.priority,
      b.status,
      `"${b.reportedBy}"`,
      `"${b.assignedTo}"`,
      b.createdAt,
      `"${b.description.replace(/"/g, '""')}"`,
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
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Bug & Issue Tracker</h1>
          <p className="text-slate-400 text-sm mt-1">
            Log, assign, and track software defects with full context
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-rose-600/20 transition cursor-pointer"
          >
            <Plus size={16} /> Report Bug
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Total Reported</p>
            <p className="text-2xl font-bold text-white mt-1">{bugs.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
            <Bug size={20} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-rose-400 font-semibold uppercase">Open Issues</p>
            <p className="text-2xl font-bold text-rose-400 mt-1">{openCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertCircle size={20} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-400 font-semibold uppercase">Resolved Issues</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{resolvedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-xl mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mr-1">
            <Filter size={14} /> Filters:
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {['ALL', 'OPEN', 'RESOLVED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
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
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search bugs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-rose-500 w-48"
          />
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        {filteredBugs.map((bug) => (
          <div
            key={bug.id}
            className={`p-5 rounded-2xl border transition bg-slate-900/70 ${
              bug.status === 'RESOLVED'
                ? 'border-slate-800/80 opacity-75'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    bug.status === 'OPEN'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {bug.status}
                </span>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityStyle(
                    bug.priority
                  )}`}
                >
                  {bug.priority}
                </span>

                <h3 className={`text-base font-semibold text-white ${
                  bug.status === 'RESOLVED' ? 'line-through text-slate-400' : ''
                }`}>
                  {bug.title}
                </h3>
              </div>

              {/* Status Action & Delete Button Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStatus(bug.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    bug.status === 'OPEN'
                      ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  {bug.status === 'OPEN' ? (
                    <>
                      <Check size={14} /> Mark as Resolved
                    </>
                  ) : (
                    <>
                      <RotateCcw size={14} /> Reopen Issue
                    </>
                  )}
                </button>

                {isProjectManager && (
                  <button
                    onClick={() => deleteBug(bug.id)}
                    title="Delete this bug (Project Manager only)"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 transition cursor-pointer"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-400 mb-3 leading-relaxed">
              {bug.description}
            </p>

            {bug.stackTrace && (
              <pre className="p-2.5 mb-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-rose-400/90 overflow-x-auto">
                {bug.stackTrace}
              </pre>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-3 border-t border-slate-800">
              <span className="flex items-center gap-1.5">
                <User size={13} className="text-slate-500" />
                Reported by: <strong className="text-slate-300 font-medium">{bug.reportedBy}</strong>
              </span>

              <span className="flex items-center gap-1.5">
                <User size={13} className="text-orange-400" />
                Assigned to: <strong className="text-slate-300 font-medium">{bug.assignedTo}</strong>
              </span>

              <span className="flex items-center gap-1.5 text-slate-500 ml-auto">
                <Clock size={13} /> {bug.createdAt}
              </span>
            </div>
          </div>
        ))}

        {filteredBugs.length === 0 && (
          <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-500 text-sm">
            No issues match the selected filters.
          </div>
        )}
      </div>

      {/* New Bug Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full rounded-2xl p-6 shadow-2xl">
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