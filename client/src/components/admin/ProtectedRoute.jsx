import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useStore';

export default function ProtectedRoute({ children }) {
  const authenticated = useAppSelector((state) => state.adminAuth.authenticated);
  const location = useLocation();

  if (!authenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
