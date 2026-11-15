import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  Search,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  ExternalLink,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Projects() {
  const { user, isProjectManager } = useAuth();

  const [projects, setProjects] = useState([
    {
      id: 'PROJ-1',
      title: 'DevCollab Core Platform',
      description: 'Central developer collaboration workspace with sprint velocity tracking, audit logs, and Kanban task scheduling.',
      status: 'IN_PROGRESS',
      progress: 75,
      deadline: '2026-11-20',
      team: ['Soyeb Akram', 'Shihab Shoron'],
      lead: 'Soyeb Akram'
    },
    {
      id: 'PROJ-2',
      title: 'DevCollab Mobile UI Prototype',
      description: 'Responsive web UI prototype and mobile task tracking integration with touch-friendly Kanban controls.',
      status: 'PLANNING',
      progress: 25,
      deadline: '2026-12-05',
      team: ['Shihab Shoron'],
      lead: 'Shihab Shoron'
    },
    {
      id: 'PROJ-3',
      title: 'FastAPI Microservices Backend',
      description: 'RESTful API gateway with JWT authorization, PostgreSQL connection pooling, and Alembic database migrations.',
      status: 'IN_PROGRESS',
      progress: 50,
      deadline: '2026-11-28',
      team: ['Soyeb Akram', 'Shihab Shoron'],
      lead: 'Soyeb Akram'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newStatus, setNewStatus] = useState('PLANNING');

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProj = {
      id: `PROJ-${projects.length + 1}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'No description provided.',
      status: newStatus,
      progress: 0,
      deadline: newDeadline || '2026-12-31',
      team: [user?.name || 'Soyeb Akram'],
      lead: user?.name || 'Soyeb Akram'
    };

    setProjects([...projects, newProj]);
    setNewTitle('');
    setNewDesc('');
    setNewDeadline('');
    setShowModal(false);
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.lead.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'IN_PROGRESS':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'PLANNING':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden box-border space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 shrink-0" />
            <span className="truncate">Engineering Projects</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage semester milestones, microservices, and sprint deliverables
          </p>
        </div>

        {isProjectManager && (
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 transition shadow-sm self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        )}
      </div>

      {/* Search and Status Filters */}
      <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="PLANNING">Planning</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* Projects List Grid: 1 column on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 w-full">
        {filteredProjects.map(proj => (
          <div
            key={proj.id}
            className="w-full max-w-full bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm transition box-border overflow-hidden"
          >
            <div className="space-y-3 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(proj.status)}`}>
                  {proj.status.replace('_', ' ')}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {proj.id}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white break-words leading-snug">
                  {proj.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed break-words line-clamp-3">
                  {proj.description}
                </p>
              </div>

              <div className="pt-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">Completion</span>
                  <span className="text-white font-semibold">{proj.progress}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-orange-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${proj.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-slate-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Target Deadline:
                </span>
                <span className="text-slate-200 font-medium">{proj.deadline}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  Assigned Team ({proj.team.length}):
                </span>
                <div className="flex items-center gap-1 flex-wrap justify-end">
                  {proj.team.map((member, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-medium"
                    >
                      {member}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Create New Project</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Project Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI-Powered Code Reviewer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Goals, deliverables, and architecture..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="PLANNING">Planning</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Deadline</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 transition shadow-sm"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}