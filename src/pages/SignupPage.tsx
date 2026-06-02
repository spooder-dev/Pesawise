import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { Page } from '../types';
import { Mail, Lock, User, ChevronLeft, Eye, EyeOff } from 'lucide-react';

interface SignupPageProps {
  onNavigate: (page: Page) => void;
}

export default function SignupPage({ onNavigate }: SignupPageProps) {
  const { signUp, signInWithGoogle } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signUpError } = await signUp(email, password, fullName);
    if (signUpError) {
      setError(signUpError.message || 'Failed to create account');
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setLoading(true);
    const { error: googleError } = await signInWithGoogle();
    if (googleError) {
      setError(googleError.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1B5E20] flex flex-col justify-between pb-12">
      <div className="pt-6 px-5">
        <button
          onClick={() => onNavigate('welcome')}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5">
        <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 border border-white/20">
          <span className="text-3xl">💰</span>
        </div>

        <h1 className="text-white text-3xl font-bold text-center mb-2">Create account</h1>
        <p className="text-white/70 text-center text-sm mb-8">Join PesaWise and start your money journey</p>

        <form onSubmit={handleSignup} className="w-full max-w-sm space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-3">
              <p className="text-red-200 text-sm font-medium">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-white text-xs font-semibold uppercase tracking-wider mb-2">Full name</label>
            <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus-within:border-[#69F0AE] focus-within:bg-white/20 transition-all">
              <User size={18} className="text-white/50" />
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Amara Osei"
                required
                className="flex-1 bg-transparent text-white outline-none placeholder-white/40"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-xs font-semibold uppercase tracking-wider mb-2">Email</label>
            <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus-within:border-[#69F0AE] focus-within:bg-white/20 transition-all">
              <Mail size={18} className="text-white/50" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 bg-transparent text-white outline-none placeholder-white/40"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-xs font-semibold uppercase tracking-wider mb-2">Password</label>
            <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus-within:border-[#69F0AE] focus-within:bg-white/20 transition-all">
              <Lock size={18} className="text-white/50" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                className="flex-1 bg-transparent text-white outline-none placeholder-white/40"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-white/50 hover:text-white/70 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#69F0AE] hover:bg-white text-[#1B5E20] font-bold py-4 rounded-2xl text-base shadow-lg shadow-[#69F0AE]/30 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="w-full max-w-sm mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-white/60 text-xs font-medium">Or continue with</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>
        </div>

        <p className="text-white/70 text-sm text-center mt-6">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="text-[#69F0AE] font-semibold hover:text-white transition-colors"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
