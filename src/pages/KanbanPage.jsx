import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  Filter,
  Search,
  MessageSquare,
  GitBranch,
  CheckSquare,
  Square,
  Code,
  X,
  Send
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
    gitBranch: 'feat/auth-jwt',
    codeSnippet: 'from fastapi import Depends, HTTPException\nfrom jose import jwt\n\ndef verify_token(token: str): ...',
    checklist: [
      { id: 101, text: 'Define User SQLAlchemy Model', done: true },
      { id: 102, text: 'Configure bcrypt password hashing', done: true },
      { id: 103, text: 'Test token expiry handling in Axios', done: true }
    ],
    comments: [
      { id: 201, author: 'Soyeb Akram', text: 'Ensure access tokens expire in 60 minutes.', time: 'Oct 10, 10:30 AM' },
      { id: 202, author: 'Shihab Shoron', text: 'Configured. Refresh token rotation added.', time: 'Oct 11, 2:15 PM' }
    ]
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
    gitBranch: 'feat/postgres-schema',
    codeSnippet: 'class Task(Base):\n    __tablename__ = "tasks"\n    id = Column(Integer, primary_key=True)\n    status = Column(Enum(TaskStatus))',
    checklist: [
      { id: 104, text: 'Draft foreign keys for Project memberships', done: true },
      { id: 105, text: 'Generate initial Alembic migration file', done: false }
    ],
    comments: [
      { id: 203, author: 'Shihab Shoron', text: 'Working on Alembic revision autogen.', time: 'Yesterday' }
    ]
  },
  {
    id: 3,
    title: 'Build Kanban Drag & Drop View',
    description: 'Responsive cards with stage transitions, checklists, and priority badges.',
    priority: 'MEDIUM',
    status: 'TODO',
    assignedTo: 'Soyeb Akram',
    assignedEmail: 'pm@devcollab.local',
    dueDate: '2026-10-20',
    gitBranch: 'feat/kanban-board',
    codeSnippet: '',
    checklist: [
      { id: 106, text: 'Support card modal details view', done: true },
      { id: 107, text: 'Integrate discussion comment thread', done: true },
      { id: 108, text: 'Connect drag-and-drop listener', done: false }
    ],
    comments: []
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
    gitBranch: 'feat/bug-tracker',
    codeSnippet: '',
    checklist: [
      { id: 109, text: 'Create BugTracker page layout', done: true },
      { id: 110, text: 'Add PM delete capability', done: true }
    ],
    comments: [
      { id: 204, author: 'Soyeb Akram', text: 'Checked PM delete function on mobile. Works cleanly.', time: 'Today' }
    ]
  },
];

