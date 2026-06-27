import { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, LogOut, ExternalLink, Shield, MessageSquare, Sparkles } from 'lucide-react';
import { useAppDispatch } from '../../hooks/useStore';
import { logout } from '../../store/slices/adminAuthSlice';
import { AdminButton } from '../../components/admin/AdminUi';
import adminApi from '../../services/adminApi';

/*
  To add a new admin page:
  1. Add an entry to NAV_ITEMS below.
  2. Add the <Route> in App.jsx.
  That's it — navigation, active state, and badges are handled automatically.
*/
const NAV_ITEMS = [
  {
    to: '/admin',
    label: 'Sections',
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: '/admin/profile',
    label: 'Profile',
    icon: User,
  },
  {
    to: '/admin/reviews',
    label: 'Reviews',
    icon: MessageSquare,
    badgeKey: 'pendingReviews', // resolved from liveData below
  },
  {
    to: '/admin/ask-sessions',
    label: 'Ask Sessions',
    icon: Sparkles,
  },
];

export default function AdminLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [liveData, setLiveData] = useState({ pendingReviews: 0 });

  // Fetch live badge counts once on mount
  useEffect(() => {
    adminApi.getReviews('all')
      .then(({ pendingCount }) => setLiveData({ pendingReviews: pendingCount || 0 }))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-surface flex">
      <aside className="w-56 shrink-0 border-r border-surface-border bg-surface-raised flex flex-col">
        {/* Branding */}
        <div className="p-4 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent-light" />
            <span className="font-semibold text-foreground">Admin</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">Portfolio CMS</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end, badgeKey }) => {
            const badge = badgeKey ? liveData[badgeKey] : 0;
            return (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm transition-colors border ${
                    isActive
                      ? 'nav-item-active font-medium'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-surface-overlay'
                  }`
                }
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </span>
                {badge > 0 && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-warning-bg text-warning-fg font-semibold leading-none">
                    {badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-surface-border space-y-0.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View site
          </a>
          <AdminButton variant="ghost" className="w-full justify-start text-sm" onClick={handleLogout}>
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
