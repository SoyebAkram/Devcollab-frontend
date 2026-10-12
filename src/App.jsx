import React, { useState, useRef, useEffect } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
  useLocation
} from 'react-router-dom';
import {
  LayoutDashboard,
  Kanban,
  Bug,
  FolderGit2,
  ShieldCheck,
  Smartphone,
  Monitor,
  Bell,
  Sparkles,
  CheckCircle,
  Copy,
  X,
  ExternalLink,
  Users,
  ChevronRight,
  LogOut,
  Clock,
  Wifi,
  Battery
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import KanbanPage from './pages/KanbanPage';
import BugTracker from './pages/BugTracker';
import AuditLog from './pages/AuditLog';
import Login from './pages/Login';

// Standup Generator Modal
function DailyStandupModal({ isOpen, onClose, user, role }) {
  const [copied, setCopied] = useState(false);
  const [seed, setSeed] = useState(1);

  if (!isOpen) return null;

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const standups = [
    {
      yesterday: 'Finalized BugTracker responsive mobile card layout and resolved horizontal overflow issue.',
      today: 'Connecting Project Manager Audit Activity Log and testing role-based route permissions.',
      blockers: 'None currently. Frontend deployment live on GitHub Pages.'
    },
    {
      yesterday: 'Implemented Kanban drag-and-drop state updates and fixed CORS headers on /api/v1/tasks.',
      today: 'Conducting cross-device testing on phone view and sprint burndown report verification.',
      blockers: 'Waiting for team review on Sprint 3 user stories.'
    }
  ];

  const current = standups[seed % standups.length];

  const handleCopy = () => {
    const text = `*DevCollab Daily Scrum Standup (${dateStr})*\n*Member:* ${user?.name || 'Shihab Shoron'} (${role})\n\n*1. What did you accomplish yesterday?*\n- ${current.yesterday}\n\n*2. What will you do today?*\n- ${current.today}\n\n*3. Any blockers?*\n- ${current.blockers}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">Daily Scrum Standup</h3>
              <p className="text-xs text-slate-400">{dateStr}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-xs sm:text-sm">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <span className="font-semibold text-emerald-400 block mb-1">1. Accomplished Yesterday</span>
            <p className="text-slate-300 leading-relaxed">{current.yesterday}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <span className="font-semibold text-orange-400 block mb-1">2. Today's Plan</span>
            <p className="text-slate-300 leading-relaxed">{current.today}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <span className="font-semibold text-rose-400 block mb-1">3. Blockers</span>
            <p className="text-slate-300 leading-relaxed">{current.blockers}</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={() => setSeed(s => s + 1)}
            className="text-xs text-slate-400 hover:text-white transition cursor-pointer"
          >
            Regenerate Sample
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 transition shadow-sm cursor-pointer"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Notification Popover Dropdown
function NotificationPopover({ onClose }) {
  const notifications = [
    {
      id: 1,
      title: 'New Bug Reported',
      desc: 'BUG-101: Sign In button on mobile viewports',
      time: '12m ago',
      color: 'text-rose-400'
    },
    {
      id: 2,
      title: 'Audit Activity Logged',
      desc: 'Sprint 2 Burndown exported to PDF by Soyeb Akram',
      time: '1h ago',
      color: 'text-blue-400'
    },
    {
      id: 3,
      title: 'Kanban Card Moved',
      desc: 'FastAPI CORS header moved to Done',
      time: '3h ago',
      color: 'text-emerald-400'
    }
  ];

  return (
    <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 z-50">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <span className="text-xs font-bold text-white uppercase tracking-wider">Notifications</span>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white text-xs cursor-pointer"
        >
          Close
        </button>
      </div>
      <div className="divide-y divide-slate-800/60 mt-1 max-h-64 overflow-y-auto">
        {notifications.map(n => (
          <div key={n.id} className="py-2.5 first:pt-2 last:pb-1">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold ${n.color}`}>{n.title}</span>
              <span className="text-[10px] text-slate-500">{n.time}</span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 leading-snug">{n.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppContent() {
  const { user, role, isProjectManager, switchRole, logout } = useAuth();
  const [isPhoneView, setIsPhoneView] = useState(false);
  const [showStandupModal, setShowStandupModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const contentAreaRef = useRef(null);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (contentAreaRef.current) {
      contentAreaRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname]);

  const handleLogoClick = () => {
    window.location.hash = '#/dashboard';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (contentAreaRef.current) {
      contentAreaRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/kanban', label: 'Kanban Board', icon: Kanban },
    { to: '/bugs', label: 'Bug Tracker', icon: Bug, badge: 'Active' },
    { to: '/projects', label: 'Projects', icon: FolderGit2 },
    ...(isProjectManager
      ? [{ to: '/audit', label: 'Audit Log', icon: ShieldCheck, pmOnly: true }]
      : [])
  ];

  return (
    <>
      <DailyStandupModal
        isOpen={showStandupModal}
        onClose={() => setShowStandupModal(false)}
        user={user}
        role={role}
      />

      {isPhoneView ? (
        /* PHONE VIEW SIMULATOR */
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start py-3 px-2 sm:py-6 overflow-x-hidden w-full">
          {/* Top Switcher Bar */}
          <div className="w-full max-w-[390px] mb-3 flex items-center justify-between px-2 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-orange-500" />
              <span className="font-semibold text-slate-200">Phone View Simulator</span>
            </div>
            <button
              onClick={() => setIsPhoneView(false)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop View</span>
            </button>
          </div>

          {/* Simulated Phone Frame */}
          <div className="w-[390px] max-w-full h-[844px] max-h-[92vh] bg-slate-950 border-[10px] border-slate-800 rounded-[50px] shadow-2xl flex flex-col overflow-hidden relative ring-1 ring-slate-700/50 box-border">
            {/* Notch / Dynamic Island */}
            <div className="h-7 bg-slate-950 flex items-center justify-between px-6 pt-1 shrink-0 select-none text-[11px] font-semibold text-slate-400">
              <span>9:41</span>
              <div className="w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-950/80 mr-2"></div>
                <div className="w-2 h-2 rounded-full bg-slate-800"></div>
              </div>
              <div className="flex items-center gap-1">
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Phone Top Header */}
            <div className="h-13 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-3.5 shrink-0 z-10">
              <button
                onClick={handleLogoClick}
                className="flex items-center gap-2 text-left group cursor-pointer"
                title="DevCollab Home (Scroll to Top)"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  DC
                </div>
                <div>
                  <div className="font-bold text-sm text-white leading-tight flex items-center gap-1">
                    DevCollab
                    <span className="text-[10px] px-1 py-0.2 rounded bg-orange-500/20 text-orange-400 font-mono">v1.2</span>
                  </div>
                  <div className="text-[10px] text-slate-400 leading-none">CSE Dept, UITS</div>
                </div>
              </button>

              <div className="flex items-center gap-1.5">
                {/* Role Switcher Button */}
                <button
                  onClick={switchRole}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border cursor-pointer ${
                    isProjectManager
                      ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  }`}
                  title="Toggle Role (Project Manager / Developer)"
                >
                  {isProjectManager ? 'PM' : 'DEV'}
                </button>

                {/* Standup Trigger */}
                <button
                  onClick={() => setShowStandupModal(true)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                  title="Daily Scrum Standup"
                >
                  <Sparkles className="w-4 h-4 text-orange-400" />
                </button>

                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 relative cursor-pointer"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                    )}
                  </button>
                  {showNotifications && (
                    <NotificationPopover onClose={() => setShowNotifications(false)} />
                  )}
                </div>
              </div>
            </div>

            {/* Main Phone Content (Strictly Zero Horizontal Scroll) */}
            <main
              ref={contentAreaRef}
              className="flex-1 overflow-y-auto overflow-x-hidden p-3 w-full max-w-full box-border"
              style={{ maxWidth: '100%', overflowX: 'hidden' }}
            >
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/kanban" element={<KanbanPage />} />
                <Route path="/bugs" element={<BugTracker />} />
                <Route
                  path="/audit"
                  element={isProjectManager ? <AuditLog /> : <Navigate to="/dashboard" replace />}
                />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>

            {/* Phone Bottom Navigation Bar */}
            <nav className="h-14 bg-slate-900/95 backdrop-blur border-t border-slate-800 flex items-center justify-around px-2 shrink-0 z-10">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition py-1 px-2 rounded ${
                    isActive ? 'text-orange-500' : 'text-slate-400 hover:text-slate-200'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview</span>
              </NavLink>

              <NavLink
                to="/kanban"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition py-1 px-2 rounded ${
                    isActive ? 'text-orange-500' : 'text-slate-400 hover:text-slate-200'
                  }`
                }
              >
                <Kanban className="w-4 h-4" />
                <span>Kanban</span>
              </NavLink>

              <NavLink
                to="/bugs"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition py-1 px-2 rounded relative ${
                    isActive ? 'text-orange-500' : 'text-slate-400 hover:text-slate-200'
                  }`
                }
              >
                <Bug className="w-4 h-4" />
                <span>Bugs</span>
                <span className="absolute top-0.5 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
              </NavLink>

              <NavLink
                to="/projects"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition py-1 px-2 rounded ${
                    isActive ? 'text-orange-500' : 'text-slate-400 hover:text-slate-200'
                  }`
                }
              >
                <FolderGit2 className="w-4 h-4" />
                <span>Projects</span>
              </NavLink>

              {isProjectManager && (
                <NavLink
                  to="/audit"
                  className={({ isActive }) =>
                    `flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition py-1 px-2 rounded ${
                      isActive ? 'text-orange-500' : 'text-slate-400 hover:text-slate-200'
                    }`
                  }
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Audit</span>
                </NavLink>
              )}
            </nav>

            {/* Bottom Home Indicator */}
            <div className="h-4 bg-slate-950 flex items-center justify-center shrink-0">
              <div className="w-32 h-1 bg-slate-700 rounded-full"></div>
            </div>
          </div>
        </div>
      ) : (
        /* DESKTOP FULL-SCREEN DASHBOARD */
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
          {/* Desktop Left Sidebar */}
          <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
            {/* Brand Logo */}
            <div className="p-4 border-b border-slate-800">
              <button
                onClick={handleLogoClick}
                className="w-full flex items-center gap-3 text-left group cursor-pointer"
                title="Click to return to dashboard top"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg group-hover:bg-orange-500 transition">
                  DC
                </div>
                <div>
                  <div className="font-bold text-white text-base leading-tight flex items-center gap-1.5">
                    DevCollab
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      v1.2
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">CSE Dept, UITS</div>
                </div>
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="p-3 space-y-1 flex-1">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
                        isActive
                          ? 'bg-orange-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {item.badge}
                      </span>
                    )}
                    {item.pmOnly && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                        PM Only
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Quick Actions & Role Switcher */}
            <div className="p-3 border-t border-slate-800 space-y-2">
              <button
                onClick={() => setShowStandupModal(true)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  <span>Daily Standup</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={switchRole}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition cursor-pointer"
                title="Toggle between Project Manager and Developer roles"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>Role:</span>
                  <span className={`font-semibold ${isProjectManager ? 'text-orange-400' : 'text-blue-400'}`}>
                    {isProjectManager ? 'PM' : 'Developer'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 underline">Switch</span>
              </button>
            </div>

            {/* User Profile Card */}
            <div className="p-3 border-t border-slate-800 flex items-center justify-between bg-slate-900/80">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-orange-400">
                  {user?.name ? user.name[0] : (isProjectManager ? 'S' : 'A')}
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-white truncate">
                    {user?.name || (isProjectManager ? 'Soyeb Akram' : 'Shihab Shoron')}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {isProjectManager ? 'Project Manager' : 'Developer'}
                  </div>
                </div>
              </div>

              {logout && (
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </aside>

          {/* Desktop Right Main Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Desktop Top Header Bar */}
            <header className="h-16 bg-slate-900/80 backdrop-blur border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                <span className="hover:text-white cursor-pointer" onClick={handleLogoClick}>
                  DevCollab
                </span>
                <span>/</span>
                <span className="text-white font-medium capitalize">
                  {location.pathname.replace('/', '') || 'Overview'}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Phone View Mode Toggle Button */}
                <button
                  onClick={() => setIsPhoneView(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition cursor-pointer"
                  title="Switch to Phone View Simulator"
                >
                  <Smartphone className="w-4 h-4 text-orange-400" />
                  <span className="hidden sm:inline">Phone View</span>
                </button>

                {/* Daily Standup Button */}
                <button
                  onClick={() => setShowStandupModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  <span className="hidden sm:inline">Standup</span>
                </button>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 relative cursor-pointer"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                    )}
                  </button>
                  {showNotifications && (
                    <NotificationPopover onClose={() => setShowNotifications(false)} />
                  )}
                </div>

                {/* Active Role Pill */}
                <span
                  className={`hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    isProjectManager
                      ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  }`}
                >
                  {isProjectManager ? 'Project Manager' : 'Developer'}
                </span>
              </div>
            </header>

            {/* Desktop Main Content Area */}
            <main
              ref={contentAreaRef}
              className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950 w-full"
            >
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/kanban" element={<KanbanPage />} />
                <Route path="/bugs" element={<BugTracker />} />
                <Route
                  path="/audit"
                  element={isProjectManager ? <AuditLog /> : <Navigate to="/dashboard" replace />}
                />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}