import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';
import './AuthModal.css';

export default function AuthModal({ mode = 'login', onClose }) {
  const [authMode, setAuthMode] = useState(mode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authMode === 'signup') {
        if (!displayName.trim()) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        await signUp(email, password, displayName.trim());
      } else {
        await signIn(email, password);
      }
      onClose?.();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="auth-modal">
        <div className="auth-modal-header">
          <button className="auth-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
          <h2 className="auth-modal-title">
            {authMode === 'login' ? 'Welcome Back!' : 'Join THE REM OAK'}
          </h2>
          <p className="auth-modal-subtitle">
            {authMode === 'login'
              ? 'Log in to review and discover hidden gems'
              : 'Create an account to start sharing your travels'}
          </p>
        </div>

        <div className="auth-modal-body">
          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {authMode === 'signup' && (
              <div className="auth-form-group">
                <label htmlFor="auth-name">Display Name</label>
                <input
                  id="auth-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
            )}

            <div className="auth-form-group">
              <label htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="auth-form-group">
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                minLength={6}
                required
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading
                ? 'Please wait...'
                : authMode === 'login'
                ? 'Log In'
                : 'Create Account'}
            </button>
          </form>

          <div className="auth-switch">
            {authMode === 'login' ? (
              <>
                Don't have an account?
                <button onClick={() => { setAuthMode('signup'); setError(''); }}>
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?
                <button onClick={() => { setAuthMode('login'); setError(''); }}>
                  Log In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