export default function KanbanPage() {
  const { user, isProjectManager } = useAuth();
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [showMyTasksOnly, setShowMyTasksOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');

  // New Task Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('MEDIUM');
  const [newAssignee, setNewAssignee] = useState('Shihab Shoron');
  const [newDueDate, setNewDueDate] = useState('');
  const [newGitBranch, setNewGitBranch] = useState('feat/new-task');

  const moveTask = (taskId, direction) => {
    if (!isProjectManager) return;
    const order = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const currentIndex = order.indexOf(task.status);
          const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
          if (nextIndex >= 0 && nextIndex < order.length) {
            const updated = { ...task, status: order[nextIndex] };
            if (selectedTask?.id === taskId) setSelectedTask(updated);
            return updated;
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
      dueDate: newDueDate || '2026-10-31',
      gitBranch: newGitBranch || 'feat/task',
      checklist: [{ id: Date.now() + 1, text: 'Initial implementation', done: false }],
      comments: [],
      codeSnippet: '',
    };
    setTasks([createdTask, ...tasks]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  const toggleChecklistItem = (taskId, itemId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedChecklist = t.checklist.map((item) =>
            item.id === itemId ? { ...item, done: !item.done } : item
          );
          const updatedTask = { ...t, checklist: updatedChecklist };
          if (selectedTask?.id === taskId) setSelectedTask(updatedTask);
          return updatedTask;
        }
        return t;
      })
    );
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedTask) return;

    const newComment = {
      id: Date.now(),
      author: user?.name || 'Team Member',
      text: newCommentText.trim(),
      time: 'Just now',
    };

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === selectedTask.id) {
          const updatedTask = { ...t, comments: [...t.comments, newComment] };
          setSelectedTask(updatedTask);
          return updatedTask;
        }
        return t;
      })
    );
    setNewCommentText('');
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesUser = showMyTasksOnly ? t.assignedEmail === user?.email : true;
    const matchesSearch = searchQuery
      ? t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesUser && matchesSearch;
  });

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Project Kanban Board</h1>
          <p className="text-slate-400 text-sm mt-1">
            Visual workflow stages: To Do → In Progress → Review → Done
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-orange-500 w-44"
            />
          </div>

          <button
            onClick={() => setShowMyTasksOnly(!showMyTasksOnly)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
              showMyTasksOnly
                ? 'bg-orange-500/20 border-orange-500/40 text-orange-400'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Filter size={13} />
            {showMyTasksOnly ? 'My Tasks' : 'All Tasks'}
          </button>

          {isProjectManager && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-orange-600/20 transition cursor-pointer"
            >
              <Plus size={15} /> New Task
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
              className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col min-h-[520px]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${col.color}`}>
                  {col.title}
                </span>
                <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {colTasks.map((task) => {
                  const completedChecklist = task.checklist?.filter((c) => c.done).length || 0;
                  const totalChecklist = task.checklist?.length || 0;

                  return (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="bg-slate-800/90 border border-slate-700/70 hover:border-orange-500/50 rounded-xl p-4 shadow-sm transition cursor-pointer group"
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

                      <h3 className="text-sm font-semibold text-white group-hover:text-orange-400 transition mb-1.5">
                        {task.title}
                      </h3>
                      <p className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>

                      {/* Mini Metadata Indicators */}
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-3">
                        {task.gitBranch && (
                          <span className="flex items-center gap-1 font-mono text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded">
                            <GitBranch size={11} className="text-orange-400" />
                            {task.gitBranch}
                          </span>
                        )}
                        {totalChecklist > 0 && (
                          <span className="flex items-center gap-1">
                            <CheckSquare size={11} className="text-emerald-400" />
                            {completedChecklist}/{totalChecklist}
                          </span>
                        )}
                        {task.comments?.length > 0 && (
                          <span className="flex items-center gap-1">
                            <MessageSquare size={11} className="text-blue-400" />
                            {task.comments.length}
                          </span>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                          <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-orange-400">
                            {task.assignedTo[0]}
                          </div>
                          <span className="text-[11px] truncate max-w-[90px]">{task.assignedTo}</span>
                        </div>

                        {/* Direction Shift Controls (PM Only) */}
                        {isProjectManager && (
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
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
                  );
                })}

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

      {/* Task Details & Comments Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 max-w-2xl w-full rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityBadge(selectedTask.priority)}`}>
                    {selectedTask.priority}
                  </span>
                  <span className="text-xs font-semibold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                    Stage: {selectedTask.status.replace('_', ' ')}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">{selectedTask.title}</h2>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Description</h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                {selectedTask.description}
              </p>
            </div>

            {/* Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block">Assigned Developer</span>
                <strong className="text-slate-200">{selectedTask.assignedTo}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Target Due Date</span>
                <strong className="text-slate-200">{selectedTask.dueDate}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Git Branch</span>
                <span className="font-mono text-orange-400">{selectedTask.gitBranch}</span>
              </div>
            </div>

            {/* Code Snippet Box (If present) */}
            {selectedTask.codeSnippet && (
              <div className="mb-6">
                <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  <Code size={14} className="text-orange-400" /> Associated Code / Implementation
                </h4>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto">
                  {selectedTask.codeSnippet}
                </pre>
              </div>
            )}

            {/* Sub-Task Checklist */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Acceptance Criteria Checklist
              </h4>
              <div className="space-y-2">
                {selectedTask.checklist?.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklistItem(selectedTask.id, item.id)}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition cursor-pointer text-xs"
                  >
                    {item.done ? (
                      <CheckSquare size={16} className="text-emerald-400 shrink-0" />
                    ) : (
                      <Square size={16} className="text-slate-500 shrink-0" />
                    )}
                    <span className={item.done ? 'line-through text-slate-500' : 'text-slate-200'}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Discussion Comments */}
            <div className="border-t border-slate-800 pt-5">
              <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                <MessageSquare size={14} className="text-blue-400" /> Team Discussion & Updates
              </h4>

              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-1">
                {selectedTask.comments?.map((c) => (
                  <div key={c.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-orange-400">{c.author}</span>
                      <span className="text-[10px] text-slate-500">{c.time}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{c.text}</p>
                  </div>
                ))}

                {(!selectedTask.comments || selectedTask.comments.length === 0) && (
                  <p className="text-xs text-slate-500 italic p-3 text-center bg-slate-950/40 rounded-xl">
                    No comments yet. Start the discussion below.
                  </p>
                )}
              </div>

              {/* Add Comment Box */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Post an update or note..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Send size={13} /> Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal (PM Only) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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
                  placeholder="e.g. Implement WebSocket Real-time Sync"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Scope, acceptance criteria, or technical details..."
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Git Branch</label>
                  <input
                    type="text"
                    value={newGitBranch}
                    onChange={(e) => setNewGitBranch(e.target.value)}
                    placeholder="e.g. feat/kanban-dnd"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:border-orange-500 focus:outline-none"
                  />
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