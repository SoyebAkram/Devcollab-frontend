import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FolderGit2, 
  Plus, 
  Calendar, 
  Users, 
  UserPlus, 
  UserMinus, 
  Trash2
} from 'lucide-react';

const INITIAL_PROJECTS = [
  {
    id: 1,
    name: 'DevCollab System Core',
    description: 'Centralized developer collaboration platform with Kanban and Bug Tracking.',
    status: 'IN_PROGRESS',
    deadline: '2026-11-15',
    progress: 65,
    members: ['Soyeb Akram', 'Shihab Shoron'],
  },
  {
    id: 2,
    name: 'FastAPI Backend & DB Migrations',
    description: 'RESTful API with JWT authentication, PostgreSQL, and Alembic migrations.',
    status: 'IN_PROGRESS',
    deadline: '2026-10-30',
    progress: 80,
    members: ['Shihab Shoron'],
  },
  {
    id: 3,
    name: 'DevCollab Mobile UI Prototype',
    description: 'Responsive mobile web layout and offline task caching exploration.',
    status: 'PLANNING',
    deadline: '2026-12-05',
    progress: 25,
    members: ['Soyeb Akram'],
  },
];

const AVAILABLE_DEVELOPERS = [
  { name: 'Shihab Shoron', email: 'dev@devcollab.local', role: 'Fullstack Dev' },
  { name: 'Soyeb Akram', email: 'pm@devcollab.local', role: 'Project Manager' },
  { name: 'Rafiqul Islam', email: 'rafiq@devcollab.local', role: 'Frontend Dev' },
  { name: 'Nusrat Jahan', email: 'nusrat@devcollab.local', role: 'QA Engineer' },
];

export default function Projects() {
  const { user, isProjectManager } = useAuth();
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeProjectForMember, setActiveProjectForMember] = useState(null);

  // New Project Form
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectDeadline, setProjectDeadline] = useState('');

  // Add Member State
  const [selectedDeveloper, setSelectedDeveloper] = useState(AVAILABLE_DEVELOPERS[0].name);

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!isProjectManager) return;

    const newProject = {
      id: Date.now(),
      name: projectName,
      description: projectDesc,
      status: 'PLANNING',
      deadline: projectDeadline || '2026-12-31',
      progress: 0,
      members: [user?.name || 'Project Manager'],
    };

    setProjects([newProject, ...projects]);
    setIsCreateModalOpen(false);
    setProjectName('');
    setProjectDesc('');
    setProjectDeadline('');
  };

  const handleDeleteProject = (projectId) => {
    if (!isProjectManager) return;
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  const handleAddMember = (projectId) => {
    if (!isProjectManager) return;
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId && !p.members.includes(selectedDeveloper)) {
          return { ...p, members: [...p.members, selectedDeveloper] };
        }
        return p;
      })
    );
    setActiveProjectForMember(null);
  };

  const handleRemoveMember = (projectId, memberName) => {
    if (!isProjectManager) return;
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return { ...p, members: p.members.filter((m) => m !== memberName) };
        }
        return p;
      })
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Project & Team Management</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage active projects, assign developer teams, and monitor deadlines
          </p>
        </div>

        {isProjectManager && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-orange-600/20 transition cursor-pointer self-start md:self-auto"
          >
            <Plus size={16} /> New Project
          </button>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition"
          >
            <div>
              {/* Project Title & Status */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                    <FolderGit2 size={16} />
                  </span>
                  <h3 className="text-lg font-bold text-white">{project.name}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${
                    project.status === 'IN_PROGRESS'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {project.status.replace('_', ' ')}
                  </span>

                  {isProjectManager && (
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      title="Delete Project (PM Only)"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 transition cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-400 mb-5 leading-relaxed">
                {project.description}
              </p>

              {/* Progress Bar */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400 font-medium">Sprint Completion</span>
                  <span className="text-white font-bold">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Deadline & Meta */}
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                <Calendar size={14} className="text-orange-400" />
                <span>Target Deadline:</span>
                <strong className="text-slate-200">{project.deadline}</strong>
              </div>
            </div>

            {/* Team Members Section */}
            <div className="pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  <Users size={14} /> Assigned Team ({project.members.length})
                </div>

                {isProjectManager && (
                  <button
                    onClick={() => setActiveProjectForMember(project.id)}
                    className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 font-medium transition cursor-pointer"
                  >
                    <UserPlus size={13} /> Add Developer
                  </button>
                )}
              </div>

              {/* Member Tags */}
              <div className="flex flex-wrap gap-2">
                {project.members.map((member) => (
                  <span
                    key={member}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 border border-slate-700/80 rounded-lg text-xs text-slate-300"
                  >
                    <div className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-orange-400">
                      {member[0]}
                    </div>
                    {member}
                    {isProjectManager && project.members.length > 1 && (
                      <button
                        onClick={() => handleRemoveMember(project.id, member)}
                        title="Remove from team"
                        className="text-slate-500 hover:text-rose-400 transition ml-1 cursor-pointer"
                      >
                        <UserMinus size={12} />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Member Modal (PM Only) */}
      {activeProjectForMember && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 max-w-sm w-full rounded-2xl p-6 shadow-2xl">
            <h2 className="text-base font-bold text-white mb-2">Add Developer to Project</h2>
            <p className="text-xs text-slate-400 mb-4">
              Select a team member to assign to this project roster.
            </p>

            <div className="space-y-3 mb-6">
              <label className="block text-xs font-semibold text-slate-300">Available Developers</label>
              <select
                value={selectedDeveloper}
                onChange={(e) => setSelectedDeveloper(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:border-orange-500 focus:outline-none"
              >
                {AVAILABLE_DEVELOPERS.map((dev) => (
                  <option key={dev.name} value={dev.name}>
                    {dev.name} ({dev.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveProjectForMember(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAddMember(activeProjectForMember)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-orange-600/20 transition cursor-pointer"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal (PM Only) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full rounded-2xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Client Mobile App"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="Define scope, objectives, or key deliverables..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Deadline</label>
                <input
                  type="date"
                  value={projectDeadline}
                  onChange={(e) => setProjectDeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-orange-600/20 transition cursor-pointer"
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