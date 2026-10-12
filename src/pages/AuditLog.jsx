import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  User, 
  Clock 
} from 'lucide-react';

const INITIAL_AUDIT_LOGS = [
  {
    id: 'AUD-001',
    actor: 'Soyeb Akram',
    actorRole: 'PROJECT_MANAGER',
    category: 'TASK_MOVE',
    summary: 'Moved task to stage DONE',
    details: 'Task "Setup JWT Authentication API" transitioned from REVIEW to DONE by PM.',
    timestamp: '2026-10-12 04:15:20',
    timeAgo: '2 hours ago',
    ipAddress: '192.168.1.42 (Chrome 128 / Win64)',
  },
  {
    id: 'AUD-002',
    actor: 'Shihab Shoron',
    actorRole: 'DEVELOPER',
    category: 'BUG_REPORT',
    summary: 'Reported high-priority bug',
    details: 'Logged Bug #101 "Login button not working on mobile viewports" with priority HIGH.',
    timestamp: '2026-10-12 02:40:11',
    timeAgo: '4 hours ago',
    ipAddress: '192.168.1.18 (Firefox 130 / Win64)',
  },
  {
    id: 'AUD-003',
    actor: 'Soyeb Akram',
    actorRole: 'PROJECT_MANAGER',
    category: 'PROJECT_CREATE',
    summary: 'Created new project',
    details: 'Initialized project "DevCollab System Core" with deadline 2026-11-15.',
    timestamp: '2026-10-11 18:22:05',
    timeAgo: 'Yesterday',
    ipAddress: '192.168.1.42 (Chrome 128 / Win64)',
  },
  {
    id: 'AUD-004',
    actor: 'Shihab Shoron',
    actorRole: 'DEVELOPER',
    category: 'BUG_STATUS',
    summary: 'Resolved software defect',
    details: 'Toggled Bug #102 "FastAPI CORS header missing" status to RESOLVED.',
    timestamp: '2026-10-11 14:10:45',
    timeAgo: 'Yesterday',
    ipAddress: '192.168.1.18 (Firefox 130 / Win64)',
  },
  {
    id: 'AUD-005',
    actor: 'Soyeb Akram',
    actorRole: 'PROJECT_MANAGER',
    category: 'BUG_DELETE',
    summary: 'Permanently deleted bug record',
    details: 'Exercised PM administrative privilege: deleted obsolete Bug #104 from database.',
    timestamp: '2026-10-10 11:05:30',
    timeAgo: '2 days ago',
    ipAddress: '192.168.1.42 (Chrome 128 / Win64)',
  },
  {
    id: 'AUD-006',
    actor: 'Soyeb Akram',
    actorRole: 'PROJECT_MANAGER',
    category: 'MEMBER_ASSIGN',
    summary: 'Assigned developer to project',
    details: 'Added developer "Shihab Shoron" to project "FastAPI Backend & DB Migrations".',
    timestamp: '2026-10-09 09:30:00',
    timeAgo: '3 days ago',
    ipAddress: '192.168.1.42 (Chrome 128 / Win64)',
  },
];

export default function AuditLog() {
  const { user, isProjectManager } = useAuth();
  const [logs, setLogs] = useState(INITIAL_AUDIT_LOGS);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const exportAuditCSV = () => {
    const headers = ['Audit ID', 'Timestamp', 'Actor', 'Role', 'Category', 'Summary', 'Details', 'Client Info'];
    const rows = logs.map((l) => [
      l.id,
      l.timestamp,
      `"${l.actor}"`,
      l.actorRole,
      l.category,
      `"${l.summary.replace(/"/g, '""')}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.ipAddress}"`,
    ]);
    const csvString = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `devcollab-audit-log-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearLogs = () => {
    if (!isProjectManager) return;
    if (window.confirm('Are you sure you want to clear the audit history log? (PM Only)')) {
      setLogs([]);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesCategory = categoryFilter === 'ALL' || log.category.startsWith(categoryFilter);
    const matchesSearch = searchQuery
      ? log.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.id.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'TASK_MOVE':
        return { label: 'Task Move', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
      case 'BUG_REPORT':
        return { label: 'Bug Report', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
      case 'BUG_STATUS':
        return { label: 'Bug Status', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'BUG_DELETE':
        return { label: 'Bug Delete', color: 'bg-red-500/20 text-red-300 border-red-500/40' };
      case 'PROJECT_CREATE':
        return { label: 'Project Admin', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' };
      default:
        return { label: 'Team Roster', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-orange-600/10 border border-orange-500/20 text-orange-400">
              <History size={16} />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Audit History Log</h1>
          </div>
          <p className="text-slate-400 text-sm">
            Immutable chronological audit trail of all project state changes, task transitions, and defect records
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportAuditCSV}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            <Download size={14} /> Export CSV
          </button>

          {isProjectManager && logs.length > 0 && (
            <button
              onClick={handleClearLogs}
              className="flex items-center gap-2 px-3.5 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <Trash2 size={14} /> Clear Log
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Recorded</span>
          <span className="text-2xl font-extrabold text-white mt-1 block">{logs.length}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">Task Events</span>
          <span className="text-2xl font-extrabold text-blue-400 mt-1 block">
            {logs.filter((l) => l.category.startsWith('TASK')).length}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">Defect Events</span>
          <span className="text-2xl font-extrabold text-rose-400 mt-1 block">
            {logs.filter((l) => l.category.startsWith('BUG')).length}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider block">Admin Events</span>
          <span className="text-2xl font-extrabold text-orange-400 mt-1 block">
            {logs.filter((l) => l.category.startsWith('PROJECT') || l.category.startsWith('MEMBER')).length}
          </span>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-xl mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mr-1">
            <Filter size={14} /> Category:
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'TASK', label: 'Tasks' },
              { id: 'BUG', label: 'Bugs' },
              { id: 'PROJECT', label: 'Projects' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-orange-500 w-52"
          />
        </div>
      </div>

      {/* Audit Log Table / Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="divide-y divide-slate-800/80">
          {filteredLogs.map((log) => {
            const badge = getCategoryBadge(log.category);
            return (
              <div key={log.id} className="p-4 hover:bg-slate-800/40 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      {log.id}
                    </span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <h3 className="text-sm font-semibold text-white">{log.summary}</h3>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={12} className="text-slate-500" />
                    <span>{log.timeAgo}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[11px] text-slate-500 font-mono">{log.timestamp}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mb-2.5 leading-relaxed pl-1">
                  {log.details}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <User size={12} className="text-slate-500" />
                      Actor: <strong className="text-slate-200">{log.actor}</strong>
                    </span>
                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      log.actorRole === 'PROJECT_MANAGER'
                        ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {log.actorRole === 'PROJECT_MANAGER' ? 'PM' : 'Dev'}
                    </span>
                  </div>

                  <span className="font-mono text-slate-500 text-[10px]">
                    {log.ipAddress}
                  </span>
                </div>
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <div className="p-12 text-center text-slate-500 text-xs">
              No audit log records match your filter criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}