import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

export default function Signup() {
  const [name, setName] = useState('');
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
      const response = await authAPI.signup(email, password, name);
      login(response.user, response.token);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-black to-black px-4 py-12">
      <section className="order-1 relative w-full max-w-2xl">
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
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">Create account</h1>
                <p className="text-sm mt-1.5 text-gray-400">Join with your name, email, and password.</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/40 text-red-100 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="name" className="block text-xs font-medium mb-1.5 text-gray-300">Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" />
                        <path d="M4 22c0-4.418 3.582-8 8-8s8 3.582 8 8" />
                      </svg>
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg placeholder-gray-500 ring-1 focus:ring-2 focus:ring-gray-400/50 focus:outline-none transition px-10 py-2.5 text-sm bg-gray-900/50 text-gray-100 ring-gray-600/30"
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>

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
                      autoComplete="new-password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg placeholder-gray-500 ring-1 focus:ring-2 focus:ring-gray-400/50 focus:outline-none transition px-10 pr-11 py-2.5 text-sm bg-gray-900/50 text-gray-100 ring-gray-600/30"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  loading={loading}
                  className="w-full"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </Button>

              </form>
              <div className="mt-8 text-xs text-gray-500 flex items-center justify-between">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="hover:underline underline-offset-4 text-gray-300 hover:text-white">
                    Log in
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
