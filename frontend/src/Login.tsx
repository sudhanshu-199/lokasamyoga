import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Heart, HeartHandshake, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from './AuthContext';
import './Auth.css';

type Role = 'NGO' | 'Volunteer' | 'Donor' | 'Admin';

const ROLES: { id: Role; label: string; icon: React.ReactNode }[] = [
  { id: 'NGO', label: 'NGO', icon: <Building2 size={16} /> },
  { id: 'Volunteer', label: 'Volunteer', icon: <Heart size={16} /> },
  { id: 'Donor', label: 'Donor', icon: <HeartHandshake size={16} /> },
  { id: 'Admin', label: 'Admin', icon: <ShieldCheck size={16} /> },
];

export default function Login() {
  const [activeRole, setActiveRole] = useState<Role>('Volunteer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password, activeRole);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Log in to your Lokasamyoga account</p>
        </div>

        <div className="role-selector">
          {ROLES.map((role) => (
            <button
              key={role.id}
              className={`role-btn ${activeRole === role.id ? 'active' : ''}`}
              onClick={() => { setActiveRole(role.id); setError(''); }}
              type="button"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                {role.icon}
                <span>{role.label}</span>
              </div>
            </button>
          ))}
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder={`your_${activeRole.toLowerCase()}@example.com`} 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
            <a href="#" style={{ fontSize: '0.9rem' }}>Forgot password?</a>
          </div>

          <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Logging in...
              </span>
            ) : (
              `Log In as ${activeRole}`
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? 
          <Link to="/register">Sign up</Link>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
