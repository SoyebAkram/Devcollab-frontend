import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import KanbanPage from './pages/KanbanPage';
import BugTracker from './pages/BugTracker';
import { 
  LogOut, 
  LayoutDashboard, 
  Bug, 
  FolderKanban, 
  FolderGit2,
  Bell,
  Smartphone,
  Monitor
} from 'lucide-react';

function Layout({ children }) {
  const { user, logout, isProjectManager } = useAuth();
  const location = useLocation();

  const [deviceMode, setDeviceMode] = useState('desktop'); // 'desktop' | 'mobile'
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Soyeb Akram assigned you to "FastAPI Backend & DB"', time: '2h ago', read: false },
    { id: 2, text: 'Shihab Shoron reported High-priority bug #101', time: '4h ago', read: false },
    { id: 3, text: 'Sprint velocity reached 68% ahead of target', time: '1d ago', read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleBrandClick = () => {
    const mainEl = document.querySelector('main');
    if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
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
            className="flex items-center gap-2.5 mb-6 group cursor-pointer"
            title="Go to Homepage"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-600 group-hover:bg-orange-500 flex items-center justify-center font-bold text-white shadow-lg shadow-orange-600/30 transition">
              D
            </div>
            <span className="font-bold text-lg text-white group-hover:text-orange-400 tracking-tight transition">
              DevCollab
            </span>
          </Link>

          {/* Viewport Switcher Control Button */}
          <div className="mb-6 p-2 bg-slate-950/80 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1.5 px-1">
              <span>View Mode</span>
              <span className="text-[10px] text-orange-400 uppercase font-bold">{deviceMode}</span>
            </div>
            <div className="grid grid-cols-2 gap-1 bg-slate-900 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setDeviceMode('desktop')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition cursor-pointer ${
                  deviceMode === 'desktop'
                    ? 'bg-orange-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor size={13} /> Desktop
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode('mobile')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition cursor-pointer ${
                  deviceMode === 'mobile'
                    ? 'bg-orange-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone size={13} /> Phone
              </button>
            </div>
          </div>

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

        {/* User Card, Notification Bell & Logout */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-white truncate max-w-[130px]">{user?.name}</p>
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

            {/* Notification Bell Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition relative cursor-pointer"
                title="Notifications"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {showNotifications && (
                <div className="absolute bottom-10 left-0 w-64 bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                    <span className="font-bold text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[10px] text-orange-400 hover:text-orange-300 font-semibold cursor-pointer"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2 rounded-lg leading-relaxed ${
                          n.read ? 'bg-slate-950/40 text-slate-400' : 'bg-slate-800/80 text-slate-200 border-l-2 border-orange-500'
                        }`}
                      >
                        <p className="text-[11px]">{n.text}</p>
                        <span className="text-[9px] text-slate-500 mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 transition cursor-pointer"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main Content View with Dynamic Desktop vs Phone Simulator */}
      {deviceMode === 'desktop' ? (
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      ) : (
        <div className="flex-1 p-6 flex flex-col items-center justify-start overflow-y-auto bg-slate-950">
          <div className="flex items-center gap-2 mb-3 text-xs text-slate-400 font-medium">
            <Smartphone size={14} className="text-orange-400" />
            <span>Interactive Mobile Viewport Preview (390px)</span>
          </div>

          {/* Smartphone Hardware Frame Mockup */}
          <div className="w-[390px] h-[810px] bg-slate-900 border-[6px] border-slate-700/80 rounded-[44px] shadow-2xl overflow-hidden flex flex-col relative ring-2 ring-slate-800">
            {/* Dynamic Island / Notch */}
            <div className="h-6 bg-slate-950 flex items-center justify-center shrink-0">
              <div className="w-20 h-3.5 bg-slate-800 rounded-full" />
            </div>

            {/* Scrollable Mobile Screen */}
            <main className="flex-1 overflow-y-auto p-4 bg-slate-950">
              {children}
            </main>

            {/* Bottom Home Indicator Bar */}
            <div className="h-4 bg-slate-950 flex items-center justify-center shrink-0">
              <div className="w-32 h-1 bg-slate-600 rounded-full" />
            </div>
          </div>
        </div>
      )}
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