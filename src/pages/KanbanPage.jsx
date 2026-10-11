import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  Filter
} from 'lucide-react';

const COLUMNS = [
  { id: 'TODO', title: 'TO DO', color: 'border-slate-600 bg-slate-800/40 text-slate-300' },
  { id: 'IN_PROGRESS', title: 'IN PROGRESS', color: 'border-blue-500/50 bg-blue-500/10 text-blue-400' },
  { id: 'REVIEW', title: 'REVIEW', color: 'border-purple-500/50 bg-purple-500/10 text-purple-400' },
  { id: 'DONE', title: 'DONE', color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' },
];

const INITIAL_TASKS = [
  {
    id: 1,
    title: 'Setup JWT Authentication API',
    description: 'Implement token generation and role verification in FastAPI.',
    priority: 'HIGH',
    status: 'DONE',
    assignedTo: 'Shihab Shoron',
    assignedEmail: 'dev@devcollab.local',
    dueDate: '2026-10-15',
  },
  {
    id: 2,
    title: 'Design PostgreSQL Schema with Alembic',
    description: 'Create tables for users, projects, tasks, and bugs with migration scripts.',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assignedTo: 'Shihab Shoron',
    assignedEmail: 'dev@devcollab.local',
    dueDate: '2026-10-18',
  },
  {
    id: 3,
    title: 'Build Kanban Drag & Drop View',
    description: 'Responsive cards with stage transitions and priority badges.',
    priority: 'MEDIUM',
    status: 'TODO',
    assignedTo: 'Soyeb Akram',
    assignedEmail: 'pm@devcollab.local',
    dueDate: '2026-10-20',
  },
  {
    id: 4,
    title: 'Bug Report Modal & API Integration',
    description: 'Allow developers to submit bugs with priority and reproducibility steps.',
    priority: 'LOW',
    status: 'REVIEW',
    assignedTo: 'Shihab Shoron',
    assignedEmail: 'dev@devcollab.local',
    dueDate: '2026-10-22',
  },
];

export default function KanbanPage() {
  const { user, isProjectManager } = useAuth();
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [showMyTasksOnly, setShowMyTasksOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Task Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('MEDIUM');
  const [newAssignee, setNewAssignee] = useState('Shihab Shoron');
  const [newDueDate, setNewDueDate] = useState('');

  // Move task to next or previous stage (PM Only)
  const moveTask = (taskId, direction) => {
    if (!isProjectManager) return; // Prevent unauthorized moves

    const order = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const currentIndex = order.indexOf(task.status);
          const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
          if (nextIndex >= 0 && nextIndex < order.length) {
            return { ...task, status: order[nextIndex] };
          }
        }
        return task;
      })
    );
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    const createdTask = {
      id: Date.now(),
      title: newTitle,
      description: newDesc,
      priority: newPriority,
      status: 'TODO',
      assignedTo: newAssignee,
      assignedEmail: newAssignee === 'Soyeb Akram' ? 'pm@devcollab.local' : 'dev@devcollab.local',
      dueDate: newDueDate || 'No deadline',
    };
    setTasks([createdTask, ...tasks]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  const filteredTasks = showMyTasksOnly
    ? tasks.filter((t) => t.assignedEmail === user?.email)
    : tasks;

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div>
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Project Kanban Board</h1>
          <p className="text-slate-400 text-sm mt-1">
            Visual workflow stages: To Do → In Progress → Review → Done
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMyTasksOnly(!showMyTasksOnly)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition cursor-pointer ${
              showMyTasksOnly
                ? 'bg-orange-500/20 border-orange-500/40 text-orange-400'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Filter size={14} />
            {showMyTasksOnly ? 'Showing My Tasks' : 'Filter: All Tasks'}
          </button>

          {isProjectManager && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-orange-600/20 transition cursor-pointer"
            >
              <Plus size={16} /> New Task
            </button>
          )}
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${col.color}`}>
                  {col.title}
                </span>
                <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-slate-800/90 border border-slate-700/70 hover:border-slate-600 rounded-xl p-4 shadow-sm transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityBadge(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Calendar size={12} /> {task.dueDate}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-white mb-1.5">{task.title}</h3>
                    <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                      {task.description}
                    </p>

                    <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-orange-400">
                          {task.assignedTo[0]}
                        </div>
                        <span className="text-[11px] truncate max-w-[90px]">{task.assignedTo}</span>
                      </div>

                      {/* Direction Shift Controls (PM Only) */}
                      {isProjectManager && (
                        <div className="flex items-center gap-1">
                          {col.id !== 'TODO' && (
                            <button
                              onClick={() => moveTask(task.id, 'prev')}
                              title="Move back"
                              className="p-1 rounded bg-slate-700/60 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                            >
                              <ChevronLeft size={14} />
                            </button>
                          )}
                          {col.id !== 'DONE' && (
                            <button
                              onClick={() => moveTask(task.id, 'next')}
                              title="Move forward"
                              className="p-1 rounded bg-slate-700/60 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                            >
                              <ChevronRight size={14} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="h-32 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-500">
                    No tasks here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Manager New Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full rounded-2xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Implement Bug Reporting API"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe scope, requirements, or acceptance criteria..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:border-orange-500 focus:outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Assignee</label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:border-orange-500 focus:outline-none"
                  >
                    <option value="Shihab Shoron">Shihab Shoron (Dev)</option>
                    <option value="Soyeb Akram">Soyeb Akram (PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:border-orange-500 focus:outline-none"
                />
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
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-orange-600/20 transition cursor-pointer"
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