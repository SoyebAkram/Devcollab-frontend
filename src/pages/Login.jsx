import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserCheck, Code2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('DEVELOPER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const toBackendRole = (r) => (r === 'PROJECT_MANAGER' ? 'Project Manager' : 'Developer');
  const toFrontendRole = (r) =>
    r === 'Project Manager' || r === 'PROJECT_MANAGER' ? 'PROJECT_MANAGER' : 'DEVELOPER';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const regRes = await fetch(`${API_BASE}/api/v1/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim() || email.split('@')[0],
            email,
            password,
            role: toBackendRole(role),
          }),
        });
        if (!regRes.ok) {
          const errData = await regRes.json().catch(() => ({}));
          throw new Error(errData.detail || 'Registration failed');
        }
      }

      const loginRes = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) {
        const errData = await loginRes.json().catch(() => ({}));
        throw new Error(errData.detail || 'Invalid email or password');
      }

      const data = await loginRes.json();
      login(
        {
          name: data.user.name,
          email: data.user.email,
          role: toFrontendRole(data.user.role),
        },
        data.access_token
      );
      navigate('/dashboard');
    } catch (err) {
      // Fallback to localStorage if backend server is offline
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        const saved = JSON.parse(localStorage.getItem('devcollab_accounts') || '[]');
        if (mode === 'signup') {
          if (saved.some((a) => a.email === email)) {
            setError('Email already registered locally.');
            setLoading(false);
            return;
          }
          const acc = { name: name.trim() || email.split('@')[0], email, password, role };
          localStorage.setItem('devcollab_accounts', JSON.stringify([...saved, acc]));
          login({ name: acc.name, email: acc.email, role: acc.role });
          navigate('/dashboard');
        } else {
          const found = saved.find((a) => a.email === email && a.password === password);
          if (found) {
            login({ name: found.name, email: found.email, role: found.role });
          } else {
            login({ name: email.split('@')[0] || 'User', email, role });
          }
          navigate('/dashboard');
        }
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoRole) => {
    if (demoRole === 'PROJECT_MANAGER') {
      login({
        name: 'Soyeb Akram',
        email: 'soyeb@uits.edu.bd',
        role: 'PROJECT_MANAGER',
      });
    } else {
      login({
        name: 'Shihab Shoron',
        email: 'shihab@uits.edu.bd',
        role: 'DEVELOPER',
      });
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 mb-3 border border-orange-500/20">
            <Code2 size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">DevCollab</h1>
          <p className="text-slate-400 text-sm mt-1">Developer Collaboration & Project Management</p>
        </div>

        {/* Sign In / Sign Up Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900 rounded-xl border border-slate-700 mb-5">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(''); }}
            className={`py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              mode === 'signin' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); }}
            className={`py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              mode === 'signup' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Demo Quick Logins */}
        <div className="mb-5 p-3 bg-slate-900/60 rounded-xl border border-slate-700/60">
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

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Soyeb Akram"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>
          )}

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
            disabled={loading}
            className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-60 text-white rounded-lg font-medium text-sm transition shadow-lg shadow-orange-600/20 cursor-pointer"
          >
            {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}