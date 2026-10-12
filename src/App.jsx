import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import KanbanPage from './pages/KanbanPage';
import BugTracker from './pages/BugTracker';
import { LogOut, LayoutDashboard, Bug, FolderKanban, FolderGit2 } from 'lucide-react';

function Layout({ children }) {
  const { user, logout, isProjectManager } = useAuth();
  const location = useLocation();

  const handleBrandClick = () => {
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', path: '/projects', icon: FolderGit2 },
    { label: 'Kanban Board', path: '/kanban', icon: FolderKanban },
    { label: 'Bug Tracker', path: '/bugs', icon: Bug },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Logo as Clickable Homepage Button */}
          <Link
            to="/dashboard"
            onClick={handleBrandClick}
            className="flex items-center gap-2.5 mb-8 group cursor-pointer"
            title="Go to Homepage"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-600 group-hover:bg-orange-500 flex items-center justify-center font-bold text-white shadow-lg shadow-orange-600/30 transition">
              D
            </div>
            <span className="font-bold text-lg text-white group-hover:text-orange-400 tracking-tight transition">
              DevCollab
            </span>
          </Link>

          <nav className="space-y-1.5 text-sm font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                    isActive
                      ? 'bg-orange-600/20 text-orange-400 font-semibold border border-orange-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon size={18} /> {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-4 border-t border-slate-800">
          <div className="mb-3">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <span
              className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full inline-block mt-1 ${
                isProjectManager
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}
            >
              {isProjectManager ? 'Project Manager' : 'Developer'}
            </span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 transition cursor-pointer"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}

function ProtectedApp() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/kanban" element={<KanbanPage />} />
        <Route path="/bugs" element={<BugTracker />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<ProtectedApp />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}