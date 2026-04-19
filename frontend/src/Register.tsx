import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Heart, HeartHandshake, Loader2 } from 'lucide-react';
import { useAuth } from './AuthContext';
import './Auth.css';

type Role = 'NGO' | 'Volunteer' | 'Donor'; // Removed Admin from registration

const ROLES: { id: Role; label: string; icon: React.ReactNode }[] = [
  { id: 'NGO', label: 'NGO', icon: <Building2 size={16} /> },
  { id: 'Volunteer', label: 'Volunteer', icon: <Heart size={16} /> },
  { id: 'Donor', label: 'Donor', icon: <HeartHandshake size={16} /> },
];

export default function Register() {
  const [activeRole, setActiveRole] = useState<Role>('Volunteer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regId, setRegId] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const result = await register(
        name,
        email,
        password,
        activeRole,
        activeRole === 'NGO' ? regId : undefined
      );

      if (activeRole === 'NGO' && !result.isApproved) {
        setSuccessMsg('NGO registered successfully! Your account is pending admin approval. You will be able to log in once approved.');
        // Don't navigate — show success message instead
      } else {
        // Volunteers and Donors are auto-approved, go straight to dashboard
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join us to make a difference</p>
        </div>

        <div className="role-selector">
          {ROLES.map((role) => (
            <button
              key={role.id}
              className={`role-btn ${activeRole === role.id ? 'active' : ''}`}
              onClick={() => { setActiveRole(role.id); setError(''); setSuccessMsg(''); }}
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

        {successMsg && (
          <div className="auth-success">
            {successMsg}
            <div style={{ marginTop: '1rem' }}>
              <Link to="/login" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>
                Go to Login
              </Link>
            </div>
          </div>
        )}

        {!successMsg && (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">
                {activeRole === 'NGO' ? 'Organization Name' : 'Full Name'}
              </label>
              <input 
                type="text" 
                className="form-input" 
                placeholder={activeRole === 'NGO' ? 'Ocean Keepers Foundation' : 'John Doe'} 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="hello@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            {activeRole === 'NGO' && (
              <div className="form-group">
                <label className="form-label">Registration Number / ID</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="NGO-REG-12345" 
                  required 
                  value={regId}
                  onChange={(e) => setRegId(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}

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

            <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Registering...
                </span>
              ) : (
                `Register as ${activeRole}`
              )}
            </button>
          </form>
        )}

        <div className="auth-footer">
          Already have an account? 
          <Link to="/login">Log in</Link>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
