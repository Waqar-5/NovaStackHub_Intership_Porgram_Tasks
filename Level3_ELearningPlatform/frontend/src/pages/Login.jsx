import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-3xl text-ink tracking-tight">
            Ledger<span className="text-amber">.</span>
          </p>
          <p className="text-sm text-slate mt-2">Welcome back. Let's pick up where you left off.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-chalk border border-line rounded-chip p-7 space-y-4">
          {error && (
            <p className="text-sm text-clay bg-clay/10 border border-clay/20 rounded-chip px-3 py-2">
              {error}
            </p>
          )}

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-slate mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 border border-line rounded-chip text-sm outline-none focus:border-amber transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-slate mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 border border-line rounded-chip text-sm outline-none focus:border-amber transition-colors"
            />
          </div>

          <Button type="submit" variant="accent" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>

          <p className="text-xs text-slate/70 text-center pt-1">
            Demo mode — any email & password will work.
          </p>
        </form>

        <p className="text-center text-sm text-slate mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-amber-dark font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
