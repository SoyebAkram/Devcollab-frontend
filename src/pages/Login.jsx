import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserCheck, Code2 } from 'lucide-react';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('DEVELOPER');

  // If already logged in, redirect immediately
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login({
      name: email.split('@')[0] || 'User',
      email: email || 'user@devcollab.local',
      role,
    });
    navigate('/dashboard');
  };

  const handleDemoLogin = (demoRole) => {
    if (demoRole === 'PROJECT_MANAGER') {
      login({
        name: 'Soyeb Akram',
        email: 'pm@devcollab.local',
        role: 'PROJECT_MANAGER',
      });
    } else {
      login({
        name: 'Shihab Shoron',
        email: 'dev@devcollab.local',
        role: 'DEVELOPER',
      });
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 mb-3 border border-orange-500/20">
            <Code2 size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">DevCollab</h1>
          <p className="text-slate-400 text-sm mt-1">Developer Collaboration & Project Management</p>
        </div>

        {/* Demo Quick Logins */}
        <div className="mb-6 p-3 bg-slate-900/60 rounded-xl border border-slate-700/60">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
            Quick Demo Login
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoLogin('PROJECT_MANAGER')}
              type="button"
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-500/30 rounded-lg text-xs font-medium transition cursor-pointer"
            >
              <ShieldCheck size={14} /> As Project Manager
            </button>
            <button
              onClick={() => handleDemoLogin('DEVELOPER')}
              type="button"
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-medium transition cursor-pointer"
            >
              <UserCheck size={14} /> As Developer
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500"
            >
              <option value="DEVELOPER">Developer</option>
              <option value="PROJECT_MANAGER">Project Manager</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-medium text-sm transition shadow-lg shadow-orange-600/20 cursor-pointer"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}