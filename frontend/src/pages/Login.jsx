import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      login(response.user, response.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-black to-black px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating gradient orbs - more of them */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-3000" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-500/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-5000" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
        
        {/* Moving particles - increased quantity */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-float" />
        <div className="absolute top-20 right-20 w-1 h-1 bg-purple-400 rounded-full animate-float animation-delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-float animation-delay-2000" />
        <div className="absolute top-1/2 right-10 w-2 h-2 bg-blue-300 rounded-full animate-float animation-delay-3000" />
        <div className="absolute top-1/4 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-float animation-delay-4000" />
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-float animation-delay-5000" />
        <div className="absolute top-3/4 left-10 w-1.5 h-1.5 bg-violet-400 rounded-full animate-float animation-delay-1500" />
        <div className="absolute bottom-10 left-1/2 w-1 h-1 bg-sky-400 rounded-full animate-float animation-delay-2500" />
        <div className="absolute top-40 left-1/3 w-2 h-2 bg-purple-300 rounded-full animate-float animation-delay-3500" />
        <div className="absolute bottom-40 right-1/3 w-1.5 h-1.5 bg-blue-300 rounded-full animate-float animation-delay-4500" />
        
        {/* Animated lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent animate-pulse" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent animate-pulse animation-delay-2000" />
      </div>

      <section className="order-1 relative w-full max-w-2xl z-10">
        <div className="group relative w-full h-full">
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <div className="pointer-events-none absolute -inset-10 rounded-full bg-gradient-to-r from-transparent via-slate-800/30 to-transparent blur-xl opacity-40 animate-spin [animation-duration:10s]" />
            <div className="pointer-events-none absolute -inset-20 rounded-full bg-gradient-to-r from-transparent via-slate-900/25 to-transparent blur-2xl opacity-25 animate-spin [animation-duration:18s] [animation-direction:reverse]" />
          </div>

          <div className="absolute inset-0 rounded-2xl p-px bg-gradient-to-b transition-opacity duration-300 group-hover:opacity-100 from-slate-800/30 via-slate-900/50 to-slate-950/60" />

          <div
            className="relative h-full overflow-hidden ring-1 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-10px_rgba(15,23,42,0.7)] rounded-2xl shadow-inner ring-slate-800/50 hover:ring-slate-700/50"
            style={{
              backgroundColor: '#0b0d12',
              backgroundImage: `
                radial-gradient(at 88% 40%, rgba(17,24,39,0.9) 0px, transparent 85%),
                radial-gradient(at 49% 30%, rgba(15,23,42,0.85) 0px, transparent 85%),
                radial-gradient(at 14% 26%, rgba(15,23,42,0.85) 0px, transparent 85%),
                radial-gradient(at 0% 64%, rgba(30,41,59,0.6) 0px, transparent 85%),
                radial-gradient(at 41% 94%, rgba(30,41,59,0.5) 0px, transparent 85%),
                radial-gradient(at 100% 99%, rgba(30,41,59,0.45) 0px, transparent 85%)
              `,
            }}
          >
            <div className="relative sm:p-8 lg:p-10 flex flex-col h-full pt-6 pr-6 pb-6 pl-6">
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">Welcome back</h1>
                <p className="text-sm mt-1.5 text-gray-400">Use your email and password to continue.</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/40 text-red-100 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium mb-1.5 text-gray-300">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg placeholder-gray-500 ring-1 focus:ring-2 focus:ring-gray-400/50 focus:outline-none transition px-10 py-2.5 text-sm bg-gray-900/50 text-gray-100 ring-gray-600/30"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-xs font-medium mb-1.5 text-gray-300">Password</label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="m7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg placeholder-gray-500 ring-1 focus:ring-2 focus:ring-gray-400/50 focus:outline-none transition px-10 pr-11 py-2.5 text-sm bg-gray-900/50 text-gray-100 ring-gray-600/30"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>

              </form>
              <div className="mt-8 text-xs text-gray-500 flex items-center justify-between">
                <p>
                  Don&apos;t have an account?{' '}
                  <Link to="/signup" className="hover:underline underline-offset-4 text-gray-300 hover:text-white">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
