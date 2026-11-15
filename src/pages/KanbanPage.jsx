import React, { useState } from 'react';
import {
  Kanban as KanbanIcon,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Trash2,
  User,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function KanbanPage() {
  const { user, isProjectManager } = useAuth();

  const [tasks, setTasks] = useState([
    {
      id: 'TASK-1',
      title: 'Build Kanban Drag & Drop View',
      description: 'Implement responsive columns, task state mutations, and touch controls for mobile viewports.',
      stage: 'TODO',
      priority: 'MEDIUM',
      assignee: 'Soyeb Akram',
      reporter: 'Soyeb Akram',
      deadline: '2026-11-15'
    },
    {
      id: 'TASK-2',
      title: 'Design PostgreSQL Schema with Alembic',
      description: 'Configure migration scripts for audit trail, role permissions, and sprint task relationships.',
      stage: 'IN_PROGRESS',
      priority: 'HIGH',
      assignee: 'Shihab Shoron',
      reporter: 'Shihab Shoron',
      deadline: '2026-11-12'
    },
    {
      id: 'TASK-3',
      title: 'Bug Report Modal & API Integration',
      description: 'Connect form submission handlers, error logging, and export to CSV endpoints.',
      stage: 'REVIEW',
      priority: 'LOW',
      assignee: 'Shihab Shoron',
      reporter: 'Soyeb Akram',
      deadline: '2026-11-10'
    },
    {
      id: 'TASK-4',
      title: 'Setup JWT Auth API',
      description: 'Implement token issuance, role-based claims (PM vs Developer), and token refresh middleware.',
      stage: 'DONE',
      priority: 'HIGH',
      assignee: 'Soyeb Akram',
      reporter: 'Dr. Umme Khatuna Jannat',
      deadline: '2026-11-05'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [mobileActiveStage, setMobileActiveStage] = useState('ALL');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('MEDIUM');
  const [newStage, setNewStage] = useState('TODO');
  const [newAssignee, setNewAssignee] = useState('Soyeb Akram');

  // Ultra-Transparent Frosted Glass Columns (20%-30% opacity)
  const columns = [
    { id: 'TODO', label: 'TO DO', color: 'border-slate-500/20 bg-[#060E1A]/25', badgeColor: 'bg-slate-800/80 text-slate-300' },
    { id: 'IN_PROGRESS', label: 'IN PROGRESS', color: 'border-sky-500/30 bg-[#060E1A]/35', badgeColor: 'bg-sky-500/20 text-sky-300 border border-sky-500/30' },
    { id: 'REVIEW', label: 'REVIEW', color: 'border-purple-500/30 bg-[#060E1A]/35', badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30' },
    { id: 'DONE', label: 'DONE', color: 'border-emerald-500/30 bg-[#060E1A]/35', badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' }
  ];

  const stageOrder = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];

  const moveTask = (taskId, direction) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const currentIndex = stageOrder.indexOf(task.stage);
          const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
          if (nextIndex >= 0 && nextIndex < stageOrder.length) {
            const nextStage = stageOrder[nextIndex];
            logAudit('MOVE_TASK', `Moved ${task.id} (${task.title}) to ${nextStage}`);
            return { ...task, stage: nextStage };
          }
        }
        return task;
      })
    );
  };

  const deleteTask = (taskId) => {
    if (!isProjectManager) {
      alert('Only Project Managers have permission to delete tasks.');
      return;
    }
    const target = tasks.find(t => t.id === taskId);
    if (window.confirm(`Delete ${taskId}?`)) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
      logAudit('DELETE_TASK', `Deleted task ${taskId}: ${target?.title || ''}`);
    }
  };

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
      console.error(err);
    }
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newId = `TASK-${tasks.length + 1}`;
    const newTask = {
      id: newId,
      title: newTitle.trim(),
      description: newDesc.trim() || 'No description provided.',
      stage: newStage,
      priority: newPriority,
      assignee: newAssignee,
      reporter: user?.name || 'Soyeb Akram',
      deadline: '2026-11-30'
    };

    setTasks([...tasks, newTask]);
    logAudit('CREATE_TASK', `Created task ${newId}: ${newTask.title} in ${newStage}`);

    setNewTitle('');
    setNewDesc('');
    setShowNewTaskModal(false);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'HIGH':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'LOW':
        return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
      default:
        return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
    }
  };

  const displayedColumns = mobileActiveStage === 'ALL'
    ? columns
    : columns.filter(c => c.id === mobileActiveStage);

  return (
    <div className="w-full max-w-full overflow-x-hidden box-border space-y-4">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <KanbanIcon className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400 shrink-0" />
            <span className="truncate">Project Kanban Board</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Visual workflow stages: To Do → In Progress → Review → Done
          </p>
        </div>

        <button
          onClick={() => setShowNewTaskModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 transition shadow-md shadow-sky-500/25 border border-sky-400/30 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Transparent Search & Filter Bar */}
      <div className="bg-[#060E1A]/35 backdrop-blur-xl border border-sky-500/20 p-3 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full shadow-sm">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#060E1A]/40 border border-sky-500/25 rounded-lg pl-9 pr-3 py-1.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#060E1A]/40 border border-sky-500/25 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-400 cursor-pointer w-full sm:w-auto"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Mobile Column Switcher Tabs */}
      <div className="flex sm:hidden items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full">
        <button
          onClick={() => setMobileActiveStage('ALL')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition ${
            mobileActiveStage === 'ALL'
              ? 'bg-sky-600 text-white shadow-sm shadow-sky-500/20'
              : 'bg-[#060E1A]/40 text-slate-400 border border-sky-500/20'
          }`}
        >
          All Stages ({filteredTasks.length})
        </button>
        {columns.map(c => {
          const count = filteredTasks.filter(t => t.stage === c.id).length;
          return (
            <button
              key={c.id}
              onClick={() => setMobileActiveStage(c.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition ${
                mobileActiveStage === c.id
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-500/20'
                  : 'bg-[#060E1A]/40 text-slate-400 border border-sky-500/20'
              }`}
            >
              {c.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Transparent Kanban Columns (Revealing 3D Background) */}
      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible pb-4 pt-1 snap-x snap-mandatory box-border w-full">
        {displayedColumns.map(col => {
          const columnTasks = filteredTasks.filter(t => t.stage === col.id);
          const colIndex = stageOrder.indexOf(col.id);

          return (
            <div
              key={col.id}
              className={`w-[82vw] max-w-[320px] sm:w-auto sm:max-w-none shrink-0 snap-center rounded-2xl border ${col.color} p-3 sm:p-3.5 flex flex-col min-h-[460px] backdrop-blur-xl shadow-lg transition-all hover:border-sky-500/40`}
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-sky-500/15">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm text-white tracking-wide">
                    {col.label}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${col.badgeColor}`}>
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {columnTasks.length === 0 ? (
                  <div className="h-32 border-2 border-dashed border-sky-500/20 rounded-xl flex items-center justify-center text-xs text-slate-500 font-medium">
                    No tasks in {col.label}
                  </div>
                ) : (
                  columnTasks.map(task => (
                    <div
                      key={task.id}
                      className="bg-[#0B1526]/35 hover:bg-[#0B1526]/55 backdrop-blur-md border border-sky-500/20 hover:border-sky-500/50 rounded-xl p-3.5 shadow-md transition space-y-2.5 box-border w-full"
                    >
                      <div className="flex items-center justify-between gap-1 w-full">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPriorityBadge(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {task.id}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-semibold text-white leading-snug break-words">
                        {task.title}
                      </h4>

                      <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed line-clamp-2 break-words">
                        {task.description}
                      </p>

                      <div className="pt-2 border-t border-sky-500/15 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="w-5 h-5 rounded-full bg-sky-500/20 border border-sky-500/30 text-sky-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {task.assignee[0]}
                          </div>
                          <span className="text-[11px] text-slate-300 truncate font-medium">
                            {task.assignee}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {colIndex > 0 && (
                            <button
                              onClick={() => moveTask(task.id, 'prev')}
                              className="p-1 rounded bg-[#060E1A]/60 hover:bg-sky-500/20 text-slate-400 hover:text-white transition cursor-pointer border border-sky-500/20"
                              title={`Move to ${stageOrder[colIndex - 1]}`}
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {colIndex < stageOrder.length - 1 && (
                            <button
                              onClick={() => moveTask(task.id, 'next')}
                              className="p-1 rounded bg-[#060E1A]/60 hover:bg-sky-500/20 text-slate-400 hover:text-white transition cursor-pointer border border-sky-500/20"
                              title={`Move to ${stageOrder[colIndex + 1]}`}
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {isProjectManager && (
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer border border-rose-500/30"
                              title="Delete Task (PM Only)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#0B1526]/90 backdrop-blur-xl border border-sky-500/30 rounded-2xl w-full max-w-md p-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-sky-500/20">
              <h3 className="font-bold text-white text-base">Create New Kanban Task</h3>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Task Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement OAuth login"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#060E1A]/80 border border-sky-500/20 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full bg-[#060E1A]/80 border border-sky-500/20 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-400"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Stage</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value)}
                    className="w-full bg-[#060E1A]/80 border border-sky-500/20 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-400"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="REVIEW">Review</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Assignee</label>
                <select
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="w-full bg-[#060E1A]/80 border border-sky-500/20 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-400"
                >
                  <option value="Soyeb Akram">Soyeb Akram (Team Lead)</option>
                  <option value="Shihab Shoron">Shihab Abdullah Shoron</option>
                  <option value="Dr. Umme Khatuna Jannat">Dr. Umme Khatuna Jannat</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Task details and deliverables..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#060E1A]/80 border border-sky-500/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-sky-500/20">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 transition shadow-md shadow-sky-500/20"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}