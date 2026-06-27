import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react';
import { useAppDispatch } from '../../hooks/useStore';
import { setAdminToken } from '../../store/slices/adminAuthSlice';
import adminApi from '../../services/adminApi';
import { AdminButton, AdminField, AdminInput, AdminCard } from '../../components/admin/AdminUi';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { token } = await adminApi.login(password);
      dispatch(setAdminToken(token));
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl icon-box mb-4">
            <Shield className="w-7 h-7 text-accent-light" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Manage profile, sections, projects, and more
          </p>
        </div>

        <AdminCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminField label="Admin Password" required>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <AdminInput
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder="Enter ADMIN_PASSWORD"
                  autoFocus
                />
              </div>
            </AdminField>

            {error && <p className="text-sm text-danger">{error}</p>}

            <AdminButton type="submit" className="w-full" disabled={loading || !password}>
              {loading ? 'Signing in...' : 'Sign in'}
            </AdminButton>
          </form>
        </AdminCard>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Set <code className="text-accent-light">ADMIN_PASSWORD</code> in server/.env
        </p>
      </div>
    </div>
  );
}
