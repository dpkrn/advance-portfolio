import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, LogOut, ExternalLink, Shield } from 'lucide-react';
import { useAppDispatch } from '../../hooks/useStore';
import { logout } from '../../store/slices/adminAuthSlice';
import { AdminButton } from '../../components/admin/AdminUi';

const nav = [
  { to: '/admin', label: 'Sections', icon: LayoutDashboard, end: true },
  { to: '/admin/profile', label: 'Profile', icon: User },
];

export default function AdminLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-surface flex">
      <aside className="w-56 shrink-0 border-r border-surface-border bg-surface-raised flex flex-col">
        <div className="p-4 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent-light" />
            <span className="font-semibold text-foreground">Admin</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Portfolio CMS</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'nav-item-active border'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface-overlay border border-transparent'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-surface-border space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View site
          </a>
          <AdminButton variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Log out
          </AdminButton>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
