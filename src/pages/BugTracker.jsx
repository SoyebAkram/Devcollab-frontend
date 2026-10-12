import React, { useState } from 'react';
import {
  Bug,
  Plus,
  Search,
  Download,
  Check,
  RotateCcw,
  Trash2,
  Clock,
  AlertCircle,
  CheckCircle2,
  X,
  FileText,
  User,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BugTracker() {
  const { user, isProjectManager } = useAuth();

  const [bugs, setBugs] = useState([
    {
      id: 'BUG-101',
      title: 'Sign In button not working on mobile viewports',
      description: 'Tapping Sign In on screen widths below 400px does not trigger the submit handler.',
      severity: 'HIGH',
      status: 'OPEN',
      reportedBy: 'Shihab Shoron',
      assignedTo: 'Shihab Shoron',
      date: '2026-10-10',
      stackTrace: "TypeError: Cannot read properties of undefined (reading 'submit')\n    at HTMLButtonElement.handleTouchEnd (Login.jsx:42:19)\n    at dispatchEvent (react-dom.production.min.js:244)"
    },
    {
      id: 'BUG-102',
      title: 'FastAPI CORS header missing on /api/v1/tasks endpoint',
      description: 'OPTIONS request returns 403 Forbidden when accessed from local development frontend origin.',
      severity: 'HIGH',
      status: 'RESOLVED',
      reportedBy: 'Soyeb Akram',
      assignedTo: 'Shihab Shoron',
      date: '2026-10-09',
      stackTrace: "Access to fetch at 'http://localhost:8000/api/v1/tasks' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present."
    },
    {
      id: 'BUG-103',
      title: 'Kanban card drag overlay clips outside column bounds',
      description: 'Dragging a task card quickly across columns causes visual stutter and clips beyond the viewport boundary on low-DPI displays.',
      severity: 'MEDIUM',
      status: 'OPEN',
      reportedBy: 'Soyeb Akram',
      assignedTo: 'Soyeb Akram',
      date: '2026-10-11',
      stackTrace: null
    },
    {
      id: 'BUG-104',
      title: 'JWT token expiration toast alert does not display on session timeout',
      description: 'When the 60-minute token expires, the user is redirected to /login immediately without notifying them that their session timed out.',
      severity: 'LOW',
      status: 'RESOLVED',
      reportedBy: 'Dr. Umme Khatuna Jannat',
      assignedTo: 'Soyeb Akram',
      date: '2026-10-08',
      stackTrace: null
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);

  // New Bug Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSeverity, setNewSeverity] = useState('HIGH');
  const [newAssignee, setNewAssignee] = useState('Shihab Shoron');
  const [newStackTrace, setNewStackTrace] = useState('');

  // Helper to append actions to the Project Manager Audit Log
  const logAudit = (action, details) => {
    try {
      const existing = JSON.parse(localStorage.getItem('devcollab_audit_logs') || '[]');
      const newEntry = {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        user: user?.name || (isProjectManager ? 'Soyeb Akram (PM)' : 'Shihab Shoron (Dev)'),
        role: isProjectManager ? 'Project Manager' : 'Developer',
        action,
        details,
        status: 'SUCCESS'
      };
      localStorage.setItem('devcollab_audit_logs', JSON.stringify([newEntry, ...existing]));
    } catch (err) {
      console.error('Audit log write error', err);
    }
  };

  const toggleStatus = (id) => {
    setBugs(prev =>
      prev.map(bug => {
        if (bug.id === id) {
          const nextStatus = bug.status === 'RESOLVED' ? 'OPEN' : 'RESOLVED';
          logAudit(
            nextStatus === 'RESOLVED' ? 'RESOLVE_BUG' : 'REOPEN_BUG',
            `Changed status of ${bug.id} (${bug.title}) to ${nextStatus}`
          );
          return { ...bug, status: nextStatus };
        }
        return bug;
      })
    );
  };

  const deleteBug = (id) => {
    if (!isProjectManager) {
      alert('Only Project Managers have permission to delete bugs.');
      return;
    }
    const target = bugs.find(b => b.id === id);
    if (window.confirm(`Are you sure you want to permanently delete bug ${id}?`)) {
      setBugs(prev => prev.filter(b => b.id !== id));
      logAudit('DELETE_BUG', `Deleted issue ${id}: ${target?.title || ''}`);
    }
  };

  const handleCreateBug = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const newId = `BUG-${100 + bugs.length + 1}`;
    const newBug = {
      id: newId,
      title: newTitle.trim(),
      description: newDesc.trim(),
      severity: newSeverity,
      status: 'OPEN',
      reportedBy: user?.name || (isProjectManager ? 'Soyeb Akram' : 'Shihab Shoron'),
      assignedTo: newAssignee,
      date: new Date().toISOString().slice(0, 10),
      stackTrace: newStackTrace.trim() || null
    };

    setBugs([newBug, ...bugs]);
    logAudit('CREATE_BUG', `Logged new bug ${newId}: ${newBug.title} [${newSeverity}]`);

    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setNewSeverity('HIGH');
    setNewAssignee('Shihab Shoron');
    setNewStackTrace('');
    setShowModal(false);
  };

  const exportCSV = () => {
    const headers = ['ID', 'Title', 'Severity', 'Status', 'Reported By', 'Assigned To', 'Date', 'Description'];
    const rows = filteredBugs.map(b => [
      b.id,
      `"${b.title.replace(/"/g, '""')}"`,
      b.severity,
      b.status,
      `"${b.reportedBy}"`,
      `"${b.assignedTo}"`,
      b.date,
      `"${b.description.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DevCollab_Bugs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logAudit('EXPORT_BUGS', `Exported ${filteredBugs.length} bug records to CSV`);
  };

  const filteredBugs = bugs.filter(bug => {
    const matchesSearch =
      bug.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bug.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bug.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bug.reportedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bug.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || bug.status === statusFilter;
    const matchesSeverity = severityFilter === 'ALL' || bug.severity === severityFilter;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const totalBugs = bugs.length;
  const openBugs = bugs.filter(b => b.status === 'OPEN').length;
  const resolvedBugs = bugs.filter(b => b.status === 'RESOLVED').length;
  const highBugs = bugs.filter(b => b.severity === 'HIGH' || b.severity === 'CRITICAL').length;

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'HIGH':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'LOW':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div
      className="w-full max-w-full overflow-x-hidden box-border space-y-4"
      style={{ maxWidth: '100%', overflowX: 'hidden' }}
    >
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bug className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 shrink-0" />
            <span className="truncate">Bug & Issue Tracker</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Track runtime exceptions, regressions, and QA reports
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition cursor-pointer"
            title="Download bug reports as CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Report Bug</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full">
        <div className="bg-slate-900/80 border border-slate-800 p-2.5 sm:p-3.5 rounded-xl">
          <div className="text-[11px] sm:text-xs text-slate-400 font-medium">Total Bugs</div>
          <div className="text-lg sm:text-2xl font-bold text-white mt-0.5">{totalBugs}</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-2.5 sm:p-3.5 rounded-xl">
          <div className="text-[11px] sm:text-xs text-amber-400 font-medium">Open Issues</div>
          <div className="text-lg sm:text-2xl font-bold text-amber-300 mt-0.5">{openBugs}</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-2.5 sm:p-3.5 rounded-xl">
          <div className="text-[11px] sm:text-xs text-emerald-400 font-medium">Resolved</div>
          <div className="text-lg sm:text-2xl font-bold text-emerald-300 mt-0.5">{resolvedBugs}</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-2.5 sm:p-3.5 rounded-xl">
          <div className="text-[11px] sm:text-xs text-rose-400 font-medium">Critical / High</div>
          <div className="text-lg sm:text-2xl font-bold text-rose-300 mt-0.5">{highBugs}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search bugs by title, reporter, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 sm:flex-initial bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="OPEN">Open Only</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="flex-1 sm:flex-initial bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Bug Cards List (Zero Squeeze & Full-Width Title) */}
      <div className="space-y-3 w-full max-w-full">
        {filteredBugs.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-sm">
            <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            No bugs match your current filters.
          </div>
        ) : (
          filteredBugs.map(bug => (
            <div
              key={bug.id}
              className="w-full max-w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 sm:p-4 shadow-sm overflow-hidden box-border transition-all hover:border-slate-700/80"
            >
              {/* Row 1: Badges, ID and Date */}
              <div className="flex items-center justify-between gap-2 mb-2 w-full">
                <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                  <span className="text-[11px] font-mono text-slate-500 font-semibold shrink-0">
                    {bug.id}
                  </span>
                  {bug.status === 'RESOLVED' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                      RESOLVED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
                      <AlertCircle className="w-3 h-3" />
                      OPEN
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border shrink-0 ${getSeverityBadge(bug.severity)}`}>
                    {bug.severity}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{bug.date}</span>
                </div>
              </div>

              {/* Row 2: Bug Title (Dedicated Row, 100% width, never squished) */}
              <h3
                className={`text-sm sm:text-base font-semibold text-white break-words mb-1.5 leading-snug w-full ${
                  bug.status === 'RESOLVED' ? 'line-through text-slate-400' : ''
                }`}
              >
                {bug.title}
              </h3>

              {/* Row 3: Description */}
              <p className="text-xs sm:text-sm text-slate-300 break-words mb-3 leading-relaxed w-full">
                {bug.description}
              </p>

              {/* Row 4: Stack Trace / Error Logs (Wrapped cleanly, NO horizontal scroll) */}
              {bug.stackTrace && (
                <div className="mb-3 w-full max-w-full rounded bg-slate-950/90 border border-slate-800/80 p-2.5 overflow-hidden box-border">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-1">
                    Stack Trace / Error Log
                  </div>
                  <pre className="text-[11px] sm:text-xs font-mono text-rose-400 whitespace-pre-wrap break-all leading-normal max-w-full overflow-hidden p-0 m-0 select-all">
                    {bug.stackTrace}
                  </pre>
                </div>
              )}

              {/* Row 5: Footer with Reporter, Assignee & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2.5 border-t border-slate-800/70 mt-1 w-full">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 min-w-0">
                  <div className="truncate">
                    <span className="text-slate-500">Reported:</span>{' '}
                    <span className="text-slate-300 font-medium">{bug.reportedBy}</span>
                  </div>
                  <div className="truncate">
                    <span className="text-slate-500">Assigned:</span>{' '}
                    <span className="text-slate-300 font-medium">{bug.assignedTo}</span>
                  </div>
                </div>

                {/* Actions: Reopen / Mark as Resolved & Delete */}
                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 pt-1 sm:pt-0">
                  <button
                    onClick={() => toggleStatus(bug.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                      bug.status === 'RESOLVED'
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                        : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
                    }`}
                  >
                    {bug.status === 'RESOLVED' ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reopen Issue</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark as Resolved</span>
                      </>
                    )}
                  </button>

                  {isProjectManager && (
                    <button
                      onClick={() => deleteBug(bug.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition cursor-pointer"
                      title="Delete Bug (Project Manager Only)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Bug Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-5 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Report New Issue / Bug
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBug} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Issue Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sign In button not responding on touch"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Severity Level
                  </label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="CRITICAL">Critical (Blocks Release)</option>
                    <option value="HIGH">High (Major Feature Broken)</option>
                    <option value="MEDIUM">Medium (Normal Bug)</option>
                    <option value="LOW">Low (UI / Minor Glitch)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Assignee
                  </label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Shihab Shoron">Shihab Abdullah Shoron</option>
                    <option value="Soyeb Akram">Soyeb Akram</option>
                    <option value="Dr. Umme Khatuna Jannat">Dr. Umme Khatuna Jannat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Detailed Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe what happened, expected vs actual behavior, and steps to reproduce..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Stack Trace or Error Output (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Paste browser console error or backend traceback here..."
                  value={newStackTrace}
                  onChange={(e) => setNewStackTrace(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs sm:text-sm font-mono text-rose-300 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 transition shadow-sm"
                >
                  Submit Bug Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}